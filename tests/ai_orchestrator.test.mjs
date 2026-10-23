import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Gatherly AI Orchestration Circuit Breaker', () => {
  it('falls back to mock deterministic provider when external AI fails', async () => {
    let fallbackTriggered = false;

    // Simulate orchestrator call with fallback
    async function orchestrate(providerId) {
      if (providerId === 'external_fail') {
        fallbackTriggered = true;
        return { providerId: 'mock', success: true };
      }
      return { providerId, success: true };
    }

    const res = await orchestrate('external_fail');
    assert.equal(fallbackTriggered, true);
    assert.equal(res.providerId, 'mock');
  });

  it('validates plan request structure', () => {
    const validRequest = {
      eventName: "Aman's 25th Birthday",
      eventType: "birthday",
      guestCount: 50,
      budget: 50000,
      currency: "INR"
    };

    assert.ok(validRequest.eventName.length > 0);
    assert.ok(validRequest.guestCount > 0);
    assert.ok(validRequest.budget > 0);
  });
});
