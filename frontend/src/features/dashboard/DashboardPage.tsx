import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useEvents } from '@/context/EventContext';
import { taskStorage, activityStorage } from '@/services/storage';
import { TopBar } from '@/components/layout/AppShell';
import { Card, StatCard, Button, Badge, EmptyState, ProgressBar } from '@/components/ui';
import { EVENT_TYPE_ICONS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '@/utils/constants';
import { formatCurrency, formatDate, formatRelativeDate, daysUntil } from '@/utils/helpers';
import { computeBudgetSummary } from '@/utils/budget';
import { categoryStorage, expenseStorage } from '@/services/storage';
import type { Event } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Event card component
// ─────────────────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: Event }) {
  const navigate = useNavigate();
  const days = daysUntil(event.startDate);
  const categories = categoryStorage.getByEvent(event.id);
  const expenses = expenseStorage.getByEvent(event.id);
  const summary = computeBudgetSummary(event.budget, categories, expenses);

  const statusBadge = {
    planning: <Badge variant="neutral" icon="edit">Planning</Badge>,
    in_progress: <Badge variant="accent" icon="schedule">In Progress</Badge>,
    completed: <Badge variant="success" icon="check_circle">Completed</Badge>,
    cancelled: <Badge variant="error" icon="cancel">Cancelled</Badge>,
  }[event.status];

  return (
    <Card
      className="hover:shadow-elevated transition-shadow cursor-pointer"
      onClick={() => navigate(`/events/${event.id}`)}
      padded={false}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 bg-orange-pale rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-orange-primary icon-filled">
                {EVENT_TYPE_ICONS[event.type] ?? 'event'}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-body-md-medium text-text-main truncate">{event.name}</h3>
              <p className="text-label-sm text-text-secondary">{EVENT_TYPE_LABELS[event.type]}</p>
            </div>
          </div>
          {statusBadge}
        </div>

        <div className="flex items-center gap-4 mb-3 text-label-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {formatDate(event.startDate)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span className="truncate">{event.location}</span>
            </span>
          )}
        </div>

        {days >= -30 && days <= 365 && (
          <p className={clsx('text-label-sm font-medium mb-3', days < 0 ? 'text-error-text' : days < 7 ? 'text-warning-text' : 'text-orange-primary')}>
            {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? 'Today!' : `${days} days to go`}
          </p>
        )}

        <div className="border-t border-border-default pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-label-sm text-text-secondary">Budget used</span>
            <span className={clsx('text-label-sm tabular-nums font-medium', summary.isOverBudget ? 'text-error-text' : 'text-text-main')}>
              {formatCurrency(Math.max(summary.actualExpenditure, summary.plannedExpenditure), event.currency)} / {formatCurrency(event.budget, event.currency)}
            </span>
          </div>
          <ProgressBar value={summary.percentUsed} danger={summary.isOverBudget} />
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────

interface DashboardPageProps {
  onMenuClick?: () => void;
}

export default function DashboardPage({ onMenuClick }: DashboardPageProps) {
  const { events, loading } = useEvents();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Aggregate stats
  const stats = useMemo(() => {
    const allTasks = taskStorage.getAll();
    const eventIds = events.map(e => e.id);
    const eventTasks = allTasks.filter(t => eventIds.includes(t.eventId));

    const totalBudget = events.reduce((sum, e) => sum + e.budget, 0);
    const doneTasks = eventTasks.filter(t => t.status === 'done').length;
    const upcoming = events.filter(e => daysUntil(e.startDate) >= 0 && e.status !== 'completed').length;

    return { totalBudget, tasksDone: doneTasks, totalTasks: eventTasks.length, upcoming };
  }, [events]);

  // Filtered events
  const filtered = useMemo(() => {
    return events.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || EVENT_TYPE_LABELS[e.type].toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [events, search, statusFilter]);

  // Upcoming tasks across all events
  const upcomingTasks = useMemo(() => {
    return taskStorage.getAll()
      .filter(t => t.status !== 'done' && t.status !== 'blocked' && t.dueDate)
      .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
      .slice(0, 5);
  }, []);

  // Recent activity
  const recentActivity = useMemo(() => activityStorage.getRecent(8), []);

  if (loading) return <div className="flex items-center justify-center h-full"><span className="material-symbols-outlined animate-spin text-[32px] text-orange-primary">progress_activity</span></div>;

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Dashboard"
        onMenuClick={onMenuClick ?? (() => {})}
        actions={
          <Button icon="add" onClick={() => navigate('/events/new')} size="sm">
            New Event
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Events" value={String(events.length)} icon="event" />
          <StatCard label="Upcoming Events" value={String(stats.upcoming)} icon="calendar_today" accent />
          <StatCard label="Tasks Complete" value={`${stats.tasksDone}/${stats.totalTasks}`} icon="checklist" />
          <StatCard label="Total Budget" value={formatCurrency(stats.totalBudget, 'INR')} icon="account_balance_wallet" />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Events section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-section-title text-text-main flex-1">My Events</h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-text-secondary">search</span>
                <input
                  type="search"
                  placeholder="Search events..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-8 h-9 text-body-md w-40 sm:w-52"
                  aria-label="Search events"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="select h-9 text-body-md w-36"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                {Object.entries(EVENT_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              events.length === 0 ? (
                <EmptyState
                  icon="celebration"
                  title="Welcome to Gatherly!"
                  description="You haven't created any events yet. Start planning your first event now."
                  action={<Button icon="add" onClick={() => navigate('/events/new')}>Create Your First Event</Button>}
                />
              ) : (
                <EmptyState icon="search_off" title="No events match your search" description="Try adjusting your filters." />
              )
            ) : (
              <div className="grid gap-4">
                {filtered.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </div>

          {/* Sidebar widgets */}
          <div className="flex flex-col gap-4">
            {/* Upcoming tasks */}
            <Card padded={false}>
              <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
                <h3 className="text-body-md-medium text-text-main">Upcoming Tasks</h3>
                <Badge variant="neutral">{upcomingTasks.length}</Badge>
              </div>
              <div className="divide-y divide-border-default">
                {upcomingTasks.length === 0 ? (
                  <p className="px-5 py-6 text-body-md text-text-secondary text-center">No upcoming tasks</p>
                ) : upcomingTasks.map(task => {
                  const overdue = task.dueDate ? daysUntil(task.dueDate) < 0 : false;
                  const event = events.find(e => e.id === task.eventId);
                  return (
                    <div
                      key={task.id}
                      className="px-5 py-3 hover:bg-bg-base cursor-pointer"
                      onClick={() => navigate(`/events/${task.eventId}/tasks`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter') navigate(`/events/${task.eventId}/tasks`); }}
                    >
                      <div className="flex items-start gap-2">
                        <span className={clsx('material-symbols-outlined text-[14px] mt-0.5', overdue ? 'text-error-text' : 'text-warning-text')}>
                          {overdue ? 'warning' : 'schedule'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-body-md text-text-main truncate">{task.title}</p>
                          <p className="text-label-sm text-text-secondary">
                            {event?.name} · {task.dueDate ? formatRelativeDate(task.dueDate) : 'No due date'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent activity */}
            <Card padded={false}>
              <div className="px-5 py-4 border-b border-border-default">
                <h3 className="text-body-md-medium text-text-main">Recent Activity</h3>
              </div>
              <div className="divide-y divide-border-default">
                {recentActivity.length === 0 ? (
                  <p className="px-5 py-6 text-body-md text-text-secondary text-center">No activity yet</p>
                ) : recentActivity.map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-start gap-2">
                    <span className="material-symbols-outlined text-[14px] text-orange-primary mt-0.5 icon-filled">
                      {a.type === 'task_completed' ? 'check_circle' : a.type === 'expense_added' ? 'receipt' : a.type === 'vendor_added' ? 'store' : 'event_note'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-text-main">{a.description}</p>
                      <p className="text-label-sm text-text-secondary">{formatRelativeDate(a.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
