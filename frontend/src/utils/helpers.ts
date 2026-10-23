import { Currency } from '@/types';
import { CURRENCY_SYMBOLS } from './constants';

// ─────────────────────────────────────────────────────────────────────────────
// Currency / Number formatting
// ─────────────────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (currency === 'INR') {
    // Indian number system: lakh, crore
    return `${symbol}${formatIndianNumber(amount)}`;
  }
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatIndianNumber(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  return n.toLocaleString('en-IN');
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-IN');
}

// ─────────────────────────────────────────────────────────────────────────────
// Date formatting
// ─────────────────────────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) !== 1 ? 's' : ''}`;
  if (diffDays < 365) return `In ${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) !== 1 ? 's' : ''}`;
  return formatDate(dateStr);
}

export function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateStr: string): boolean {
  return daysUntil(dateStr) < 0;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function subtractWeeks(dateStr: string, weeks: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - weeks * 7);
  return toISODate(date);
}

// ─────────────────────────────────────────────────────────────────────────────
// Misc
// ─────────────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural ?? singular + 's'}`;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
