'use client';
import { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Quote, QuoteItem, QuoteStatus, Contact, Property, CleaningService } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  description: string;
  quantity: string;
  unit_price: string;
  total: number;
}

interface QuoteFormProps {
  initialData?: Partial<Quote & { items?: QuoteItem[] }>;
  onSuccess: (quote: Quote) => void;
  onCancel: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: QuoteStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

const EMPTY_ITEM: LineItem = { description: '', quantity: '1', unit_price: '', total: 0 };

function calcTotal(qty: string, price: string): number {
  const q = parseFloat(qty) || 0;
  const p = parseFloat(price) || 0;
  return Math.round(q * p * 100) / 100;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuoteForm({ initialData, onSuccess, onCancel }: QuoteFormProps) {
  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    contact_id: initialData?.contact_id ? String(initialData.contact_id) : '',
    property_id: initialData?.property_id ? String(initialData.property_id) : '',
    service_id: initialData?.service_id ? String(initialData.service_id) : '',
    status: (initialData?.status ?? 'draft') as QuoteStatus,
    valid_until: initialData?.valid_until ?? '',
    tax_rate: initialData?.tax_rate != null ? String(initialData.tax_rate) : '0',
    notes: initialData?.notes ?? '',
  });

  const [items, setItems] = useState<LineItem[]>(() => {
    if (initialData?.items && initialData.items.length > 0) {
      return initialData.items.map(it => ({
        description: it.description,
        quantity: String(it.quantity),
        unit_price: String(it.unit_price),
        total: it.total,
      }));
    }
    return [{ ...EMPTY_ITEM }];
  });

  // ── Reference data ──────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [services, setServices] = useState<CleaningService[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!form.contact_id) {
      setProperties([]);
      setForm(f => ({ ...f, property_id: '' }));
      return;
    }
    setLoadingProperties(true);
    fetch(`/api/properties?contact_id=${form.contact_id}`)
      .then(r => r.json())
      .then(json => setProperties(json.data ?? []))
      .finally(() => setLoadingProperties(false));
  }, [form.contact_id]);

  // ── Auto-fill price from service ────────────────────────────────────────────
  function handleServiceChange(serviceId: string) {
    const svc = services.find(s => String(s.id) === serviceId);
    setForm(f => ({ ...f, service_id: serviceId }));
    if (svc?.base_price != null) {
      setItems(prev => {
        if (prev.length === 1 && !prev[0].description && !prev[0].unit_price) {
          const price = String(svc.base_price);
          return [{
            description: svc.name,
            quantity: '1',
            unit_price: price,
            total: calcTotal('1', price),
          }];
        }
        return prev;
      });
    }
  }

  // ── Calculations ────────────────────────────────────────────────────────────
  const subtotal = items.reduce((sum, it) => sum + it.total, 0);
  const taxRate = parseFloat(form.tax_rate) || 0;
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  // ── Line item handlers ──────────────────────────────────────────────────────
  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems(prev => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      item.total = calcTotal(
        field === 'quantity' ? value : item.quantity,
        field === 'unit_price' ? value : item.unit_price,
      );
      next[index] = item;
      return next;
    });
  }

  function addItem() {
    setItems(prev => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.contact_id) {
      setError('Please select a client.');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      contact_id: Number(form.contact_id),
      property_id: form.property_id ? Number(form.property_id) : null,
      service_id: form.service_id ? Number(form.service_id) : null,
      status: form.status,
      valid_until: form.valid_until || null,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      subtotal,
      total: grandTotal,
      notes: form.notes || null,
      items: items.map(it => ({
        description: it.description,
        quantity: parseFloat(it.quantity) || 1,
        unit_price: parseFloat(it.unit_price) || 0,
        total: it.total,
      })),
    };

    const isEdit = !!initialData?.id;
    const url = isEdit ? `/api/quotes/${initialData!.id}` : '/api/quotes';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Failed to save quote.');
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
    {
      value: '',
      label: loadingProperties
        ? 'Loading…'
        : form.contact_id
        ? 'Select property (optional)…'
        : 'Select client first…',
    },
    ...properties.map(p => ({
      value: String(p.id),
      label: [p.name, p.address, p.city, p.state].filter(Boolean).join(', '),
    })),
  ];

  const serviceOptions = [
    { value: '', label: loadingServices ? 'Loading…' : 'Select service (optional)…' },
    ...services.map(s => ({ value: String(s.id), label: s.name })),
  ];

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client + Property */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Client *"
          id="contact_id"
          value={form.contact_id}
          onChange={e => setForm(f => ({ ...f, contact_id: e.target.value, property_id: '' }))}
          options={contactOptions}
          required
        />
        <Select
          label="Property"
          id="property_id"
          value={form.property_id}
          onChange={e => setForm(f => ({ ...f, property_id: e.target.value }))}
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

      {/* Status + Valid Until */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Status"
          id="status"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value as QuoteStatus }))}
          options={STATUS_OPTIONS}
        />
        <Input
          label="Valid Until"
          id="valid_until"
          type="date"
          value={form.valid_until}
          onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
        />
      </div>

      {/* Tax Rate */}
      <Input
        label="Tax Rate (%)"
        id="tax_rate"
        type="number"
        min="0"
        max="100"
        step="0.01"
        value={form.tax_rate}
        onChange={e => setForm(f => ({ ...f, tax_rate: e.target.value }))}
        placeholder="0"
        className="max-w-xs"
      />

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Line Items</label>
          <Button type="button" variant="secondary" size="sm" onClick={addItem}>
            + Add Item
          </Button>
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_80px_100px_100px_36px] gap-0 bg-gray-50 border-b border-gray-200 px-3 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Description</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Qty</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Unit Price</span>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Total</span>
            <span />
          </div>

          {/* Item rows */}
          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[1fr_80px_100px_100px_36px] gap-0 items-center border-b border-gray-100 last:border-b-0 px-3 py-2"
            >
              <input
                type="text"
                value={item.description}
                onChange={e => updateItem(idx, 'description', e.target.value)}
                placeholder="Service or item description"
                className="w-full rounded border-0 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:rounded px-1 py-1 pr-2"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.quantity}
                onChange={e => updateItem(idx, 'quantity', e.target.value)}
                className="w-full rounded border-0 bg-transparent text-sm text-center text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:rounded px-1 py-1"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={item.unit_price}
                onChange={e => updateItem(idx, 'unit_price', e.target.value)}
                placeholder="0.00"
                className="w-full rounded border-0 bg-transparent text-sm text-right text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:rounded px-1 py-1"
              />
              <span className="text-sm text-right text-gray-800 font-medium px-1">
                {fmt(item.total)}
              </span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                className="flex items-center justify-center text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Remove item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-3 flex flex-col items-end gap-1 pr-1">
          <div className="flex gap-8 text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="w-24 text-right font-medium text-gray-800">{fmt(subtotal)}</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <span>Tax ({taxRate}%)</span>
            <span className="w-24 text-right font-medium text-gray-800">{fmt(taxAmount)}</span>
          </div>
          <div className="flex gap-8 text-sm font-semibold text-gray-900 border-t border-gray-300 pt-1 mt-1">
            <span>Total</span>
            <span className="w-24 text-right">{fmt(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="Notes"
        id="notes"
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
        placeholder="Scope of work, terms, or special considerations…"
        rows={3}
      />

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
          {saving ? 'Saving…' : initialData?.id ? 'Update Quote' : 'Create Quote'}
        </Button>
      </div>
    </form>
  );
}
