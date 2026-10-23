import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Button, Input, Select, Textarea, Checkbox } from '@/components/ui';
import { TopBar } from '@/components/layout/AppShell';
import { useToast } from '@/context/ToastContext';
import { useEvents } from '@/context/EventContext';
import { eventStorage, activityStorage } from '@/services/storage';
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_ICONS,
  CURRENCY_NAMES,
  PLANNING_PRIORITIES,
  DEFAULT_CURRENCY,
} from '@/utils/constants';
import { formatCurrency } from '@/utils/helpers';
import type { EventType, EventFormat, Currency } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// Form data shape
// ─────────────────────────────────────────────────────────────────────────────

interface WizardData {
  name: string;
  type: EventType | '';
  startDate: string;
  endDate: string;
  format: EventFormat;
  location: string;
  guestCount: string;
  budget: string;
  currency: Currency;
  style: string;
  theme: string;
  culturalPreferences: string;
  dietaryRequirements: string;
  accessibilityNeeds: string;
  planningPriorities: string[];
  notes: string;
}

const INITIAL: WizardData = {
  name: '',
  type: '',
  startDate: '',
  endDate: '',
  format: 'in_person',
  location: '',
  guestCount: '',
  budget: '',
  currency: DEFAULT_CURRENCY,
  style: '',
  theme: '',
  culturalPreferences: '',
  dietaryRequirements: '',
  accessibilityNeeds: '',
  planningPriorities: [],
  notes: '',
};

type StepErrors = Partial<Record<keyof WizardData, string>>;

// ─────────────────────────────────────────────────────────────────────────────
// Step components
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ data, errors, onChange }: { data: WizardData; errors: StepErrors; onChange: (k: keyof WizardData, v: unknown) => void }) {
  const EVENT_TYPES = Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <div className="space-y-5">
      <Input
        label="Event Name"
        required
        value={data.name}
        onChange={e => onChange('name', e.target.value)}
        placeholder="e.g. Priya's 30th Birthday"
        error={errors.name}
        maxLength={120}
      />
      <div>
        <label className="input-label">Event Type <span className="text-error-text">*</span></label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {EVENT_TYPES.map(et => (
            <button
              key={et.value}
              type="button"
              onClick={() => onChange('type', et.value)}
              className={clsx(
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-body-md text-left transition-fast',
                data.type === et.value
                  ? 'border-orange-primary bg-orange-pale text-orange-primary'
                  : 'border-border-default bg-bg-card text-text-main hover:border-orange-primary/50 hover:bg-bg-base',
              )}
            >
              <span className={clsx('material-symbols-outlined text-[18px]', data.type === et.value ? 'icon-filled' : '')}>
                {EVENT_TYPE_ICONS[et.value] ?? 'event'}
              </span>
              <span className="text-[13px]">{et.label}</span>
            </button>
          ))}
        </div>
        {errors.type && <p className="input-error-msg mt-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.type}</p>}
      </div>
    </div>
  );
}

function Step2({ data, errors, onChange }: { data: WizardData; errors: StepErrors; onChange: (k: keyof WizardData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Event Date"
          required
          type="date"
          value={data.startDate}
          onChange={e => onChange('startDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          error={errors.startDate}
        />
        <Input
          label="End Date (optional)"
          type="date"
          value={data.endDate}
          onChange={e => onChange('endDate', e.target.value)}
          min={data.startDate || new Date().toISOString().split('T')[0]}
          hint="For multi-day events"
        />
      </div>
      <Select
        label="Event Format"
        required
        value={data.format}
        onChange={e => onChange('format', e.target.value)}
        options={[
          { value: 'in_person', label: 'In Person' },
          { value: 'online', label: 'Online / Virtual' },
          { value: 'hybrid', label: 'Hybrid' },
        ]}
      />
      {data.format !== 'online' && (
        <Input
          label="Location / Venue"
          value={data.location}
          onChange={e => onChange('location', e.target.value)}
          placeholder="e.g. The Grand Palace, Mumbai"
          hint="City, venue name, or area"
        />
      )}
      <Input
        label="Number of Guests"
        required
        type="number"
        value={data.guestCount}
        onChange={e => onChange('guestCount', e.target.value)}
        placeholder="e.g. 150"
        min="1"
        max="10000"
        error={errors.guestCount}
        hint="Approximate total attendance"
      />
    </div>
  );
}

function Step3({ data, errors, onChange }: { data: WizardData; errors: StepErrors; onChange: (k: keyof WizardData, v: unknown) => void }) {
  const currencyOptions = Object.entries(CURRENCY_NAMES).map(([v, l]) => ({ value: v, label: l }));

  return (
    <div className="space-y-5">
      <Select
        label="Currency"
        required
        value={data.currency}
        onChange={e => onChange('currency', e.target.value)}
        options={currencyOptions}
      />
      <Input
        label="Total Budget"
        required
        type="number"
        value={data.budget}
        onChange={e => onChange('budget', e.target.value)}
        placeholder="e.g. 500000"
        min="0"
        error={errors.budget}
        hint={data.budget ? `≈ ${formatCurrency(parseFloat(data.budget) || 0, data.currency as Currency)}` : 'Your maximum planned spend'}
      />
    </div>
  );
}

function Step4({ data, onChange }: { data: WizardData; onChange: (k: keyof WizardData, v: unknown) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Style"
          value={data.style}
          onChange={e => onChange('style', e.target.value)}
          placeholder="e.g. Traditional, Modern, Rustic"
          hint="Optional — helps AI personalise suggestions"
        />
        <Input
          label="Theme"
          value={data.theme}
          onChange={e => onChange('theme', e.target.value)}
          placeholder="e.g. Marigold & Gold, Boho Garden"
        />
      </div>
      <Input
        label="Cultural or Religious Preferences"
        value={data.culturalPreferences}
        onChange={e => onChange('culturalPreferences', e.target.value)}
        placeholder="e.g. Hindu Marathi ceremony, Sikh wedding"
      />
      <Input
        label="Dietary Requirements"
        value={data.dietaryRequirements}
        onChange={e => onChange('dietaryRequirements', e.target.value)}
        placeholder="e.g. Vegetarian, 20% Jain, nut-free options"
      />
      <Input
        label="Accessibility Needs"
        value={data.accessibilityNeeds}
        onChange={e => onChange('accessibilityNeeds', e.target.value)}
        placeholder="e.g. Wheelchair access, step-free venue required"
      />
      <div>
        <label className="input-label mb-2 block">Planning Priorities (optional)</label>
        <div className="grid sm:grid-cols-2 gap-2">
          {PLANNING_PRIORITIES.map(p => (
            <Checkbox
              key={p}
              label={p}
              checked={data.planningPriorities.includes(p)}
              onChange={e => {
                onChange('planningPriorities',
                  e.target.checked
                    ? [...data.planningPriorities, p]
                    : data.planningPriorities.filter(x => x !== p)
                );
              }}
            />
          ))}
        </div>
      </div>
      <Textarea
        label="Additional Notes"
        value={data.notes}
        onChange={e => onChange('notes', e.target.value)}
        placeholder="Any special requirements, ideas, or context for planning..."
        rows={3}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Review step
// ─────────────────────────────────────────────────────────────────────────────

function ReviewStep({ data }: { data: WizardData }) {
  const rows = [
    ['Event Name', data.name],
    ['Type', EVENT_TYPE_LABELS[data.type as EventType] ?? '-'],
    ['Date', data.startDate + (data.endDate ? ` → ${data.endDate}` : '')],
    ['Format', { in_person: 'In Person', online: 'Online', hybrid: 'Hybrid' }[data.format]],
    data.location ? ['Location', data.location] : null,
    ['Guests', `${data.guestCount} guests`],
    ['Budget', formatCurrency(parseFloat(data.budget), data.currency)],
    data.style ? ['Style', data.style] : null,
    data.theme ? ['Theme', data.theme] : null,
    data.culturalPreferences ? ['Cultural Preferences', data.culturalPreferences] : null,
    data.dietaryRequirements ? ['Dietary Requirements', data.dietaryRequirements] : null,
    data.accessibilityNeeds ? ['Accessibility Needs', data.accessibilityNeeds] : null,
  ].filter(Boolean) as [string, string][];

  return (
    <div className="space-y-4">
      <div className="bg-orange-pale border border-[#FBD9BE] rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-orange-primary text-[20px] icon-filled">info</span>
        <p className="text-body-md text-text-secondary">Review your event details before creating. You can edit anything later from the event settings.</p>
      </div>
      <div className="bg-bg-card border border-border-default rounded-xl divide-y divide-border-default overflow-hidden">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-start px-4 py-3 gap-4">
            <span className="text-label-md text-text-secondary w-36 shrink-0">{label}</span>
            <span className="text-body-md text-text-main font-medium flex-1">{value}</span>
          </div>
        ))}
        {data.planningPriorities.length > 0 && (
          <div className="flex items-start px-4 py-3 gap-4">
            <span className="text-label-md text-text-secondary w-36 shrink-0">Priorities</span>
            <div className="flex flex-wrap gap-1.5">
              {data.planningPriorities.map(p => (
                <span key={p} className="badge badge-accent text-[11px]">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Wizard shell
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Event Info', icon: 'event' },
  { id: 2, label: 'Date & Location', icon: 'calendar_today' },
  { id: 3, label: 'Budget', icon: 'account_balance_wallet' },
  { id: 4, label: 'Style & Preferences', icon: 'palette' },
  { id: 5, label: 'Review', icon: 'checklist' },
];

interface CreateEventWizardProps {
  onMenuClick?: () => void;
}

export default function CreateEventWizard({ onMenuClick }: CreateEventWizardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refresh } = useEvents();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL);
  const [errors, setErrors] = useState<StepErrors>({});
  const [saving, setSaving] = useState(false);

  const onChange = (k: keyof WizardData, v: unknown) => {
    setData(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: undefined }));
  };

  const validateStep = (): boolean => {
    const errs: StepErrors = {};
    if (step === 1) {
      if (!data.name.trim()) errs.name = 'Event name is required';
      if (!data.type) errs.type = 'Please select an event type';
    }
    if (step === 2) {
      if (!data.startDate) errs.startDate = 'Event date is required';
      else if (new Date(data.startDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
        errs.startDate = 'Date must be today or in the future';
      }
      if (data.endDate && data.endDate < data.startDate) {
        // not a field error, just silent fix
      }
      if (!data.guestCount || isNaN(Number(data.guestCount)) || Number(data.guestCount) < 1) {
        errs.guestCount = 'Please enter a valid guest count (min 1)';
      }
    }
    if (step === 3) {
      if (!data.budget || isNaN(Number(data.budget)) || Number(data.budget) <= 0) {
        errs.budget = 'Please enter a valid budget';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(5, s + 1)); };
  const back = () => setStep(s => Math.max(1, s - 1));

  const handleCreate = async () => {
    setSaving(true);
    try {
      const event = eventStorage.create({
        name: data.name.trim(),
        type: data.type as EventType,
        status: 'planning',
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        format: data.format,
        location: data.location.trim() || undefined,
        guestCount: parseInt(data.guestCount),
        budget: parseFloat(data.budget),
        currency: data.currency,
        preferences: {
          style: data.style || undefined,
          theme: data.theme || undefined,
          culturalPreferences: data.culturalPreferences || undefined,
          dietaryRequirements: data.dietaryRequirements || undefined,
          accessibilityNeeds: data.accessibilityNeeds || undefined,
          planningPriorities: data.planningPriorities.length ? data.planningPriorities : undefined,
          notes: data.notes || undefined,
        },
      });
      activityStorage.log(event.id, 'event_created', `Event "${event.name}" created`);
      refresh();
      toast('Event created successfully!', 'success');
      navigate(`/events/${event.id}`);
    } catch (err) {
      toast('Failed to create event. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const stepContent = [
    <Step1 key={1} data={data} errors={errors} onChange={onChange} />,
    <Step2 key={2} data={data} errors={errors} onChange={onChange} />,
    <Step3 key={3} data={data} errors={errors} onChange={onChange} />,
    <Step4 key={4} data={data} onChange={onChange} />,
    <ReviewStep key={5} data={data} />,
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Create New Event"
        onMenuClick={onMenuClick ?? (() => {})}
        back={{ to: '/dashboard', label: 'Dashboard' }}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Step indicator */}
          <div className="flex items-center mb-8">
            {STEPS.map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={clsx(
                    'w-9 h-9 rounded-lg flex items-center justify-center transition-fast',
                    step > s.id ? 'bg-success-bg text-success-text' : step === s.id ? 'bg-orange-primary text-white' : 'bg-bg-base border border-border-default text-text-secondary'
                  )}>
                    {step > s.id
                      ? <span className="material-symbols-outlined text-[18px] icon-filled">check</span>
                      : <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                    }
                  </div>
                  <span className={clsx('text-[10px] font-medium hidden sm:block', step === s.id ? 'text-orange-primary' : 'text-text-secondary')}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={clsx('flex-1 h-0.5 mx-2', step > s.id ? 'bg-success-text' : 'bg-border-default')} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-bg-card border border-border-default rounded-2xl p-6">
            <h2 className="text-headline-sm text-text-main mb-1">{STEPS[step - 1].label}</h2>
            <p className="text-body-md text-text-secondary mb-6">
              {['Basic details about your event', 'When and where is the event?', 'What is your total budget?', 'Help AI personalise your plan (all optional)', 'Review and create your event'][step - 1]}
            </p>
            {stepContent[step - 1]}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="secondary" onClick={back} disabled={step === 1} icon="arrow_back">
              Back
            </Button>
            <span className="text-label-sm text-text-secondary">Step {step} of {STEPS.length}</span>
            {step < 5 ? (
              <Button onClick={next} iconRight="arrow_forward">Next</Button>
            ) : (
              <Button onClick={handleCreate} loading={saving} icon="check_circle">
                Create Event
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
