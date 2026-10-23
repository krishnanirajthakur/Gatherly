import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Card, Button, Input, Select, Textarea, Badge, ConfirmDialog, Dialog, EmptyState } from '@/components/ui';
import { guestStorage, activityStorage } from '@/services/storage';
import { RSVP_STATUS_LABELS } from '@/utils/constants';
import type { Event, Guest, RSVPStatus } from '@/types';

interface GuestsTabProps {
  event: Event;
}

const RSVP_VARIANT: Record<RSVPStatus, 'success' | 'warning' | 'neutral' | 'error' | 'accent'> = {
  confirmed: 'success',
  invited: 'accent',
  tentative: 'warning',
  declined: 'error',
  no_response: 'neutral',
};

export default function GuestsTab({ event }: GuestsTabProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rsvpFilter, setRsvpFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => setGuests(guestStorage.getByEvent(event.id));

  useEffect(() => { load(); }, [event.id]);

  const groups = [...new Set(guests.map(g => g.group).filter(Boolean))] as string[];

  const filtered = guests.filter(g => {
    const matchRsvp = rsvpFilter === 'all' || g.rsvpStatus === rsvpFilter;
    const matchGroup = groupFilter === 'all' || g.group === groupFilter;
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase());
    return matchRsvp && matchGroup && matchSearch;
  });

  // Summary counts
  const confirmed = guests.filter(g => g.rsvpStatus === 'confirmed').reduce((s, g) => s + g.partySize, 0);
  const invited = guests.filter(g => g.rsvpStatus === 'invited').length;
  const declined = guests.filter(g => g.rsvpStatus === 'declined').length;

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Guests', value: guests.length, icon: 'group' },
          { label: 'Confirmed', value: confirmed, icon: 'check_circle', color: 'text-[#287A4B]' },
          { label: 'Invited', value: invited, icon: 'mail', color: 'text-[#E87524]' },
          { label: 'Declined', value: declined, icon: 'cancel', color: 'text-[#DC2626]' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white border border-[#E7E5E2] rounded-xl p-4 flex items-center gap-3">
            <span className={clsx('material-symbols-outlined text-[22px]', color ?? 'text-[#747474]')} style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
            <div>
              <p className="text-[20px] font-bold tabular-nums text-[#252525]">{value}</p>
              <p className="text-[12px] text-[#747474]">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & search */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="search"
          placeholder="Search guests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524] w-48"
          aria-label="Search guests"
        />
        <select
          className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
          value={rsvpFilter}
          onChange={e => setRsvpFilter(e.target.value)}
          aria-label="Filter by RSVP"
        >
          <option value="all">All RSVP</option>
          {Object.entries(RSVP_STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        {groups.length > 0 && (
          <select
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            aria-label="Filter by group"
          >
            <option value="all">All Groups</option>
            {groups.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        <Button size="sm" icon="person_add" className="ml-auto" onClick={() => { setEditing(null); setShowForm(true); }}>
          Add Guest
        </Button>
      </div>

      {/* Guest list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="group"
          title="No guests yet"
          description={
            guests.length === 0
              ? 'Add guests and track RSVPs, dietary needs, and group assignments.'
              : 'No guests match your filters.'
          }
          action={
            guests.length === 0 ? (
              <Button icon="person_add" onClick={() => setShowForm(true)}>Add First Guest</Button>
            ) : undefined
          }
        />
      ) : (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-[#E7E5E2] bg-[#F7F7F5]">
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Name</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide hidden sm:table-cell">Group</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide">RSVP</th>
                  <th className="px-4 py-2.5 text-center text-[12px] font-semibold text-[#747474] uppercase tracking-wide">Party</th>
                  <th className="px-4 py-2.5 text-left text-[12px] font-semibold text-[#747474] uppercase tracking-wide hidden md:table-cell">Dietary</th>
                  <th className="px-4 py-2.5 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E2]">
                {filtered.map(guest => (
                  <tr key={guest.id} className="hover:bg-[#F7F7F5]">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#252525]">{guest.name}</div>
                      {guest.email && (
                        <div className="text-[12px] text-[#747474]">{guest.email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#747474] hidden sm:table-cell">
                      {guest.group ?? '—'}
                      {guest.tableAssignment && (
                        <span className="ml-1 text-[11px] text-[#E87524]">({guest.tableAssignment})</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={RSVP_VARIANT[guest.rsvpStatus]}>
                        {RSVP_STATUS_LABELS[guest.rsvpStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums text-[#252525]">{guest.partySize}</td>
                    <td className="px-4 py-3 text-[12px] text-[#747474] hidden md:table-cell">
                      {guest.dietaryNotes ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => { setEditing(guest); setShowForm(true); }}
                          className="p-1 rounded hover:bg-[#F7F7F5] text-[#747474] hover:text-[#252525] transition-colors"
                          aria-label={`Edit ${guest.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteId(guest.id)}
                          className="p-1 rounded hover:bg-[#FEF2F2] text-[#747474] hover:text-[#DC2626] transition-colors"
                          aria-label={`Remove ${guest.name}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <GuestFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        event={event}
        editing={editing}
        onSaved={() => { load(); if (!editing) activityStorage.log(event.id, 'guest_added', 'New guest added'); }}
        existingGroups={groups}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) { guestStorage.delete(deleteId); load(); }
          setDeleteId(null);
        }}
        title="Remove Guest"
        message="Are you sure you want to remove this guest?"
        confirmLabel="Remove"
        dangerous
      />
    </div>
  );
}

// ─── Guest Form Dialog ────────────────────────────────────────────────────────

function GuestFormDialog({
  open, onClose, event, editing, onSaved, existingGroups,
}: {
  open: boolean; onClose: () => void; event: Event; editing: Guest | null; onSaved: () => void; existingGroups: string[];
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('invited');
  const [partySize, setPartySize] = useState('1');
  const [group, setGroup] = useState('');
  const [tableAssignment, setTableAssignment] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setEmail(editing.email ?? '');
      setPhone(editing.phone ?? '');
      setRsvpStatus(editing.rsvpStatus);
      setPartySize(String(editing.partySize));
      setGroup(editing.group ?? '');
      setTableAssignment(editing.tableAssignment ?? '');
      setDietaryNotes(editing.dietaryNotes ?? '');
      setAccessibilityNotes(editing.accessibilityNotes ?? '');
      setNotes(editing.notes ?? '');
    } else {
      setName(''); setEmail(''); setPhone(''); setRsvpStatus('invited');
      setPartySize('1'); setGroup(''); setTableAssignment('');
      setDietaryNotes(''); setAccessibilityNotes(''); setNotes('');
    }
    setError('');
  }, [editing, open]);

  const handleSave = () => {
    if (!name.trim()) { setError('Guest name is required.'); return; }
    const sz = parseInt(partySize, 10);
    if (isNaN(sz) || sz < 1) { setError('Party size must be at least 1.'); return; }
    const data = {
      name: name.trim(),
      email: email || undefined,
      phone: phone || undefined,
      rsvpStatus,
      partySize: sz,
      group: group || undefined,
      tableAssignment: tableAssignment || undefined,
      dietaryNotes: dietaryNotes || undefined,
      accessibilityNotes: accessibilityNotes || undefined,
      notes: notes || undefined,
    };
    if (editing) guestStorage.update(editing.id, data);
    else guestStorage.create({ ...data, eventId: event.id });
    onSaved();
    onClose();
  };

  const rsvpOptions = Object.entries(RSVP_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Guest' : 'Add Guest'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Guest</Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {error && <p className="sm:col-span-2 text-[13px] text-[#DC2626]">{error}</p>}
        <div className="sm:col-span-2">
          <Input label="Full Name" required value={name} onChange={e => setName(e.target.value)} placeholder="Guest name" />
        </div>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="guest@example.com" />
        <Input label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." />
        <Select label="RSVP Status" value={rsvpStatus} onChange={e => setRsvpStatus(e.target.value as RSVPStatus)} options={rsvpOptions} />
        <Input label="Party Size" type="number" min="1" value={partySize} onChange={e => setPartySize(e.target.value)} />
        <Input label="Group / Relation" value={group} onChange={e => setGroup(e.target.value)} placeholder="e.g. Family, Friends, Colleagues" list="groups-list" />
        {existingGroups.length > 0 && (
          <datalist id="groups-list">
            {existingGroups.map(g => <option key={g} value={g} />)}
          </datalist>
        )}
        <Input label="Table / Seating" value={tableAssignment} onChange={e => setTableAssignment(e.target.value)} placeholder="e.g. Table 5" />
        <div className="sm:col-span-2">
          <Textarea label="Dietary Requirements" value={dietaryNotes} onChange={e => setDietaryNotes(e.target.value)} placeholder="Vegetarian, nut allergy, etc." rows={2} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Accessibility Needs" value={accessibilityNotes} onChange={e => setAccessibilityNotes(e.target.value)} placeholder="Wheelchair access, etc." rows={2} />
        </div>
        <div className="sm:col-span-2">
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any other notes..." rows={2} />
        </div>
      </div>
    </Dialog>
  );
}
