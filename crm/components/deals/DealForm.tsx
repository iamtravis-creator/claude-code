'use client';
import { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Deal, Contact, DealStage } from '@/lib/types';

const STAGE_OPTIONS: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

interface DealFormProps {
  initialData?: Partial<Deal>;
  onSuccess: (deal: Deal) => void;
  onCancel: () => void;
}

export default function DealForm({ initialData, onSuccess, onCancel }: DealFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    contact_id: initialData?.contact_id ?? '',
    value: initialData?.value?.toString() ?? '',
    stage: initialData?.stage ?? 'lead',
    probability: initialData?.probability?.toString() ?? '',
    close_date: initialData?.close_date ?? '',
    description: initialData?.description ?? '',
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/contacts').then(r => r.json()).then(j => setContacts(j.data));
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = {
      ...form,
      value: form.value ? parseFloat(form.value) : null,
      probability: form.probability ? parseInt(form.probability) : null,
      contact_id: form.contact_id || null,
    };
    const url = initialData?.id ? `/api/deals/${initialData.id}` : '/api/deals';
    const method = initialData?.id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    setLoading(false);
    if (res.ok) onSuccess(json.data);
  }

  const contactOptions = [{ value: '', label: 'No contact' }, ...contacts.map(c => ({ value: c.id, label: c.name }))];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Deal Title *" id="title" value={form.title} onChange={e => set('title', e.target.value)} required />
      <Select label="Contact" id="contact_id" value={form.contact_id} onChange={e => set('contact_id', e.target.value)} options={contactOptions} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Value ($)" id="value" type="number" min="0" step="0.01" value={form.value} onChange={e => set('value', e.target.value)} />
        <Select label="Stage" id="stage" value={form.stage} onChange={e => set('stage', e.target.value)} options={STAGE_OPTIONS} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Probability (%)" id="probability" type="number" min="0" max="100" value={form.probability} onChange={e => set('probability', e.target.value)} />
        <Input label="Close Date" id="close_date" type="date" value={form.close_date} onChange={e => set('close_date', e.target.value)} />
      </div>
      <Textarea label="Description" id="description" value={form.description} onChange={e => set('description', e.target.value)} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : initialData?.id ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
