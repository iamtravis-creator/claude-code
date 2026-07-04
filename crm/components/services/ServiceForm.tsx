'use client';

import { useState, FormEvent } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { CleaningService } from '@/lib/types';

interface ServiceFormProps {
  initialData?: Partial<CleaningService>;
  onSuccess: (s: CleaningService) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'specialty', label: 'Specialty' },
];

export default function ServiceForm({ initialData, onSuccess, onCancel }: ServiceFormProps) {
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    category: initialData?.category ?? 'residential',
    base_price: initialData?.base_price != null ? String(initialData.base_price) : '',
    price_per_sqft: initialData?.price_per_sqft != null ? String(initialData.price_per_sqft) : '',
    estimated_hours: initialData?.estimated_hours != null ? String(initialData.estimated_hours) : '',
    active: initialData?.active ?? true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Service name is required.');
      return;
    }

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category,
      base_price: form.base_price ? Number(form.base_price) : null,
      price_per_sqft: form.price_per_sqft ? Number(form.price_per_sqft) : null,
      estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      active: form.active,
    };

    const url = isEdit ? `/api/services/${initialData!.id}` : '/api/services';
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
      const saved: CleaningService = await res.json();
      onSuccess(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Name */}
      <Input
        id="service_name"
        label="Service Name *"
        placeholder="e.g. Standard Residential Clean"
        value={form.name}
        onChange={e => set('name', e.target.value)}
        required
        autoFocus
      />

      {/* Description */}
      <Textarea
        id="service_description"
        label="Description"
        placeholder="What does this service include?"
        rows={3}
        value={form.description}
        onChange={e => set('description', e.target.value)}
      />

      {/* Category */}
      <Select
        id="service_category"
        label="Category"
        value={form.category}
        onChange={e => set('category', e.target.value)}
        options={CATEGORY_OPTIONS}
      />

      {/* Pricing */}
      <div className="pt-1 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Pricing</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="base_price" className="text-sm font-medium text-gray-700">
              Base Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                $
              </span>
              <input
                id="base_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.base_price}
                onChange={e => set('base_price', e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="price_per_sqft" className="text-sm font-medium text-gray-700">
              Price per Sq Ft ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                $
              </span>
              <input
                id="price_per_sqft"
                type="number"
                min="0"
                step="0.001"
                placeholder="0.000"
                value={form.price_per_sqft}
                onChange={e => set('price_per_sqft', e.target.value)}
                className="block w-full rounded-md border border-gray-300 pl-7 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hours */}
      <Input
        id="estimated_hours"
        label="Estimated Hours"
        type="number"
        min="0"
        step="0.5"
        placeholder="e.g. 2.5"
        value={form.estimated_hours}
        onChange={e => set('estimated_hours', e.target.value)}
      />

      {/* Active */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={Boolean(form.active)}
          onChange={e => set('active', e.target.checked)}
        />
        <span className="text-sm text-gray-700">Active service (available for booking)</span>
      </label>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Service'}
        </Button>
      </div>
    </form>
  );
}
