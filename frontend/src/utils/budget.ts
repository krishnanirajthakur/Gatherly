import { BudgetCategory, BudgetSummary, CategoryBreakdown, Expense } from '@/types';
import { CATEGORY_COLORS } from './constants';
import { percentage } from './helpers';

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic budget calculations — never trust AI for these
// ─────────────────────────────────────────────────────────────────────────────

export function computeBudgetSummary(
  totalBudget: number,
  categories: BudgetCategory[],
  expenses: Expense[],
): BudgetSummary {
  const plannedExpenditure = categories.reduce((sum, c) => sum + c.plannedAmount, 0);

  // Actual = sum of all non-cancelled expense actualAmount (falling back to estimatedAmount)
  const activeExpenses = expenses.filter(e => e.status !== 'cancelled');
  const actualExpenditure = activeExpenses.reduce((sum, e) => {
    return sum + (e.actualAmount !== undefined ? e.actualAmount : 0);
  }, 0);

  const estimatedExpenditure = activeExpenses.reduce((sum, e) => sum + e.estimatedAmount, 0);

  const remaining = totalBudget - Math.max(actualExpenditure, estimatedExpenditure);
  const pct = percentage(Math.max(actualExpenditure, estimatedExpenditure), totalBudget);

  const categoryBreakdown: CategoryBreakdown[] = categories.map((cat, idx) => {
    const catExpenses = expenses.filter(e => e.categoryId === cat.id && e.status !== 'cancelled');
    const actual = catExpenses.reduce((sum, e) => sum + (e.actualAmount ?? e.estimatedAmount), 0);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      plannedAmount: cat.plannedAmount,
      actualAmount: actual,
      expenseCount: catExpenses.length,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    };
  });

  // Uncategorised expenses
  const uncategorisedExpenses = expenses.filter(
    e => !e.categoryId && e.status !== 'cancelled'
  );
  if (uncategorisedExpenses.length > 0) {
    const actual = uncategorisedExpenses.reduce((sum, e) => sum + (e.actualAmount ?? e.estimatedAmount), 0);
    categoryBreakdown.push({
      categoryId: 'uncategorised',
      categoryName: 'Other',
      plannedAmount: 0,
      actualAmount: actual,
      expenseCount: uncategorisedExpenses.length,
      color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
    });
  }

  return {
    totalBudget,
    plannedExpenditure,
    actualExpenditure,
    remaining,
    percentUsed: pct,
    isOverBudget: remaining < 0,
    isNearLimit: pct >= 80 && pct < 100,
    categoryBreakdown,
  };
}

export function validateBudgetAmount(value: string): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) return 'Please enter a valid number';
  if (num < 0) return 'Amount cannot be negative';
  if (num > 100_000_000_00) return 'Amount is unrealistically large';
  return null;
}

export function formatBudgetPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${percentage(value, total)}%`;
}
