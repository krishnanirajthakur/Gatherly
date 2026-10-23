import { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Textarea, Badge, ConfirmDialog, Dialog, EmptyState } from '@/components/ui';
import { vendorStorage, activityStorage } from '@/services/storage';
import { formatCurrency } from '@/utils/helpers';
import { VENDOR_CATEGORY_LABELS, VENDOR_STATUS_LABELS } from '@/utils/constants';
import type { Event, Vendor, VendorCategory, VendorStatus, VendorPaymentStatus } from '@/types';

interface VendorsTabProps {
  event: Event;
}

const STATUS_VARIANT: Record<VendorStatus, 'success' | 'warning' | 'neutral' | 'error' | 'accent'> = {
  booked: 'success',
  quoted: 'accent',
  contacted: 'warning',
  researching: 'neutral',
  rejected: 'error',
};

const CATEGORY_ICONS: Record<VendorCategory, string> = {
  venue: 'location_city',
  catering: 'restaurant',
  photography: 'photo_camera',
  videography: 'videocam',
  decoration: 'auto_awesome',
  music: 'music_note',
  transport: 'directions_car',
  entertainment: 'theater_comedy',
  equipment: 'build',
  flowers: 'local_florist',
  cake: 'cake',
  security: 'security',
  cleaning: 'cleaning_services',
  other: 'category',
};

export default function VendorsTab({ event }: VendorsTabProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const load = () => setVendors(vendorStorage.getByEvent(event.id));

  useEffect(() => {
    load();
  }, [event.id]);

  const filtered = vendors.filter(v => {
    const matchCat = categoryFilter === 'all' || v.category === categoryFilter;
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const booked = vendors.filter(v => v.status === 'booked').length;

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-3 text-[14px] text-[#747474]">
          <span>{vendors.length} vendors</span>
          <span className="text-[#287A4B] font-medium">{booked} booked</span>
        </div>
        <div className="flex gap-2 ml-auto flex-wrap">
          <input
            type="search"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524] w-44"
            aria-label="Search vendors"
          />
          <select
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {Object.entries(VENDOR_CATEGORY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            className="h-9 px-3 text-[14px] border border-[#E7E5E2] rounded-lg bg-white text-[#252525] focus:outline-none focus:ring-2 focus:ring-[#E87524]/30 focus:border-[#E87524]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            {Object.entries(VENDOR_STATUS_LABELS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <Button size="sm" icon="add" onClick={() => { setEditing(null); setShowForm(true); }}>
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Vendor list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="store"
          title="No vendors yet"
          description={
            vendors.length === 0
              ? 'Track photographers, caterers, venues, and more.'
              : 'No vendors match your filters.'
          }
          action={
            vendors.length === 0 ? (
              <Button icon="add" onClick={() => setShowForm(true)}>Add First Vendor</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              event={event}
              onEdit={() => { setEditing(vendor); setShowForm(true); }}
              onDelete={() => setDeleteId(vendor.id)}
            />
          ))}
        </div>
      )}

      <VendorFormDialog
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        event={event}
        editing={editing}
        onSaved={() => { load(); activityStorage.log(event.id, 'vendor_added', editing ? `Vendor updated` : `New vendor added`); }}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) { vendorStorage.delete(deleteId); load(); }
          setDeleteId(null);
        }}
        title="Delete Vendor"
        message="Are you sure you want to remove this vendor? This cannot be undone."
        confirmLabel="Delete"
        dangerous
      />
    </div>
  );
}

// ─── Vendor Card ──────────────────────────────────────────────────────────────

function VendorCard({
  vendor, event, onEdit, onDelete,
}: {
  vendor: Vendor; event: Event; onEdit: () => void; onDelete: () => void;
}) {
  const icon = CATEGORY_ICONS[vendor.category] ?? 'category';
  const catLabel = VENDOR_CATEGORY_LABELS[vendor.category] ?? vendor.category;

  return (
    <Card padded>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FFF1E5] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px] text-[#E87524]">{icon}</span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#252525] leading-tight">{vendor.name}</p>
            <p className="text-[12px] text-[#747474]">{catLabel}</p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[vendor.status]}>{VENDOR_STATUS_LABELS[vendor.status]}</Badge>
      </div>

      <div className="space-y-1.5 text-[13px]">
        {vendor.contactName && (
          <div className="flex items-center gap-1.5 text-[#747474]">
            <span className="material-symbols-outlined text-[14px]">person</span>
            {vendor.contactName}
          </div>
        )}
        {vendor.contactEmail && (
          <div className="flex items-center gap-1.5 text-[#747474] truncate">
            <span className="material-symbols-outlined text-[14px]">mail</span>
            <a href={`mailto:${vendor.contactEmail}`} className="hover:text-[#E87524] hover:underline truncate">
              {vendor.contactEmail}
            </a>
          </div>
        )}
        {vendor.contactPhone && (
          <div className="flex items-center gap-1.5 text-[#747474]">
            <span className="material-symbols-outlined text-[14px]">phone</span>
            {vendor.contactPhone}
          </div>
        )}
        {vendor.quotedPrice != null && (
          <div className="flex items-center gap-1.5 text-[#747474]">
            <span className="material-symbols-outlined text-[14px]">payments</span>
            <span>Quote: <strong className="text-[#252525]">{formatCurrency(vendor.quotedPrice, event.currency)}</strong></span>
          </div>
        )}
        {vendor.notes && (
          <p className="text-[12px] text-[#747474] line-clamp-2 mt-1 italic">"{vendor.notes}"</p>
        )}
      </div>

      <div className="flex gap-1 mt-3 pt-3 border-t border-[#E7E5E2]">
        <Button variant="ghost" size="sm" icon="edit" onClick={onEdit} className="flex-1 justify-center">
          Edit
        </Button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-[#FEF2F2] text-[#747474] hover:text-[#DC2626] transition-colors"
          aria-label="Delete vendor"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </Card>
  );
}

// ─── Vendor Form Dialog ───────────────────────────────────────────────────────

function VendorFormDialog({
  open, onClose, event, editing, onSaved,
}: {
  open: boolean; onClose: () => void; event: Event; editing: Vendor | null; onSaved: () => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('venue');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [status, setStatus] = useState<VendorStatus>('researching');
  const [paymentStatus, setPaymentStatus] = useState<VendorPaymentStatus>('none');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setCategory(editing.category);
      setContactName(editing.contactName ?? '');
      setContactEmail(editing.contactEmail ?? '');
      setContactPhone(editing.contactPhone ?? '');
      setWebsite(editing.website ?? '');
      setQuotedPrice(editing.quotedPrice != null ? String(editing.quotedPrice) : '');
      setStatus(editing.status);
      setPaymentStatus(editing.paymentStatus);
      setNotes(editing.notes ?? '');
    } else {
      setName(''); setCategory('venue'); setContactName(''); setContactEmail('');
      setContactPhone(''); setWebsite(''); setQuotedPrice('');
      setStatus('researching'); setPaymentStatus('none'); setNotes('');
    }
    setError('');
  }, [editing, open]);

  const handleSave = () => {
    if (!name.trim()) { setError('Vendor name is required.'); return; }
    const data = {
      name: name.trim(),
      category,
      contactName: contactName || undefined,
      contactEmail: contactEmail || undefined,
      contactPhone: contactPhone || undefined,
      website: website || undefined,
      quotedPrice: quotedPrice ? parseFloat(quotedPrice) : undefined,
      status,
      paymentStatus,
      notes: notes || undefined,
      source: 'manual' as const,
    };
    if (editing) vendorStorage.update(editing.id, data);
    else vendorStorage.create({ ...data, eventId: event.id });
    onSaved();
    onClose();
  };

  const categoryOptions = Object.entries(VENDOR_CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const statusOptions = Object.entries(VENDOR_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const paymentOptions = [
    { value: 'none', label: 'No Payment Yet' },
    { value: 'deposit_paid', label: 'Deposit Paid' },
    { value: 'partially_paid', label: 'Partially Paid' },
    { value: 'fully_paid', label: 'Fully Paid' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Vendor' : 'Add Vendor'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Vendor</Button>
        </div>
      }
    >
      <div className="grid sm:grid-cols-2 gap-4">
        {error && <p className="sm:col-span-2 text-[13px] text-[#DC2626]">{error}</p>}
        <div className="sm:col-span-2">
          <Input label="Vendor / Business Name" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Grand Palace Venue" />
        </div>
        <Select label="Service Category" value={category} onChange={e => setCategory(e.target.value as VendorCategory)} options={categoryOptions} />
        <Select label="Status" value={status} onChange={e => setStatus(e.target.value as VendorStatus)} options={statusOptions} />
        <Input label="Contact Person" value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Name" />
        <Input label="Phone" type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+91 98765 43210" />
        <Input label="Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="vendor@example.com" />
        <Input label="Website" type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." />
        <Input label={`Quoted Price (${event.currency})`} type="number" value={quotedPrice} onChange={e => setQuotedPrice(e.target.value)} min="0" />
        <Select label="Payment Status" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value as VendorPaymentStatus)} options={paymentOptions} />
        <div className="sm:col-span-2">
          <Textarea label="Notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Comparison notes, requirements, follow-up..." rows={3} />
        </div>
      </div>
    </Dialog>
  );
}
