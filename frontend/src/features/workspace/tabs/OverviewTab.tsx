import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Card, StatCard, Button, Badge, ProgressBar, EmptyState } from '@/components/ui';
import { taskStorage, expenseStorage, categoryStorage, vendorStorage, guestStorage } from '@/services/storage';
import { computeBudgetSummary } from '@/utils/budget';
import { formatCurrency, formatDate, formatRelativeDate, daysUntil } from '@/utils/helpers';
import { TASK_PRIORITY_LABELS } from '@/utils/constants';
import type { Event, Task } from '@/types';

function PriorityDot({ priority }: { priority: Task['priority'] }) {
  const colors: Record<string, string> = {
    low: 'bg-[#287A4B]',
    medium: 'bg-[#D97706]',
    high: 'bg-orange-primary',
    urgent: 'bg-[#DC2626]',
  };
  return (
    <span
      className={clsx('inline-block w-2 h-2 rounded-full shrink-0', colors[priority])}
      aria-label={TASK_PRIORITY_LABELS[priority]}
    />
  );
}

interface OverviewTabProps {
  event: Event;
  onRefresh: () => void;
}

export default function OverviewTab({ event, onRefresh: _ }: OverviewTabProps) {
  const navigate = useNavigate();
  const tasks = taskStorage.getByEvent(event.id);
  const categories = categoryStorage.getByEvent(event.id);
  const expenses = expenseStorage.getByEvent(event.id);
  const vendors = vendorStorage.getByEvent(event.id);
  const guests = guestStorage.getByEvent(event.id);
  const summary = computeBudgetSummary(event.budget, categories, expenses);

  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter(t => t.status !== 'done')
        .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
        .slice(0, 5),
    [tasks]
  );

  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const confirmedGuests = guests
    .filter(g => g.rsvpStatus === 'confirmed')
    .reduce((s, g) => s + g.partySize, 0);
  const daysLeft = daysUntil(event.startDate);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Countdown banner */}
      {daysLeft >= 0 && daysLeft <= 90 && (
        <div
          className={clsx(
            'rounded-xl px-5 py-4 flex items-center gap-3',
            daysLeft <= 7
              ? 'bg-[#FEF9C3] border border-[#D97706]/30'
              : 'bg-[#FFF1E5] border border-[#FBD9BE]'
          )}
        >
          <span className="material-symbols-outlined text-[24px] text-[#E87524]" style={{ fontVariationSettings: "'FILL' 1" }}>
            timer
          </span>
          <div>
            <p className="text-[14px] font-semibold text-[#252525]">
              {daysLeft === 0 ? '🎉 Event day is today!' : `${daysLeft} days until the event`}
            </p>
            <p className="text-[12px] text-[#747474]">
              {formatDate(event.startDate)}
              {event.location ? ` · ${event.location}` : ''}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Budget" value={formatCurrency(event.budget, event.currency)} icon="account_balance_wallet" />
        <StatCard label="Budget Used" value={`${summary.percentUsed}%`} icon="pie_chart" accent={summary.isNearLimit} />
        <StatCard label="Tasks Done" value={`${doneTasks}/${tasks.length}`} icon="checklist" />
        <StatCard label="Confirmed Guests" value={String(confirmedGuests)} icon="group" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Budget snapshot */}
        <Card padded>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#252525]">Budget Snapshot</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/budget`)}>
              View Budget
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-[#747474]">Total Budget</span>
              <span className="font-semibold tabular-nums">{formatCurrency(event.budget, event.currency)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#747474]">Planned Spend</span>
              <span className="font-semibold tabular-nums">{formatCurrency(summary.plannedExpenditure, event.currency)}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-[#747474]">Remaining</span>
              <span className={clsx('font-semibold tabular-nums', summary.isOverBudget ? 'text-[#DC2626]' : 'text-[#287A4B]')}>
                {formatCurrency(summary.remaining, event.currency)}
              </span>
            </div>
            <div className="pt-2">
              <ProgressBar value={summary.percentUsed} danger={summary.isOverBudget} showLabel />
            </div>
            {summary.isOverBudget && (
              <div className="flex items-center gap-1.5 text-[#DC2626] text-[12px]">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                Budget exceeded! Review your expenses.
              </div>
            )}
          </div>
        </Card>

        {/* Upcoming tasks */}
        <Card padded={false}>
          <div className="px-5 py-4 border-b border-[#E7E5E2] flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#252525]">Upcoming Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/tasks`)}>
              View All
            </Button>
          </div>
          {upcomingTasks.length === 0 ? (
            <EmptyState icon="checklist" title="All tasks done!" description="No pending tasks for this event." />
          ) : (
            <div className="divide-y divide-[#E7E5E2]">
              {upcomingTasks.map(t => {
                const overdue = t.dueDate ? daysUntil(t.dueDate) < 0 : false;
                return (
                  <div key={t.id} className="px-5 py-3 flex items-center gap-3">
                    <PriorityDot priority={t.priority} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[#252525] truncate">{t.title}</p>
                      {t.dueDate && (
                        <p className={clsx('text-[12px]', overdue ? 'text-[#DC2626]' : 'text-[#747474]')}>
                          {overdue ? 'Overdue · ' : ''}
                          {formatRelativeDate(t.dueDate)}
                        </p>
                      )}
                    </div>
                    <Badge variant={overdue ? 'error' : 'neutral'}>
                      {t.status === 'in_progress' ? 'In Progress' : 'To Do'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Vendors summary */}
        <Card padded>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#252525]">Vendors</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/vendors`)}>
              Manage
            </Button>
          </div>
          {vendors.length === 0 ? (
            <p className="text-[14px] text-[#747474]">No vendors added yet.</p>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-3">
                {([
                  ['Booked', vendors.filter(v => v.status === 'booked').length],
                  ['Quoted', vendors.filter(v => v.status === 'quoted').length],
                  ['Total', vendors.length],
                ] as [string, number][]).map(([l, v]) => (
                  <div key={l} className="text-center bg-[#F7F7F5] rounded-lg p-3">
                    <p className="text-[22px] font-semibold tabular-nums text-[#252525]">{v}</p>
                    <p className="text-[12px] text-[#747474]">{l}</p>
                  </div>
                ))}
              </div>
              {vendors.filter(v => v.status === 'booked').length === 0 && (
                <p className="text-[12px] text-[#D97706] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  No vendors booked yet
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Guest summary */}
        <Card padded>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-semibold text-[#252525]">Guests</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/guests`)}>
              Manage
            </Button>
          </div>
          {guests.length === 0 ? (
            <p className="text-[14px] text-[#747474]">No guests added yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {([
                ['Confirmed', guests.filter(g => g.rsvpStatus === 'confirmed').length],
                ['Invited', guests.filter(g => g.rsvpStatus === 'invited').length],
                ['Declined', guests.filter(g => g.rsvpStatus === 'declined').length],
                ['No Response', guests.filter(g => g.rsvpStatus === 'no_response').length],
              ] as [string, number][]).map(([l, v]) => (
                <div key={l} className="text-center bg-[#F7F7F5] rounded-lg p-3">
                  <p className="text-[22px] font-semibold tabular-nums text-[#252525]">{v}</p>
                  <p className="text-[12px] text-[#747474]">{l}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
