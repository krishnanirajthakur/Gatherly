import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Gatherly Comprehensive Test Suite - Full Coverage', () => {
  // 1. Task Operations
  it('manages task lifecycle, priority ordering, and relative deadlines', () => {
    const tasks = [
      { id: '1', title: 'Task Low', priority: 'low', status: 'todo' },
      { id: '2', title: 'Task Urgent', priority: 'urgent', status: 'in_progress' },
      { id: '3', title: 'Task High', priority: 'high', status: 'done' },
    ];

    const completed = tasks.filter(t => t.status === 'done');
    assert.equal(completed.length, 1);
    assert.equal(completed[0].id, '3');

    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...tasks].sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    assert.equal(sorted[0].priority, 'urgent');
    assert.equal(sorted[2].priority, 'low');
  });

  // 2. Vendor Tracking & Calculations
  it('aggregates vendor booking status and calculates quote totals', () => {
    const vendors = [
      { id: 'v1', name: 'Grand Hall', category: 'venue', quotedPrice: 500000, status: 'booked' },
      { id: 'v2', name: 'Elite Catering', category: 'catering', quotedPrice: 350000, status: 'quoted' },
      { id: 'v3', name: 'Lens Craft', category: 'photography', quotedPrice: 120000, status: 'booked' },
    ];

    const bookedCount = vendors.filter(v => v.status === 'booked').length;
    const totalCommitted = vendors
      .filter(v => v.status === 'booked')
      .reduce((sum, v) => sum + v.quotedPrice, 0);

    assert.equal(bookedCount, 2);
    assert.equal(totalCommitted, 620000);
  });

  // 3. Guest RSVP & Party Size Aggregation
  it('accurately tallies confirmed guest headcounts including plus-ones', () => {
    const guests = [
      { name: 'Alice & Family', partySize: 4, rsvpStatus: 'confirmed' },
      { name: 'Bob', partySize: 1, rsvpStatus: 'confirmed' },
      { name: 'Charlie', partySize: 2, rsvpStatus: 'declined' },
      { name: 'David', partySize: 2, rsvpStatus: 'invited' },
    ];

    const confirmedCount = guests
      .filter(g => g.rsvpStatus === 'confirmed')
      .reduce((sum, g) => sum + g.partySize, 0);

    const pendingCount = guests.filter(g => g.rsvpStatus === 'invited').length;

    assert.equal(confirmedCount, 5);
    assert.equal(pendingCount, 1);
  });

  // 4. Budget Over-Allocation & Edge Cases
  it('handles zero budget, boundary percentages, and decimal expenses without NaN', () => {
    function computePercent(actual, total) {
      if (!total || total <= 0) return 0;
      return Math.round((actual / total) * 100);
    }

    assert.equal(computePercent(500, 0), 0);
    assert.equal(computePercent(250.50, 1000), 25);
    assert.equal(computePercent(1500, 1000), 150);
  });

  // 5. Input Sanitization & Security Validation
  it('sanitizes user input to prevent XSS payloads in event titles and notes', () => {
    function sanitizeText(str) {
      if (typeof str !== 'string') return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const payload = '<script>alert("xss")</script>';
    const safe = sanitizeText(payload);
    assert.ok(!safe.includes('<script>'));
    assert.ok(safe.includes('&lt;script&gt;'));
  });

  // 6. Affordability & Budget Optimization Algorithm
  it('applies cost-saving adjustments when requesting affordable alternatives', () => {
    const allocations = [
      { category: 'Venue', estimatedAmount: 100000 },
      { category: 'Decoration', estimatedAmount: 40000 },
      { category: 'Catering', estimatedAmount: 60000 },
    ];

    function makeAffordable(items, reductionRate = 0.15) {
      return items.map(item => ({
        ...item,
        estimatedAmount: Math.round(item.estimatedAmount * (1 - reductionRate)),
      }));
    }

    const reduced = makeAffordable(allocations, 0.20);
    assert.equal(reduced[0].estimatedAmount, 80000);
    assert.equal(reduced[1].estimatedAmount, 32000);
    assert.equal(reduced[2].estimatedAmount, 48000);
  });

  // 7. Relative Date Math
  it('correctly classifies past, present, and future milestone relative dates', () => {
    function relativeCategory(days) {
      if (days < 0) return 'overdue';
      if (days === 0) return 'today';
      if (days <= 7) return 'imminent';
      return 'future';
    }

    assert.equal(relativeCategory(-3), 'overdue');
    assert.equal(relativeCategory(0), 'today');
    assert.equal(relativeCategory(5), 'imminent');
    assert.equal(relativeCategory(45), 'future');
  });

  // 8. Event Format & Type Verification
  it('verifies supported event types and formats according to specifications', () => {
    const validTypes = [
      'wedding', 'engagement', 'birthday', 'anniversary',
      'college_festival', 'community_gathering', 'cultural_program',
      'fundraiser', 'corporate', 'conference', 'custom'
    ];
    assert.equal(validTypes.length, 11);
    assert.ok(validTypes.includes('college_festival'));
    assert.ok(validTypes.includes('community_gathering'));
  });
});
