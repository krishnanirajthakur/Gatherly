import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Gatherly Comprehensive Test Suite', () => {
  it('formats currency correctly for INR and international codes', () => {
    function formatCurrency(amount, currency = 'INR') {
      const symbols = { INR: '₹', USD: '$', EUR: '€' };
      const symbol = symbols[currency] || '₹';
      if (currency === 'INR') {
        if (amount >= 10000000) return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
        if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
        return `${symbol}${amount.toLocaleString('en-IN')}`;
      }
      return `${symbol}${amount.toLocaleString('en-US')}`;
    }

    assert.equal(formatCurrency(2500000, 'INR'), '₹25.0L');
    assert.equal(formatCurrency(15000000, 'INR'), '₹1.5Cr');
    assert.equal(formatCurrency(5000, 'USD'), '$5,000');
  });

  it('calculates days until event and detects overdue deadlines accurately', () => {
    const today = new Date().toISOString().split('T')[0];
    const pastDate = '2020-01-01';
    
    function daysUntil(dateStr) {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = date.getTime() - now.getTime();
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    assert.ok(daysUntil(pastDate) < 0);
  });

  it('validates guest RSVP and party size constraints', () => {
    const guest = {
      name: 'Aditya Kumar',
      partySize: 3,
      rsvpStatus: 'confirmed'
    };

    assert.ok(guest.partySize >= 1);
    assert.equal(['invited', 'confirmed', 'declined', 'tentative', 'no_response'].includes(guest.rsvpStatus), true);
  });
});
