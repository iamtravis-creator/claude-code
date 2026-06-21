'use client';
import { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Task, Contact, Deal } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

interface TaskFormProps {
  initialData?: Partial<Task>;
  onSuccess: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ initialData, onSuccess, onCancel }: TaskFormProps) {
  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    status: initialData?.status ?? 'open',
    priority: initialData?.priority ?? 'medium',
    due_date: initialData?.due_date ?? '',
    contact_id: initialData?.contact_id ?? '',
    deal_id: initialData?.deal_id ?? '',
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([fetch('/api/contacts').then(r => r.json()), fetch('/api/deals').then(r => r.json())])
      .then(([c, d]) => { setContacts(c.data); setDeals(d.data); });
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = { ...form, contact_id: form.contact_id || null, deal_id: form.deal_id || null };
    const url = initialData?.id ? `/api/tasks/${initialData.id}` : '/api/tasks';
    const method = initialData?.id ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const json = await res.json();
    setLoading(false);
    if (res.ok) onSuccess(json.data);
  }

  const contactOptions = [{ value: '', label: 'No contact' }, ...contacts.map(c => ({ value: c.id, label: c.name }))];
  const dealOptions = [{ value: '', label: 'No deal' }, ...deals.map(d => ({ value: d.id, label: d.title }))];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title *" id="title" value={form.title} onChange={e => set('title', e.target.value)} required />
      <Textarea label="Description" id="description" value={form.description} onChange={e => set('description', e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Status" id="status" value={form.status} onChange={e => set('status', e.target.value)} options={STATUS_OPTIONS} />
        <Select label="Priority" id="priority" value={form.priority} onChange={e => set('priority', e.target.value)} options={PRIORITY_OPTIONS} />
      </div>
      <Input label="Due Date" id="due_date" type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} />
      <Select label="Contact" id="contact_id" value={form.contact_id} onChange={e => set('contact_id', e.target.value)} options={contactOptions} />
      <Select label="Deal" id="deal_id" value={form.deal_id} onChange={e => set('deal_id', e.target.value)} options={dealOptions} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : initialData?.id ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
}
