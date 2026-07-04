'use client';

import { useState, useEffect, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { Property, Contact } from '@/lib/types';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSuccess: (p: Property) => void;
  onCancel: () => void;
}

const ENTRY_METHOD_OPTIONS = [
  { value: '', label: 'Select entry method...' },
  { value: 'key', label: 'Key' },
  { value: 'code', label: 'Code' },
  { value: 'unlocked', label: 'Unlocked' },
  { value: 'doorman', label: 'Doorman' },
];

const TYPE_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
];

const STATE_OPTIONS = [
  { value: '', label: 'State...' },
  ...[
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
    'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
    'VA','WA','WV','WI','WY',
  ].map(s => ({ value: s, label: s })),
];

export default function PropertyForm({ initialData, onSuccess, onCancel }: PropertyFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    contact_id: String(initialData?.contact_id ?? ''),
    name: initialData?.name ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    zip: initialData?.zip ?? '',
    type: initialData?.type ?? 'residential',
    size_sqft: initialData?.size_sqft != null ? String(initialData.size_sqft) : '',
    bedrooms: initialData?.bedrooms != null ? String(initialData.bedrooms) : '',
    bathrooms: initialData?.bathrooms != null ? String(initialData.bathrooms) : '',
    entry_method: initialData?.entry_method ?? '',
    entry_code: initialData?.entry_code ?? '',
    alarm_code: initialData?.alarm_code ?? '',
    pets: initialData?.pets ?? '',
    parking: initialData?.parking ?? '',
    special_instructions: initialData?.special_instructions ?? '',
    active: initialData?.active ?? 1,
  });

  useEffect(() => {
    fetch('/api/contacts')
      .then(r => r.json())
      .then((data: Contact[] | { contacts: Contact[] }) => {
        const list = Array.isArray(data) ? data : (data as { contacts: Contact[] }).contacts ?? [];
        setContacts(list);
      })
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, []);

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.contact_id) {
      setError('Please select a client.');
      return;
    }
    if (!form.address.trim()) {
      setError('Address is required.');
      return;
    }

    const body = {
      contact_id: form.contact_id || null,
      name: form.name || null,
      address: form.address.trim(),
      city: form.city.trim() || null,
      state: form.state || null,
      zip: form.zip.trim() || null,
      type: form.type,
      size_sqft: form.size_sqft ? Number(form.size_sqft) : null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      entry_method: form.entry_method || null,
      entry_code: form.entry_code || null,
      alarm_code: form.alarm_code || null,
      pets: form.pets || null,
      parking: form.parking || null,
      special_instructions: form.special_instructions || null,
      active: form.active ? 1 : 0,
    };

    const url = isEdit ? `/api/properties/${initialData!.id}` : '/api/properties';
    const method = isEdit ? 'PUT' : 'POST';

    setSubmitting(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const saved: Property = await res.json();
      onSuccess(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const contactOptions = [
    { value: '', label: loadingContacts ? 'Loading contacts...' : 'Select client...' },
    ...contacts.map(c => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Client */}
      <Select
        id="contact_id"
        label="Client *"
        value={form.contact_id}
        onChange={e => set('contact_id', e.target.value)}
        options={contactOptions}
        disabled={loadingContacts}
        required
      />

      {/* Name */}
      <Input
        id="name"
        label="Property Name / Nickname"
        placeholder="e.g. Smith Residence, Downtown Office"
        value={form.name}
        onChange={e => set('name', e.target.value)}
      />

      {/* Address */}
      <Input
        id="address"
        label="Street Address *"
        placeholder="123 Main St"
        value={form.address}
        onChange={e => set('address', e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="city"
          label="City"
          placeholder="City"
          value={form.city}
          onChange={e => set('city', e.target.value)}
        />
        <Select
          id="state"
          label="State"
          value={form.state}
          onChange={e => set('state', e.target.value)}
          options={STATE_OPTIONS}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          id="zip"
          label="ZIP Code"
          placeholder="00000"
          value={form.zip}
          onChange={e => set('zip', e.target.value)}
          maxLength={10}
        />
        <Select
          id="type"
          label="Property Type"
          value={form.type}
          onChange={e => set('type', e.target.value)}
          options={TYPE_OPTIONS}
        />
      </div>

      {/* Size / Rooms */}
      <div className="grid grid-cols-3 gap-3">
        <Input
          id="size_sqft"
          label="Size (sq ft)"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={form.size_sqft}
          onChange={e => set('size_sqft', e.target.value)}
        />
        <Input
          id="bedrooms"
          label="Bedrooms"
          type="number"
          min="0"
          step="1"
          placeholder="0"
          value={form.bedrooms}
          onChange={e => set('bedrooms', e.target.value)}
        />
        <Input
          id="bathrooms"
          label="Bathrooms"
          type="number"
          min="0"
          step="0.5"
          placeholder="0"
          value={form.bathrooms}
          onChange={e => set('bathrooms', e.target.value)}
        />
      </div>

      {/* Entry */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Access & Entry</p>
        <div className="flex flex-col gap-3">
          <Select
            id="entry_method"
            label="Entry Method"
            value={form.entry_method}
            onChange={e => set('entry_method', e.target.value)}
            options={ENTRY_METHOD_OPTIONS}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="entry_code"
              label="Entry Code"
              placeholder="Door code / key tag #"
              value={form.entry_code}
              onChange={e => set('entry_code', e.target.value)}
            />
            <Input
              id="alarm_code"
              label="Alarm Code"
              placeholder="Alarm PIN"
              value={form.alarm_code}
              onChange={e => set('alarm_code', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Extras */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Additional Info</p>
        <div className="flex flex-col gap-3">
          <Input
            id="pets"
            label="Pets"
            placeholder="e.g. 1 golden retriever, keep door closed"
            value={form.pets}
            onChange={e => set('pets', e.target.value)}
          />
          <Input
            id="parking"
            label="Parking"
            placeholder="e.g. Street parking on Oak Ave"
            value={form.parking}
            onChange={e => set('parking', e.target.value)}
          />
          <Textarea
            id="special_instructions"
            label="Special Instructions"
            placeholder="Any other notes for the cleaning crew..."
            rows={3}
            value={form.special_instructions}
            onChange={e => set('special_instructions', e.target.value)}
          />
        </div>
      </div>

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={Boolean(form.active)}
          onChange={e => set('active', e.target.checked)}
        />
        <span className="text-sm text-gray-700">Active property</span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
}
