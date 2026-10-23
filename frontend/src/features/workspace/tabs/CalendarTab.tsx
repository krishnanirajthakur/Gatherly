import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '@/components/ui';
import { taskStorage } from '@/services/storage';
import { formatDate, daysUntil } from '@/utils/helpers';
import { TASK_PRIORITY_LABELS } from '@/utils/constants';
import type { Event, Task } from '@/types';

interface CalendarTabProps {
  event: Event;
}

type CalDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isEventDay: boolean;
  tasks: Task[];
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-[#287A4B]',
  medium: 'bg-[#D97706]',
  high: 'bg-[#E87524]',
  urgent: 'bg-[#DC2626]',
};

export default function CalendarTab({ event }: CalendarTabProps) {
  const navigate = useNavigate();
  const today = new Date();
  const eventDate = new Date(event.startDate);
  const [viewDate, setViewDate] = useState(() => new Date(eventDate.getFullYear(), eventDate.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const tasks = taskStorage.getByEvent(event.id);

  // Build calendar grid
  const calDays: CalDay[] = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: CalDay[] = [];

    // Pad start
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, -firstDay.getDay() + i + 1);
      days.push({ date: d, isCurrentMonth: false, isToday: false, isEventDay: false, tasks: [] });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = dateStr === today.toISOString().split('T')[0];
      const isEventDay = dateStr === event.startDate.split('T')[0];
      const dayTasks = tasks.filter(t => t.dueDate?.split('T')[0] === dateStr);
      days.push({ date, isCurrentMonth: true, isToday, isEventDay, tasks: dayTasks });
    }

    // Pad end to complete 6 rows
    const total = Math.ceil(days.length / 7) * 7;
    let nextDay = 1;
    while (days.length < total) {
      const d = new Date(year, month + 1, nextDay++);
      days.push({ date: d, isCurrentMonth: false, isToday: false, isEventDay: false, tasks: [] });
    }

    return days;
  }, [viewDate, tasks, event.startDate]);

  const selectedTasks = useMemo(() => {
    if (!selectedDay) return [];
    const dateStr = selectedDay.toISOString().split('T')[0];
    return tasks.filter(t => t.dueDate?.split('T')[0] === dateStr);
  }, [selectedDay, tasks]);

  const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  const goToEventMonth = () => setViewDate(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1));

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <Card padded={false}>
        {/* Calendar header */}
        <div className="px-5 py-4 border-b border-[#E7E5E2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
              aria-label="Previous month"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <h3 className="text-[16px] font-semibold text-[#252525] min-w-[180px] text-center">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
              aria-label="Next month"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={goToEventMonth}>
              Event Date
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}>
              Today
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-2 border-b border-[#E7E5E2] flex flex-wrap gap-4 text-[12px] text-[#747474]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#E87524]" />
            Event day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#FFF1E5] border border-[#E87524]" />
            Today
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            Has tasks
          </span>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-[#E7E5E2]">
          {WEEKDAYS.map(d => (
            <div key={d} className="py-2 text-center text-[12px] font-semibold text-[#747474] uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calDays.map((day, idx) => {
            const isSelected = selectedDay?.toDateString() === day.date.toDateString();
            const hasOverdue = day.tasks.some(t => t.status !== 'done' && daysUntil(t.dueDate ?? '') < 0);
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(isSelected ? null : day.date)}
                className={clsx(
                  'relative min-h-[64px] p-1.5 text-left border-b border-r border-[#E7E5E2] transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E87524]/50',
                  !day.isCurrentMonth && 'bg-[#FAFAF9]',
                  day.isToday && !day.isEventDay && 'bg-[#FFF1E5]',
                  day.isEventDay && 'bg-[#E87524]/10',
                  isSelected && 'ring-2 ring-inset ring-[#E87524]',
                  day.isCurrentMonth ? 'hover:bg-[#F7F7F5]' : 'cursor-default',
                )}
                disabled={!day.isCurrentMonth}
                aria-label={`${day.date.toDateString()}${day.tasks.length > 0 ? `, ${day.tasks.length} tasks` : ''}`}
              >
                <span
                  className={clsx(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-medium',
                    day.isEventDay
                      ? 'bg-[#E87524] text-white'
                      : day.isToday
                      ? 'bg-[#C95D16] text-white'
                      : day.isCurrentMonth
                      ? 'text-[#252525]'
                      : 'text-[#C4C2BE]'
                  )}
                >
                  {day.date.getDate()}
                </span>
                {day.tasks.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {day.tasks.slice(0, 3).map(t => (
                      <span
                        key={t.id}
                        className={clsx(
                          'w-1.5 h-1.5 rounded-full',
                          t.status === 'done'
                            ? 'bg-[#287A4B]'
                            : hasOverdue
                            ? 'bg-[#DC2626]'
                            : PRIORITY_COLORS[t.priority]
                        )}
                      />
                    ))}
                    {day.tasks.length > 3 && (
                      <span className="text-[10px] text-[#747474]">+{day.tasks.length - 3}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected day detail */}
      {selectedDay && (
        <Card padded={false}>
          <div className="px-5 py-4 border-b border-[#E7E5E2] flex items-center justify-between">
            <h4 className="text-[14px] font-semibold text-[#252525]">
              {selectedDay.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h4>
            {selectedTasks.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => navigate(`/events/${event.id}/tasks`)}>
                Manage Tasks
              </Button>
            )}
          </div>
          {selectedDay.toISOString().split('T')[0] === event.startDate.split('T')[0] && (
            <div className="px-5 py-3 bg-[#FFF1E5] border-b border-[#E7E5E2] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#E87524]" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
              <span className="text-[14px] font-medium text-[#252525]">🎉 {event.name}</span>
            </div>
          )}
          {selectedTasks.length === 0 ? (
            <div className="px-5 py-6 text-center text-[14px] text-[#747474]">No tasks due on this day.</div>
          ) : (
            <div className="divide-y divide-[#E7E5E2]">
              {selectedTasks.map(task => {
                const isOverdue = task.status !== 'done' && daysUntil(task.dueDate ?? '') < 0;
                return (
                  <div key={task.id} className="px-5 py-3 flex items-center gap-3">
                    <span
                      className={clsx('w-2 h-2 rounded-full shrink-0', PRIORITY_COLORS[task.priority])}
                      aria-label={TASK_PRIORITY_LABELS[task.priority]}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-[14px] text-[#252525]', task.status === 'done' && 'line-through opacity-60')}>
                        {task.title}
                      </p>
                      {task.category && (
                        <p className="text-[12px] text-[#747474]">{task.category}</p>
                      )}
                    </div>
                    <Badge variant={task.status === 'done' ? 'success' : isOverdue ? 'error' : 'neutral'}>
                      {task.status === 'done' ? 'Done' : isOverdue ? 'Overdue' : task.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Upcoming task list */}
      <div>
        <h4 className="text-[14px] font-semibold text-[#252525] mb-3">All Task Deadlines</h4>
        {tasks.filter(t => t.dueDate).length === 0 ? (
          <p className="text-[14px] text-[#747474]">No tasks with due dates yet.</p>
        ) : (
          <div className="space-y-2">
            {tasks
              .filter(t => t.dueDate)
              .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
              .map(task => {
                const days = daysUntil(task.dueDate!);
                const isOverdue = days < 0 && task.status !== 'done';
                return (
                  <div
                    key={task.id}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2.5 rounded-lg border',
                      task.status === 'done'
                        ? 'border-[#E7E5E2] bg-[#F7F7F5] opacity-60'
                        : isOverdue
                        ? 'border-[#DC2626]/30 bg-[#FEF2F2]'
                        : 'border-[#E7E5E2] bg-white'
                    )}
                  >
                    <span className={clsx('w-2 h-2 rounded-full shrink-0', PRIORITY_COLORS[task.priority])} />
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-[14px] text-[#252525]', task.status === 'done' && 'line-through')}>
                        {task.title}
                      </p>
                    </div>
                    <span className={clsx('text-[12px] tabular-nums shrink-0', isOverdue ? 'text-[#DC2626]' : 'text-[#747474]')}>
                      {formatDate(task.dueDate!)}
                    </span>
                    <Badge variant={task.status === 'done' ? 'success' : isOverdue ? 'error' : 'neutral'}>
                      {task.status === 'done' ? 'Done' : isOverdue ? 'Overdue' : `${days}d`}
                    </Badge>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
