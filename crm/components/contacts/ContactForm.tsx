'use client';
import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Contact } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'churned', label: 'Churned' },
];

interface ContactFormProps {
  initialData?: Partial<Contact>;
  onSuccess: (contact: Contact) => void;
  onCancel: () => void;
}

export default function ContactForm({ initialData, onSuccess, onCancel }: ContactFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    company: initialData?.company ?? '',
    job_title: initialData?.job_title ?? '',
    status: initialData?.status ?? 'lead',
    source: initialData?.source ?? '',
    notes_text: initialData?.notes_text ?? '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url = initialData?.id ? `/api/contacts/${initialData.id}` : '/api/contacts';
    const method = initialData?.id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const json = await res.json();
    setLoading(false);
    if (res.ok) onSuccess(json.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Name *" id="name" value={form.name} onChange={e => set('name', e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Email" id="email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        <Input label="Phone" id="phone" value={form.phone} onChange={e => set('phone', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Company" id="company" value={form.company} onChange={e => set('company', e.target.value)} />
        <Input label="Job Title" id="job_title" value={form.job_title} onChange={e => set('job_title', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" id="status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTIONS} />
        <Input label="Source" id="source" placeholder="referral, website…" value={form.source} onChange={e => set('source', e.target.value)} />
      </div>
      <Textarea label="Notes" id="notes_text" value={form.notes_text} onChange={e => set('notes_text', e.target.value)} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : initialData?.id ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
