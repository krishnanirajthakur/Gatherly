import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { TopBar } from '@/components/layout/AppShell';
import { Badge, Button, Spinner } from '@/components/ui';
import { eventStorage } from '@/services/storage';
import { EVENT_TYPE_ICONS, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '@/utils/constants';
import { formatDate, daysUntil } from '@/utils/helpers';
import type { Event } from '@/types';

// Lazy-loaded tab components
import OverviewTab from './tabs/OverviewTab';
import BudgetTab from './tabs/BudgetTab';
import TasksTab from './tabs/TasksTab';
import VendorsTab from './tabs/VendorsTab';
import GuestsTab from './tabs/GuestsTab';
import CalendarTab from './tabs/CalendarTab';
import PlannerTab from './tabs/PlannerTab';
import EventSettingsTab from './tabs/EventSettingsTab';

// ─────────────────────────────────────────────────────────────────────────────
// Workspace Tabs config
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'planner', label: 'AI Planner', icon: 'smart_toy' },
  { id: 'budget', label: 'Budget', icon: 'account_balance_wallet' },
  { id: 'tasks', label: 'Tasks', icon: 'checklist' },
  { id: 'vendors', label: 'Vendors', icon: 'store' },
  { id: 'guests', label: 'Guests', icon: 'group' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Workspace shell
// ─────────────────────────────────────────────────────────────────────────────

interface WorkspaceProps {
  onMenuClick?: () => void;
}

export default function EventWorkspace({ onMenuClick }: WorkspaceProps) {
  const { eventId, tab } = useParams<{ eventId: string; tab?: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    if (!eventId) return;
    const e = eventStorage.getById(eventId);
    setEvent(e ?? null);
  };

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [eventId]);

  const days = useMemo(() => event ? daysUntil(event.startDate) : null, [event]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size={32} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-section-title text-text-secondary">Event not found</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <TopBar
        onMenuClick={onMenuClick ?? (() => {})}
        back={{ to: '/dashboard', label: 'My Events' }}
        actions={
          <div className="flex items-center gap-2">
            {days !== null && days >= 0 && days <= 30 && (
              <span className={clsx('badge badge-accent text-[11px]')}>
                {days === 0 ? 'Today!' : `${days}d to go`}
              </span>
            )}
            <Badge variant={
              event.status === 'completed' ? 'success' :
              event.status === 'in_progress' ? 'accent' :
              event.status === 'cancelled' ? 'error' : 'neutral'
            }>
              {EVENT_STATUS_LABELS[event.status]}
            </Badge>
          </div>
        }
      />

      {/* Event header */}
      <div className="bg-bg-card border-b border-border-default px-4 lg:px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-orange-pale rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] text-orange-primary icon-filled">
              {EVENT_TYPE_ICONS[event.type] ?? 'event'}
            </span>
          </div>
          <div>
            <h1 className="text-section-title text-text-main leading-tight">{event.name}</h1>
            <p className="text-label-sm text-text-secondary">
              {EVENT_TYPE_LABELS[event.type]} · {formatDate(event.startDate)}
              {event.location ? ` · ${event.location}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="bg-bg-card border-b border-border-default overflow-x-auto">
        <div className="flex gap-0 px-2 lg:px-4">
          {TABS.map(t => (
            <NavLink
              key={t.id}
              to={`/events/${event.id}/${t.id}`}
              className={({ isActive }) => clsx(
                'flex items-center gap-1.5 px-3 py-3 text-body-md-medium whitespace-nowrap border-b-2 transition-fast -mb-px',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-focus focus-visible:ring-inset rounded-t',
                (isActive || (!tab && t.id === 'overview'))
                  ? 'border-orange-primary text-orange-primary'
                  : 'border-transparent text-text-secondary hover:text-text-main hover:border-border-default',
              )}
            >
              <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewTab event={event} onRefresh={refresh} />} />
          <Route path="planner" element={<PlannerTab event={event} onRefresh={refresh} />} />
          <Route path="budget" element={<BudgetTab event={event} />} />
          <Route path="tasks" element={<TasksTab event={event} />} />
          <Route path="vendors" element={<VendorsTab event={event} />} />
          <Route path="guests" element={<GuestsTab event={event} />} />
          <Route path="calendar" element={<CalendarTab event={event} />} />
          <Route path="settings" element={<EventSettingsTab event={event} onRefresh={refresh} />} />
        </Routes>
      </div>
    </div>
  );
}
