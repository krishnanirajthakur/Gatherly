import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Test budget computation logic
function computeBudgetSummary(totalBudget, categories, expenses) {
  const plannedExpenditure = categories.reduce((sum, c) => sum + (c.plannedAmount || 0), 0);
  const actualExpenditure = expenses.reduce((sum, e) => sum + (e.actualAmount != null ? e.actualAmount : e.estimatedAmount || 0), 0);
  const remaining = totalBudget - actualExpenditure;
  const percentUsed = totalBudget > 0 ? Math.min(100, Math.round((actualExpenditure / totalBudget) * 100)) : 0;
  const isOverBudget = remaining < 0;
  const isNearLimit = !isOverBudget && totalBudget > 0 && remaining <= totalBudget * 0.1;

  const categoryBreakdown = categories.map((cat, idx) => {
    const catExpenses = expenses.filter(e => e.categoryId === cat.id);
    const catActual = catExpenses.reduce((sum, e) => sum + (e.actualAmount != null ? e.actualAmount : e.estimatedAmount || 0), 0);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      plannedAmount: cat.plannedAmount || 0,
      actualAmount: catActual,
      expenseCount: catExpenses.length,
      color: cat.color || '#E87524',
    };
  });

  return {
    totalBudget,
    plannedExpenditure,
    actualExpenditure,
    remaining,
    percentUsed,
    isOverBudget,
    isNearLimit,
    categoryBreakdown,
  };
}

describe('Gatherly Core Deterministic Budget Engine', () => {
  it('correctly calculates remaining budget and percent used', () => {
    const categories = [
      { id: '1', name: 'Venue', plannedAmount: 50000 },
      { id: '2', name: 'Catering', plannedAmount: 30000 },
    ];
    const expenses = [
      { id: 'e1', categoryId: '1', estimatedAmount: 50000, actualAmount: 45000 },
      { id: 'e2', categoryId: '2', estimatedAmount: 30000, actualAmount: 30000 },
    ];
    const summary = computeBudgetSummary(100000, categories, expenses);

    assert.equal(summary.totalBudget, 100000);
    assert.equal(summary.plannedExpenditure, 80000);
    assert.equal(summary.actualExpenditure, 75000);
    assert.equal(summary.remaining, 25000);
    assert.equal(summary.percentUsed, 75);
    assert.equal(summary.isOverBudget, false);
    assert.equal(summary.isNearLimit, false);
  });

  it('triggers isNearLimit when within 10% of total budget', () => {
    const categories = [{ id: '1', name: 'General', plannedAmount: 95000 }];
    const expenses = [{ id: 'e1', categoryId: '1', estimatedAmount: 95000, actualAmount: 92000 }];
    const summary = computeBudgetSummary(100000, categories, expenses);

    assert.equal(summary.percentUsed, 92);
    assert.equal(summary.isNearLimit, true);
    assert.equal(summary.isOverBudget, false);
  });

  it('detects over budget condition accurately', () => {
    const categories = [{ id: '1', name: 'General', plannedAmount: 110000 }];
    const expenses = [{ id: 'e1', categoryId: '1', estimatedAmount: 110000, actualAmount: 115000 }];
    const summary = computeBudgetSummary(100000, categories, expenses);

    assert.equal(summary.remaining, -15000);
    assert.equal(summary.isOverBudget, true);
  });
});
