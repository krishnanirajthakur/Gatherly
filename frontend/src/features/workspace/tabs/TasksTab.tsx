import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Card, Button, Input, Select, Textarea, Badge, ConfirmDialog, Dialog, EmptyState } from '@/components/ui';
import { taskStorage, activityStorage } from '@/services/storage';
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@/utils/constants';
import { formatRelativeDate, daysUntil } from '@/utils/helpers';
import type { Event, Task, TaskPriority, TaskStatus } from '@/types';

interface TasksTabProps {
  event: Event;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: 'bg-[#287A4B]',
  medium: 'bg-[#D97706]',
  high: 'bg-[#E87524]',
  urgent: 'bg-[#DC2626]',
};

export default function TasksTab({ event }: TasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const load = () => setTasks(taskStorage.getByEvent(event.id));

  useEffect(() => {
    load();
  }, [event.id]);

  const filtered = tasks.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const doneCount = tasks.filter(t => t.status === 'done').length;
  const overdueCount = tasks.filter(
    t => t.status !== 'done' && t.dueDate && daysUntil(t.dueDate) < 0
  ).length;

  const toggleStatus = (task: Task) => {
    const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    taskStorage.update(task.id, { status: newStatus });
    if (newStatus === 'done') {
      activityStorage.log(event.id, 'task_completed', `Task "${task.title}" completed`);
    }
    load();
  };

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary & filters */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[14px] text-[#747474]">
          {doneCount}/{tasks.length} tasks complete
        </span>
        {overdueCount > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF2F2] text-[#DC2626]">
            {overdueCount} overdue
          </span>
        )}
        <div className="flex gap-2 ml-auto flex-wrap">
          <select
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            {Object.entries(TASK_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All Priority</option>
            {Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <Button size="sm" icon="add" onClick={() => { setEditing(null); setShowForm(true); }}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="checklist"
          title="No tasks"
          description={
            tasks.length === 0
              ? 'Add tasks manually or generate them with the AI Planner.'
              : 'No tasks match your filters.'
          }
          action={
            tasks.length === 0 ? (
              <Button icon="add" onClick={() => setShowForm(true)}>
                Add First Task
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Card padded={false}>
          <div className="divide-y divide-[#E7E5E2]">
            {filtered.map(task => {
              const isOverdue =
                task.dueDate ? daysUntil(task.dueDate) < 0 && task.status !== 'done' : false;
              return (
                <div
                  key={task.id}
                  className={clsx(
                    'flex items-start gap-3 px-5 py-3 hover:bg-[#F7F7F5] transition-colors',
                    task.status === 'done' && 'opacity-60'
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleStatus(task)}
                    aria-label={task.status === 'done' ? 'Mark as incomplete' : 'Mark as complete'}
                    className={clsx(
                      'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E87524]/50'
                    )}
                    style={{
                      borderColor: task.status === 'done' ? '#E87524' : '#E7E5E2',
                      background: task.status === 'done' ? '#E87524' : 'white',
                    }}
                  >
                    {task.status === 'done' && (
                      <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    )}
                  </button>

                  {/* Priority dot */}
                  <span
                    className={clsx('w-2 h-2 rounded-full mt-2 shrink-0', PRIORITY_COLORS[task.priority])}
                    aria-label={`Priority: ${TASK_PRIORITY_LABELS[task.priority]}`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-[14px] text-[#252525]', task.status === 'done' && 'line-through')}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[12px] text-[#747474] mt-0.5 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {task.category && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-[#F7F7F5] text-[#747474] border border-[#E7E5E2]">
                          {task.category}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={clsx('text-[12px]', isOverdue ? 'text-[#DC2626]' : 'text-[#747474]')}>
                          {isOverdue ? '⚠ Overdue · ' : ''}
                          {formatRelativeDate(task.dueDate)}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-[12px] text-[#747474]">👤 {task.assignee}</span>
                      )}
                      {task.source === 'ai_suggestion' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] bg-[#FFF1E5] text-[#C95D16] border border-[#FBD9BE]">
                          <span className="material-symbols-outlined text-[11px]">smart_toy</span>
                          AI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant={task.status === 'done' ? 'success' : task.status === 'blocked' ? 'error' : 'neutral'}
                      className="hidden sm:flex"
                    >
                      {TASK_STATUS_LABELS[task.status]}
                    </Badge>
                    <button
                      onClick={() => { setEditing(task); setShowForm(true); }}
                      className="p-1 rounded hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
                      aria-label="Edit task"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(task.id)}
                      className="p-1 rounded hover:bg-[#FEF2F2] text-[#747474] hover:text-[#DC2626] transition-colors"
                      aria-label="Delete task"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <TaskFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        event={event}
        editing={editing}
        onSaved={load}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) { taskStorage.delete(deleteId); load(); }
          setDeleteId(null);
        }}
        title="Delete Task"
        message="Are you sure you want to delete this task? This cannot be undone."
        confirmLabel="Delete"
        dangerous
      />
    </div>
  );
}

// ─── Task Form Dialog ─────────────────────────────────────────────────────────

function TaskFormDialog({
  open, onClose, event, editing, onSaved,
}: {
  open: boolean; onClose: () => void; event: Event; editing: Task | null; onSaved: () => void;
}) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState('');
  const [assignee, setAssignee] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDesc(editing.description ?? '');
      setDueDate(editing.dueDate ?? '');
      setPriority(editing.priority);
      setStatus(editing.status);
      setCategory(editing.category ?? '');
      setAssignee(editing.assignee ?? '');
    } else {
      setTitle(''); setDesc(''); setDueDate(''); setPriority('medium'); setStatus('todo'); setCategory(''); setAssignee('');
    }
    setError('');
  }, [editing, open]);

  const handleSave = () => {
    if (!title.trim()) { setError('Task title is required.'); return; }
    if (dueDate && dueDate < new Date().toISOString().split('T')[0]) {
      // allow past dates, just don't block; they'll appear as overdue
    }
    const data = {
      title: title.trim(),
      description: desc || undefined,
      dueDate: dueDate || undefined,
      priority,
      status,
      category: category || undefined,
      assignee: assignee || undefined,
      source: 'manual' as const,
    };
    if (editing) taskStorage.update(editing.id, data);
    else taskStorage.create({ ...data, eventId: event.id });
    onSaved();
    onClose();
  };

  const priorityOptions = Object.entries(TASK_PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOptions = Object.entries(TASK_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Task' : 'Add Task'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Task</Button>
        </div>
      }
    >
      <div className="space-y-4">
        {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
        <Input
          label="Task Title"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
        <Textarea
          label="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Optional details..."
          rows={2}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <Select label="Priority" value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} options={priorityOptions} />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as TaskStatus)} options={statusOptions} />
          <Input label="Category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Catering, Venue" />
          <div className="sm:col-span-2">
            <Input label="Assigned To" value={assignee} onChange={e => setAssignee(e.target.value)} placeholder="Optional person name" />
          </div>
        </div>
      </div>
    </Dialog>
  );
}
