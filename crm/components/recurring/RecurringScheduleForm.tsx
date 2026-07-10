'use client';

import { useState, useEffect, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { RecurringSchedule, Contact, Property, CleaningService, Frequency } from '@/lib/types';

interface RecurringScheduleFormProps {
  initialData?: Partial<RecurringSchedule>;
  onSuccess: (schedule: RecurringSchedule) => void;
  onCancel: () => void;
}

const FREQUENCY_OPTIONS = [
  { value: 'weekly',    label: 'Weekly' },
  { value: 'biweekly',  label: 'Bi-weekly (every 2 weeks)' },
  { value: 'monthly',   label: 'Monthly' },
];

const DAY_OF_WEEK_OPTIONS = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
];

const DAY_OF_MONTH_OPTIONS = Array.from({ length: 28 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

export default function RecurringScheduleForm({
  initialData,
  onSuccess,
  onCancel,
}: RecurringScheduleFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    contact_id:      initialData?.contact_id ?? '',
    property_id:     initialData?.property_id ?? '',
    service_id:      initialData?.service_id ?? '',
    title:           initialData?.title ?? '',
    frequency:       (initialData?.frequency ?? 'weekly') as Frequency,
    day_of_week:     initialData?.day_of_week != null ? String(initialData.day_of_week) : '1',
    day_of_month:    initialData?.day_of_month != null ? String(initialData.day_of_month) : '1',
    start_date:      initialData?.start_date ?? '',
    end_date:        initialData?.end_date ?? '',
    start_time:      initialData?.start_time ?? '',
    estimated_hours: initialData?.estimated_hours != null ? String(initialData.estimated_hours) : '',
    price:           initialData?.price != null ? String(initialData.price) : '',
    active:          initialData?.active ?? 1,
    notes:           initialData?.notes ?? '',
  });

  const [contacts,   setContacts]   = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [services,   setServices]   = useState<CleaningService[]>([]);
  const [loadingContacts,   setLoadingContacts]   = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingServices,   setLoadingServices]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Load contacts + services on mount
  useEffect(() => {
    fetch('/api/contacts')
      .then(r => r.json())
      .then(j => setContacts(j.data ?? []))
      .finally(() => setLoadingContacts(false));

    fetch('/api/services?active=1')
      .then(r => r.json())
      .then(j => setServices(Array.isArray(j) ? j : (j.data ?? [])))
      .finally(() => setLoadingServices(false));
  }, []);

  // Load properties when contact changes
  useEffect(() => {
    if (!form.contact_id) {
      setProperties([]);
      setForm(f => ({ ...f, property_id: '' }));
      return;
    }
    setLoadingProperties(true);
    fetch(`/api/properties?contact_id=${form.contact_id}`)
      .then(r => r.json())
      .then(j => setProperties(j.data ?? []))
      .finally(() => setLoadingProperties(false));
  }, [form.contact_id]);

  // Auto-fill title when service or contact changes
  useEffect(() => {
    if (form.title && isEdit) return; // don't overwrite on edit
    const svc = services.find(s => String(s.id) === form.service_id);
    const con = contacts.find(c => String(c.id) === form.contact_id);
    if (svc || con) {
      const parts = [svc?.name, con?.name].filter(Boolean);
      setForm(f => ({ ...f, title: parts.join(' — ') }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.service_id, form.contact_id]);

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.contact_id) { setError('Client is required.'); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.start_date) { setError('Start date is required.'); return; }

    const body = {
      contact_id:      form.contact_id,
      property_id:     form.property_id || null,
      service_id:      form.service_id  || null,
      title:           form.title.trim(),
      frequency:       form.frequency,
      day_of_week:     (form.frequency === 'weekly' || form.frequency === 'biweekly')
                         ? Number(form.day_of_week)
                         : null,
      day_of_month:    form.frequency === 'monthly'
                         ? Number(form.day_of_month)
                         : null,
      start_date:      form.start_date,
      end_date:        form.end_date || null,
      start_time:      form.start_time || null,
      estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      price:           form.price ? Number(form.price) : null,
      active:          Boolean(form.active),
      notes:           form.notes.trim() || null,
    };

    const url    = isEdit ? `/api/recurring/${initialData!.id}` : '/api/recurring';
    const method = isEdit ? 'PUT' : 'POST';

    setSubmitting(true);
    try {
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      onSuccess(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const contactOptions = [
    { value: '', label: loadingContacts ? 'Loading…' : 'Select client *' },
    ...contacts.map(c => ({ value: String(c.id), label: c.name })),
  ];

  const propertyOptions = [
    { value: '', label: loadingProperties ? 'Loading…' : form.contact_id ? 'Any property' : 'Select client first' },
    ...properties.map(p => ({
      value: String(p.id),
      label: [p.address, p.city].filter(Boolean).join(', '),
    })),
  ];

  const serviceOptions = [
    { value: '', label: loadingServices ? 'Loading…' : 'No specific service' },
    ...services.map(s => ({ value: String(s.id), label: s.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Client + Property */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="rs-contact"
          label="Client *"
          value={form.contact_id}
          onChange={e => set('contact_id', e.target.value)}
          options={contactOptions}
          required
        />
        <Select
          id="rs-property"
          label="Property"
          value={form.property_id}
          onChange={e => set('property_id', e.target.value)}
          options={propertyOptions}
          disabled={!form.contact_id || loadingProperties}
        />
      </div>

      {/* Service */}
      <Select
        id="rs-service"
        label="Service"
        value={form.service_id}
        onChange={e => set('service_id', e.target.value)}
        options={serviceOptions}
      />

      {/* Title */}
      <Input
        id="rs-title"
        label="Schedule Title *"
        value={form.title}
        onChange={e => set('title', e.target.value)}
        placeholder="e.g. Weekly Residential — Sarah Johnson"
        required
      />

      {/* Frequency */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Cadence</p>
        <Select
          id="rs-frequency"
          label="Frequency *"
          value={form.frequency}
          onChange={e => set('frequency', e.target.value)}
          options={FREQUENCY_OPTIONS}
        />
      </div>

      {/* Day of week (weekly / biweekly) */}
      {(form.frequency === 'weekly' || form.frequency === 'biweekly') && (
        <Select
          id="rs-dow"
          label="Day of Week"
          value={form.day_of_week}
          onChange={e => set('day_of_week', e.target.value)}
          options={DAY_OF_WEEK_OPTIONS}
        />
      )}

      {/* Day of month (monthly) */}
      {form.frequency === 'monthly' && (
        <Select
          id="rs-dom"
          label="Day of Month"
          value={form.day_of_month}
          onChange={e => set('day_of_month', e.target.value)}
          options={DAY_OF_MONTH_OPTIONS}
        />
      )}

      {/* Start / End dates + time */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          id="rs-start-date"
          label="Start Date *"
          type="date"
          value={form.start_date}
          onChange={e => set('start_date', e.target.value)}
          required
        />
        <Input
          id="rs-end-date"
          label="End Date (optional)"
          type="date"
          value={form.end_date}
          onChange={e => set('end_date', e.target.value)}
        />
      </div>

      <Input
        id="rs-start-time"
        label="Start Time"
        type="time"
        value={form.start_time}
        onChange={e => set('start_time', e.target.value)}
      />

      {/* Pricing */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Defaults per Job</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="rs-price"
            label="Price ($)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="0.00"
          />
          <Input
            id="rs-hours"
            label="Estimated Hours"
            type="number"
            min="0"
            step="0.5"
            value={form.estimated_hours}
            onChange={e => set('estimated_hours', e.target.value)}
            placeholder="e.g. 2.5"
          />
        </div>
      </div>

      {/* Notes */}
      <Textarea
        id="rs-notes"
        label="Notes"
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
        placeholder="Access instructions, special requirements…"
        rows={2}
      />

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={Boolean(form.active)}
          onChange={e => set('active', e.target.checked ? 1 : 0)}
        />
        <span className="text-sm text-gray-700">Active (generates jobs when triggered)</span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Schedule'}
        </Button>
      </div>
    </form>
  );
}
