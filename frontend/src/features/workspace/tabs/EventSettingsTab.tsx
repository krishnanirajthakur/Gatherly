import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select, Textarea, ConfirmDialog } from '@/components/ui';
import { eventStorage, taskStorage, expenseStorage, categoryStorage, vendorStorage, guestStorage, activityStorage } from '@/services/storage';
import { CURRENCY_NAMES, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS } from '@/utils/constants';
import { formatDate } from '@/utils/helpers';
import { useToast } from '@/context/ToastContext';
import type { Event, EventStatus, Currency } from '@/types';

interface EventSettingsTabProps {
  event: Event;
  onRefresh: () => void;
}

export default function EventSettingsTab({ event, onRefresh }: EventSettingsTabProps) {
  const navigate = useNavigate();
  const { success: toastSuccess } = useToast();

  // Editable fields
  const [name, setName] = useState(event.name);
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [location, setLocation] = useState(event.location ?? '');
  const [currency, setCurrency] = useState<Currency>(event.currency);
  const [guestCount, setGuestCount] = useState(String(event.guestCount));
  const [budget, setBudget] = useState(String(event.budget));
  const [notes, setNotes] = useState(event.preferences.notes ?? '');
  const [style, setStyle] = useState(event.preferences.style ?? '');
  const [theme, setTheme] = useState(event.preferences.theme ?? '');
  const [dietaryReqs, setDietaryReqs] = useState(event.preferences.dietaryRequirements ?? '');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(event.preferences.accessibilityNeeds ?? '');

  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(event.name);
    setStatus(event.status);
    setLocation(event.location ?? '');
    setCurrency(event.currency);
    setGuestCount(String(event.guestCount));
    setBudget(String(event.budget));
    setNotes(event.preferences.notes ?? '');
    setStyle(event.preferences.style ?? '');
    setTheme(event.preferences.theme ?? '');
    setDietaryReqs(event.preferences.dietaryRequirements ?? '');
    setAccessibilityNeeds(event.preferences.accessibilityNeeds ?? '');
    setError('');
  }, [event]);

  const handleSave = () => {
    if (!name.trim()) { setError('Event name is required.'); return; }
    const gc = parseInt(guestCount, 10);
    const bg = parseFloat(budget);
    if (isNaN(gc) || gc < 1) { setError('Guest count must be at least 1.'); return; }
    if (isNaN(bg) || bg < 0) { setError('Enter a valid budget.'); return; }
    setSaving(true);
    setError('');
    eventStorage.update(event.id, {
      name: name.trim(),
      status,
      location: location || undefined,
      currency,
      guestCount: gc,
      budget: bg,
      preferences: {
        ...event.preferences,
        style: style || undefined,
        theme: theme || undefined,
        dietaryRequirements: dietaryReqs || undefined,
        accessibilityNeeds: accessibilityNeeds || undefined,
        notes: notes || undefined,
      },
    });
    activityStorage.log(event.id, 'event_updated', 'Event settings updated');
    setSaving(false);
    toastSuccess('Event settings saved successfully.');
    onRefresh();
  };

  const handleDelete = () => {
    // Cascade delete
    taskStorage.getByEvent(event.id).forEach(t => taskStorage.delete(t.id));
    expenseStorage.getByEvent(event.id).forEach(e => expenseStorage.delete(e.id));
    categoryStorage.getByEvent(event.id).forEach(c => categoryStorage.delete(c.id));
    vendorStorage.getByEvent(event.id).forEach(v => vendorStorage.delete(v.id));
    guestStorage.getByEvent(event.id).forEach(g => guestStorage.delete(g.id));
    eventStorage.delete(event.id);
    toastSuccess(`Event "${event.name}" deleted.`);
    navigate('/dashboard');
  };

  const statusOptions = Object.entries(EVENT_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const currencyOptions = Object.entries(CURRENCY_NAMES).map(([v, l]) => ({ value: v, label: l }));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
      {/* Event info (read-only) */}
      <Card padded>
        <h3 className="text-[14px] font-semibold text-[#252525] mb-4">Event Information</h3>
        <div className="grid sm:grid-cols-2 gap-3 text-[13px] text-[#747474]">
          <div>
            <span className="font-medium text-[#252525]">Type</span>
            <p>{EVENT_TYPE_LABELS[event.type]}</p>
          </div>
          <div>
            <span className="font-medium text-[#252525]">Date</span>
            <p>{formatDate(event.startDate)}{event.endDate ? ` – ${formatDate(event.endDate)}` : ''}</p>
          </div>
          <div>
            <span className="font-medium text-[#252525]">Format</span>
            <p className="capitalize">{event.format.replace('_', ' ')}</p>
          </div>
          <div>
            <span className="font-medium text-[#252525]">Created</span>
            <p>{formatDate(event.createdAt)}</p>
          </div>
        </div>
        <p className="text-[12px] text-[#747474] mt-3">
          Event type and dates cannot be changed after creation. Create a new event to change them.
        </p>
      </Card>

      {/* Editable settings */}
      <Card padded>
        <h3 className="text-[14px] font-semibold text-[#252525] mb-4">Edit Event Details</h3>
        {error && <p className="text-[13px] text-[#DC2626] mb-3">{error}</p>}
        <div className="space-y-4">
          <Input label="Event Name" required value={name} onChange={e => setName(e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="Status" value={status} onChange={e => setStatus(e.target.value as EventStatus)} options={statusOptions} />
            <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Venue or city" />
            <Input label="Expected Guests" type="number" min="1" value={guestCount} onChange={e => setGuestCount(e.target.value)} />
            <Input label="Total Budget" type="number" min="0" value={budget} onChange={e => setBudget(e.target.value)} />
            <Select label="Currency" value={currency} onChange={e => setCurrency(e.target.value as Currency)} options={currencyOptions} />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card padded>
        <h3 className="text-[14px] font-semibold text-[#252525] mb-4">Preferences</h3>
        <div className="space-y-4">
          <Input label="Style / Vibe" value={style} onChange={e => setStyle(e.target.value)} placeholder="e.g. Elegant, Rustic, Minimalist" />
          <Input label="Theme" value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Garden, Royal, Bohemian" />
          <Textarea label="Dietary Requirements" value={dietaryReqs} onChange={e => setDietaryReqs(e.target.value)} rows={2} placeholder="Any dietary needs for catering" />
          <Textarea label="Accessibility Needs" value={accessibilityNeeds} onChange={e => setAccessibilityNeeds(e.target.value)} rows={2} placeholder="Wheelchair access, hearing loops, etc." />
          <Textarea label="Additional Notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Any other planning notes or requirements" />
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} icon="save">
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* Danger zone */}
      <Card padded>
        <h3 className="text-[14px] font-semibold text-[#DC2626] mb-2">Danger Zone</h3>
        <p className="text-[13px] text-[#747474] mb-4">
          Permanently delete this event and all its tasks, budget, vendors, and guest data. This cannot be undone.
        </p>
        <Button
          variant="secondary"
          icon="delete_forever"
          onClick={() => setConfirmDelete(true)}
          className="border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2]"
        >
          Delete Event
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to permanently delete "${event.name}"? All tasks, budget items, vendors, and guest data will be deleted. This cannot be undone.`}
        confirmLabel="Delete Forever"
        dangerous
      />
    </div>
  );
}
