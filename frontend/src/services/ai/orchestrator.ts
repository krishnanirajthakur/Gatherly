import { AIProviderInfo, PlanRequest, PlanResponse } from '@/types';
import { mockGeneratePlan, MOCK_PROVIDER_INFO } from './mock';

// ─────────────────────────────────────────────────────────────────────────────
// Provider registry & orchestrator
// Supports sequential fallback, per-provider circuit breaker, timeouts.
// ─────────────────────────────────────────────────────────────────────────────

export type AIError =
  | { type: 'validation'; message: string }
  | { type: 'timeout'; providerId: string }
  | { type: 'provider_error'; providerId: string; message: string; retryable: boolean }
  | { type: 'all_providers_failed'; message: string }
  | { type: 'unconfigured'; message: string };

// Circuit breaker state per provider
const circuitState: Record<string, { failures: number; openedAt: number | null }> = {};
const CIRCUIT_THRESHOLD = 3;
const CIRCUIT_RESET_MS = 60_000; // 1 minute

function isCircuitOpen(providerId: string): boolean {
  const s = circuitState[providerId];
  if (!s || s.openedAt === null) return false;
  if (Date.now() - s.openedAt > CIRCUIT_RESET_MS) {
    // Half-open: allow one attempt
    circuitState[providerId] = { failures: 0, openedAt: null };
    return false;
  }
  return true;
}

function recordFailure(providerId: string): void {
  const s = circuitState[providerId] ?? { failures: 0, openedAt: null };
  s.failures += 1;
  if (s.failures >= CIRCUIT_THRESHOLD && s.openedAt === null) {
    s.openedAt = Date.now();
    console.warn(`[AI] Circuit opened for provider: ${providerId}`);
  }
  circuitState[providerId] = s;
}

function recordSuccess(providerId: string): void {
  circuitState[providerId] = { failures: 0, openedAt: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider type — minimal interface all providers implement
// ─────────────────────────────────────────────────────────────────────────────

interface ProviderAdapter {
  id: string;
  name: string;
  isConfigured(): boolean;
  generatePlan(req: PlanRequest, timeoutMs: number): Promise<PlanResponse>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Backend proxy adapter (used for Gemini, Groq, Ollama via server)
// ─────────────────────────────────────────────────────────────────────────────

function createBackendAdapter(id: string, name: string): ProviderAdapter {
  return {
    id,
    name,
    isConfigured() {
      // Will return true only when backend health check says this provider is enabled
      return false; // placeholder until backend is reachable
    },
    async generatePlan(req: PlanRequest, timeoutMs: number): Promise<PlanResponse> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider: id, request: req }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: 'Unknown error' }));
          const retryable = res.status === 429 || res.status >= 500;
          throw { type: 'provider_error', providerId: id, message: err.message ?? `HTTP ${res.status}`, retryable };
        }
        return await res.json() as PlanResponse;
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock adapter wrapper
// ─────────────────────────────────────────────────────────────────────────────

const mockAdapter: ProviderAdapter = {
  id: 'mock',
  name: 'Demo Mode',
  isConfigured: () => true,
  generatePlan: (req, _timeout) => mockGeneratePlan(req),
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider list (ordered: preferred first)
// ─────────────────────────────────────────────────────────────────────────────

const allProviders: ProviderAdapter[] = [
  createBackendAdapter('gemini', 'Google Gemini'),
  createBackendAdapter('groq', 'Groq'),
  createBackendAdapter('ollama', 'Ollama (Local)'),
  createBackendAdapter('openrouter', 'OpenRouter'),
  createBackendAdapter('cloudflare', 'Cloudflare Workers AI'),
  createBackendAdapter('huggingface', 'Hugging Face'),
  mockAdapter,
];

// ─────────────────────────────────────────────────────────────────────────────
// Orchestrator
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_TIMEOUT_MS = 30_000;
const MAX_ATTEMPTS = 3;

export async function orchestrateGeneratePlan(
  req: PlanRequest,
  options?: { preferredProvider?: string; fallbackEnabled?: boolean }
): Promise<{ result: PlanResponse; providerId: string }> {
  const { preferredProvider, fallbackEnabled = true } = options ?? {};

  // Build ordered provider list
  const ordered = preferredProvider
    ? [
        ...allProviders.filter(p => p.id === preferredProvider),
        ...(fallbackEnabled ? allProviders.filter(p => p.id !== preferredProvider) : []),
      ]
    : allProviders;

  const eligible = ordered.filter(p => p.isConfigured() && !isCircuitOpen(p.id));

  if (eligible.length === 0) {
    // Fallback to mock always
    const result = await mockGeneratePlan(req);
    return { result, providerId: 'mock' };
  }

  let attempts = 0;
  for (const provider of eligible) {
    if (attempts >= MAX_ATTEMPTS) break;
    attempts++;

    try {
      const result = await provider.generatePlan(req, DEFAULT_TIMEOUT_MS);
      recordSuccess(provider.id);
      return { result, providerId: provider.id };
    } catch (err) {
      recordFailure(provider.id);
      const isRetryable =
        typeof err === 'object' &&
        err !== null &&
        'retryable' in err &&
        (err as { retryable: boolean }).retryable;

      if (!isRetryable || !fallbackEnabled) {
        break;
      }
      // Continue to next provider
    }
  }

  // Final fallback: mock
  const result = await mockGeneratePlan(req);
  return { result, providerId: 'mock' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider info for UI display
// ─────────────────────────────────────────────────────────────────────────────

export function getProviderInfoList(): AIProviderInfo[] {
  const infos: AIProviderInfo[] = allProviders.map(p => ({
    id: p.id,
    name: p.name,
    status: p.isConfigured()
      ? isCircuitOpen(p.id)
        ? 'error'
        : 'available'
      : 'unconfigured',
    isDemo: p.id === 'mock',
    description: p.id === 'mock'
      ? 'Built-in demo provider. Always available.'
      : `Configure in backend .env to enable ${p.name}.`,
  }));
  return infos;
}

export { MOCK_PROVIDER_INFO };
