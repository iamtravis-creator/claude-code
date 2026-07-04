'use client';
import { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CrewSelector from '@/components/crew/CrewSelector';
import { Job, Contact, Property, CleaningService, JobStatus } from '@/lib/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface JobFormProps {
  initialData?: Partial<Job & { crew_ids?: string[] }>;
  onSuccess: (job: Job) => void;
  onCancel: () => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'en_route', label: 'En Route' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'invoiced', label: 'Invoiced' },
];

const POST_JOB_STATUSES: JobStatus[] = ['completed', 'invoiced'];

// ── Star rating sub-component ─────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          onClick={() => onChange(value === star ? 0 : star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <span className={star <= (hovered || value) ? 'text-yellow-400' : 'text-gray-300'}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JobForm({ initialData, onSuccess, onCancel }: JobFormProps) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    contact_id: initialData?.contact_id ? String(initialData.contact_id) : '',
    property_id: initialData?.property_id ? String(initialData.property_id) : '',
    service_id: initialData?.service_id ? String(initialData.service_id) : '',
    status: (initialData?.status ?? 'scheduled') as JobStatus,
    scheduled_date: initialData?.scheduled_date ?? '',
    start_time: initialData?.start_time ?? '',
    end_time: initialData?.end_time ?? '',
    estimated_hours: initialData?.estimated_hours != null ? String(initialData.estimated_hours) : '',
    actual_hours: initialData?.actual_hours != null ? String(initialData.actual_hours) : '',
    price: initialData?.price != null ? String(initialData.price) : '',
    tip: '',
    notes: initialData?.notes ?? '',
    completion_notes: initialData?.completion_notes ?? '',
    rating: 0,
  });
  const [crewIds, setCrewIds] = useState<string[]>(initialData?.crew_ids ?? []);

  // ── Reference data ──────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<CleaningService[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPostJob = POST_JOB_STATUSES.includes(form.status);

  // ── Load contacts and services on mount ─────────────────────────────────────
  useEffect(() => {
    fetch('/api/contacts')
      .then(r => r.json())
      .then(json => setContacts(json.data ?? []))
      .finally(() => setLoadingContacts(false));

    fetch('/api/services?active=1')
      .then(r => r.json())
      .then(json => setServices(json.data ?? []))
      .finally(() => setLoadingServices(false));
  }, []);

  // ── Load properties when contact changes ────────────────────────────────────
  useEffect(() => {
    if (!form.contact_id) {
      setProperties([]);
      return;
    }
    setLoadingProperties(true);
    fetch(`/api/properties?contact_id=${form.contact_id}`)
      .then(r => r.json())
      .then(json => setProperties(json.data ?? []))
      .finally(() => setLoadingProperties(false));
  }, [form.contact_id]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const set = (k: string, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }));

  function handleContactChange(contactId: string) {
    setForm(f => ({ ...f, contact_id: contactId, property_id: '' }));
  }

  function handleServiceChange(serviceId: string) {
    const svc = services.find(s => String(s.id) === serviceId);
    setForm(f => ({
      ...f,
      service_id: serviceId,
      price: svc?.base_price != null ? String(svc.base_price) : f.price,
      estimated_hours: svc?.estimated_hours != null ? String(svc.estimated_hours) : f.estimated_hours,
    }));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {
      title: form.title,
      contact_id: form.contact_id ? Number(form.contact_id) : null,
      property_id: form.property_id ? Number(form.property_id) : null,
      service_id: form.service_id ? Number(form.service_id) : null,
      status: form.status,
      scheduled_date: form.scheduled_date,
      scheduled_time: form.start_time || null,
      actual_end: form.end_time || null,
      duration_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      price: form.price ? Number(form.price) : null,
      notes: form.notes || null,
      internal_notes: isPostJob ? form.completion_notes || null : null,
      crew_ids: crewIds,
    };

    if (isPostJob) {
      if (form.actual_hours) {
        payload.actual_hours = Number(form.actual_hours);
      }
      if (form.tip) {
        payload.tip = Number(form.tip);
      }
      if (form.rating) {
        payload.rating = form.rating;
      }
    }

    const isEdit = !!initialData?.id;
    const url = isEdit ? `/api/jobs/${initialData!.id}` : '/api/jobs';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to save job.');
      } else {
        onSuccess(json.data);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  // ── Select options ──────────────────────────────────────────────────────────
  const contactOptions = [
    { value: '', label: loadingContacts ? 'Loading…' : 'Select client…' },
    ...contacts.map(c => ({ value: String(c.id), label: c.name })),
  ];

  const propertyOptions = [
    { value: '', label: loadingProperties ? 'Loading…' : form.contact_id ? 'Select property…' : 'Select client first…' },
    ...properties.map(p => ({
      value: String(p.id),
      label: [p.address, p.city, p.state].filter(Boolean).join(', '),
    })),
  ];

  const serviceOptions = [
    { value: '', label: loadingServices ? 'Loading…' : 'Select service…' },
    ...services.map(s => ({ value: String(s.id), label: s.name })),
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <Input
        label="Job Title *"
        id="title"
        value={form.title}
        onChange={e => set('title', e.target.value)}
        placeholder="e.g. Weekly house clean"
        required
      />

      {/* Client + Property */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Client"
          id="contact_id"
          value={form.contact_id}
          onChange={e => handleContactChange(e.target.value)}
          options={contactOptions}
        />
        <Select
          label="Property"
          id="property_id"
          value={form.property_id}
          onChange={e => set('property_id', e.target.value)}
          options={propertyOptions}
          disabled={!form.contact_id || loadingProperties}
        />
      </div>

      {/* Service */}
      <Select
        label="Service"
        id="service_id"
        value={form.service_id}
        onChange={e => handleServiceChange(e.target.value)}
        options={serviceOptions}
      />

      {/* Status */}
      <Select
        label="Status"
        id="status"
        value={form.status}
        onChange={e => set('status', e.target.value as JobStatus)}
        options={STATUS_OPTIONS}
      />

      {/* Date + Times */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Scheduled Date *"
          id="scheduled_date"
          type="date"
          value={form.scheduled_date}
          onChange={e => set('scheduled_date', e.target.value)}
          required
        />
        <Input
          label="Start Time"
          id="start_time"
          type="time"
          value={form.start_time}
          onChange={e => set('start_time', e.target.value)}
        />
        <Input
          label="End Time"
          id="end_time"
          type="time"
          value={form.end_time}
          onChange={e => set('end_time', e.target.value)}
        />
      </div>

      {/* Hours + Price + Tip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Estimated Hours"
          id="estimated_hours"
          type="number"
          min="0"
          step="0.25"
          value={form.estimated_hours}
          onChange={e => set('estimated_hours', e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Price ($)"
          id="price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={e => set('price', e.target.value)}
          placeholder="0.00"
        />
        <Input
          label="Tip ($)"
          id="tip"
          type="number"
          min="0"
          step="0.01"
          value={form.tip}
          onChange={e => set('tip', e.target.value)}
          placeholder="0.00"
        />
      </div>

      {/* Completed/Invoiced only fields */}
      {isPostJob && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
            Completion Details
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Actual Hours"
              id="actual_hours"
              type="number"
              min="0"
              step="0.25"
              value={form.actual_hours}
              onChange={e => set('actual_hours', e.target.value)}
              placeholder="0.00"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Client Rating</label>
              <StarRating value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
            </div>
          </div>
          <Textarea
            label="Completion Notes"
            id="completion_notes"
            value={form.completion_notes}
            onChange={e => set('completion_notes', e.target.value)}
            placeholder="Notes visible only to staff…"
            rows={3}
          />
        </div>
      )}

      {/* General Notes */}
      <Textarea
        label="Notes"
        id="notes"
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
        placeholder="Client-facing notes or special instructions…"
        rows={3}
      />

      {/* Crew */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Assigned Crew</label>
        <CrewSelector selectedIds={crewIds} onChange={setCrewIds} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initialData?.id ? 'Update Job' : 'Create Job'}
        </Button>
      </div>
    </form>
  );
}
