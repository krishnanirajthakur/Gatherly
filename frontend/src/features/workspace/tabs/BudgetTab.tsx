import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, Button, Input, Select, StatCard, Badge, ConfirmDialog, Dialog, ProgressBar } from '@/components/ui';
import { categoryStorage, expenseStorage } from '@/services/storage';
import { computeBudgetSummary } from '@/utils/budget';
import { formatCurrency } from '@/utils/helpers';
import { CATEGORY_COLORS } from '@/utils/constants';
import type { Event, BudgetCategory, Expense } from '@/types';

interface BudgetTabProps {
  event: Event;
}

export default function BudgetTab({ event }: BudgetTabProps) {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'expense'; id: string } | null>(null);

  const loadData = () => {
    setCategories(categoryStorage.getByEvent(event.id));
    setExpenses(expenseStorage.getByEvent(event.id));
  };

  useEffect(() => {
    loadData();
  }, [event.id]);

  const summary = useMemo(
    () => computeBudgetSummary(event.budget, categories, expenses),
    [event.budget, categories, expenses]
  );

  const pieData = summary.categoryBreakdown
    .map((c, i) => ({ name: c.categoryName, value: c.plannedAmount || c.actualAmount, color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
    .filter(d => d.value > 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Budget" value={formatCurrency(event.budget, event.currency)} icon="account_balance_wallet" />
        <StatCard label="Planned Spend" value={formatCurrency(summary.plannedExpenditure, event.currency)} icon="calculate" />
        <StatCard label="Actual Spend" value={formatCurrency(summary.actualExpenditure, event.currency)} icon="receipt" accent={summary.actualExpenditure > 0} />
        <StatCard label="Remaining" value={formatCurrency(summary.remaining, event.currency)} icon="savings" />
      </div>

      {/* Alerts */}
      {summary.isOverBudget && (
        <div className="bg-[#FEF2F2] border border-[#DC2626]/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#DC2626]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <p className="text-[14px] text-[#DC2626] font-medium">
            You have exceeded your budget by {formatCurrency(Math.abs(summary.remaining), event.currency)}.
          </p>
        </div>
      )}
      {summary.isNearLimit && !summary.isOverBudget && (
        <div className="bg-[#FEF9C3] border border-[#D97706]/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#D97706]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <p className="text-[14px] text-[#D97706] font-medium">
            You've used {summary.percentUsed}% of your budget. Approaching limit.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card padded>
          <h3 className="text-[14px] font-semibold text-[#252525] mb-4">Category Breakdown</h3>
          {pieData.length === 0 ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-[40px] text-[#E7E5E2]" style={{ fontVariationSettings: "'FILL' 1" }}>donut_large</span>
              <p className="text-[14px] text-[#747474] mt-2">Add budget categories to see the breakdown</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, event.currency)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {summary.categoryBreakdown.map((c, i) => (
                  <div key={c.categoryId} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                    <span className="text-[12px] text-[#252525] flex-1 truncate">{c.categoryName}</span>
                    <span className="text-[12px] text-[#747474] tabular-nums">{formatCurrency(c.plannedAmount, event.currency)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Categories & Expenses */}
        <div className="lg:col-span-2 space-y-5">
          {/* Categories */}
          <Card padded={false}>
            <div className="px-5 py-4 border-b border-[#E7E5E2] flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#252525]">Budget Categories</h3>
              <Button size="sm" icon="add" onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}>
                Add Category
              </Button>
            </div>
            {categories.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[14px] text-[#747474]">No budget categories yet.</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShowCategoryForm(true)}>
                  Add Category
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-[#E7E5E2]">
                {categories.map((cat, idx) => {
                  const bd = summary.categoryBreakdown.find(b => b.categoryId === cat.id);
                  const pct = event.budget > 0 ? Math.round((cat.plannedAmount / event.budget) * 100) : 0;
                  return (
                    <div key={cat.id} className="px-5 py-3 flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-sm shrink-0"
                        style={{ background: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[14px] font-medium text-[#252525]">{cat.name}</span>
                          <span className="text-[14px] tabular-nums text-[#252525] shrink-0">
                            {formatCurrency(cat.plannedAmount, event.currency)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <ProgressBar value={pct} className="flex-1" />
                          <span className="text-[12px] text-[#747474] w-8 text-right">{pct}%</span>
                        </div>
                        {bd && bd.actualAmount > 0 && (
                          <p className="text-[12px] text-[#747474] mt-0.5">
                            Actual: {formatCurrency(bd.actualAmount, event.currency)}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }}
                          className="p-1 rounded hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
                          aria-label={`Edit ${cat.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: 'category', id: cat.id })}
                          className="p-1 rounded hover:bg-[#FEF2F2] text-[#747474] hover:text-[#DC2626] transition-colors"
                          aria-label={`Delete ${cat.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Expenses */}
          <Card padded={false}>
            <div className="px-5 py-4 border-b border-[#E7E5E2] flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[#252525]">Expenses</h3>
              <Button size="sm" icon="add" onClick={() => { setEditingExpense(null); setShowExpenseForm(true); }}>
                Add Expense
              </Button>
            </div>
            {expenses.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-[14px] text-[#747474]">No expenses recorded yet.</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShowExpenseForm(true)}>
                  Add Expense
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[14px]">
                  <thead>
                    <tr className="border-b border-[#E7E5E2] bg-[#F7F7F5]">
                      <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Description</th>
                      <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Category</th>
                      <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Estimated</th>
                      <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Actual</th>
                      <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Status</th>
                      <th className="px-4 py-2.5 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E5E2]">
                    {expenses.map(exp => {
                      const cat = categories.find(c => c.id === exp.categoryId);
                      return (
                        <tr key={exp.id} className="hover:bg-[#F7F7F5]">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#252525]">{exp.description}</div>
                            {exp.vendor && <div className="text-[12px] text-[#747474]">{exp.vendor}</div>}
                          </td>
                          <td className="px-4 py-3 text-[12px] text-[#747474]">{cat?.name ?? '—'}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(exp.estimatedAmount, event.currency)}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-[#747474]">
                            {exp.actualAmount != null ? formatCurrency(exp.actualAmount, event.currency) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={exp.status === 'paid' ? 'success' : exp.status === 'cancelled' ? 'error' : 'warning'}>
                              {exp.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button
                                onClick={() => { setEditingExpense(exp); setShowExpenseForm(true); }}
                                className="p-1 rounded hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
                                aria-label="Edit expense"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'expense', id: exp.id })}
                                className="p-1 rounded hover:bg-[#FEF2F2] text-[#747474] hover:text-[#DC2626] transition-colors"
                                aria-label="Delete expense"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <CategoryFormDialog
        open={showCategoryForm}
        onClose={() => { setShowCategoryForm(false); setEditingCategory(null); }}
        eventId={event.id}
        editing={editingCategory}
        onSaved={loadData}
      />
      <ExpenseFormDialog
        open={showExpenseForm}
        onClose={() => { setShowExpenseForm(false); setEditingExpense(null); }}
        event={event}
        categories={categories}
        editing={editingExpense}
        onSaved={loadData}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === 'category') categoryStorage.delete(deleteTarget.id);
          else expenseStorage.delete(deleteTarget.id);
          setDeleteTarget(null);
          loadData();
        }}
        title={`Delete ${deleteTarget?.type === 'category' ? 'Category' : 'Expense'}`}
        message="This action cannot be undone."
        confirmLabel="Delete"
        dangerous
      />
    </div>
  );
}

// ─── Category Form ────────────────────────────────────────────────────────────

function CategoryFormDialog({
  open, onClose, eventId, editing, onSaved,
}: {
  open: boolean; onClose: () => void; eventId: string; editing: BudgetCategory | null; onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) { setName(editing.name); setAmount(String(editing.plannedAmount)); }
    else { setName(''); setAmount(''); }
    setError('');
  }, [editing, open]);

  const handleSave = () => {
    if (!name.trim()) { setError('Category name is required.'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 0) { setError('Enter a valid amount.'); return; }
    if (editing) categoryStorage.update(editing.id, { name: name.trim(), plannedAmount: amt });
    else categoryStorage.create({ eventId, name: name.trim(), plannedAmount: amt });
    onSaved();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Category' : 'Add Budget Category'}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
        <Input label="Category Name" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Catering" />
        <Input label="Planned Amount" required type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" min="0" />
      </div>
    </Dialog>
  );
}

// ─── Expense Form ─────────────────────────────────────────────────────────────

function ExpenseFormDialog({
  open, onClose, event, categories, editing, onSaved,
}: {
  open: boolean; onClose: () => void; event: Event; categories: BudgetCategory[]; editing: Expense | null; onSaved: () => void;
}) {
  const [desc, setDesc] = useState('');
  const [estimated, setEstimated] = useState('');
  const [actual, setActual] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState<Expense['status']>('pending');
  const [vendor, setVendor] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setDesc(editing.description);
      setEstimated(String(editing.estimatedAmount));
      setActual(editing.actualAmount != null ? String(editing.actualAmount) : '');
      setCategoryId(editing.categoryId ?? '');
      setStatus(editing.status);
      setVendor(editing.vendor ?? '');
    } else {
      setDesc(''); setEstimated(''); setActual(''); setCategoryId(''); setStatus('pending'); setVendor('');
    }
    setError('');
  }, [editing, open]);

  const handleSave = () => {
    if (!desc.trim()) { setError('Description is required.'); return; }
    const est = parseFloat(estimated);
    if (isNaN(est) || est < 0) { setError('Enter a valid estimated amount.'); return; }
    const data = {
      description: desc.trim(),
      estimatedAmount: est,
      actualAmount: actual ? parseFloat(actual) : undefined,
      categoryId: categoryId || undefined,
      status,
      vendor: vendor || undefined,
      source: 'manual' as const,
    };
    if (editing) expenseStorage.update(editing.id, data);
    else expenseStorage.create({ ...data, eventId: event.id });
    onSaved();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Expense' : 'Add Expense'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {error && <p className="sm:col-span-2 text-[13px] text-[#DC2626]">{error}</p>}
        <div className="sm:col-span-2">
          <Input label="Description" required value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Venue booking deposit" />
        </div>
        <Input label="Estimated Amount" required type="number" value={estimated} onChange={e => setEstimated(e.target.value)} min="0" />
        <Input label="Actual Amount" type="number" value={actual} onChange={e => setActual(e.target.value)} min="0" hint="Fill in when payment is confirmed" />
        <Select
          label="Category"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          options={categories.map(c => ({ value: c.id, label: c.name }))}
          placeholder="Uncategorised"
        />
        <Select
          label="Payment Status"
          value={status}
          onChange={e => setStatus(e.target.value as Expense['status'])}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
        <div className="sm:col-span-2">
          <Input label="Vendor / Payee" value={vendor} onChange={e => setVendor(e.target.value)} placeholder="e.g. Royal Feast Caterers" />
        </div>
      </div>
    </Dialog>
  );
}
