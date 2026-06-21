'use client';
import { useState, useEffect, FormEvent } from 'react';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Note, Contact, Deal } from '@/lib/types';

const TYPE_OPTIONS = [
  { value: 'note', label: 'Note' },
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
];

interface NoteFormProps {
  initialData?: Partial<Note>;
  onSuccess: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteForm({ initialData, onSuccess, onCancel }: NoteFormProps) {
  const [form, setForm] = useState({
    content: initialData?.content ?? '',
    type: initialData?.type ?? 'note',
    contact_id: initialData?.contact_id ?? '',
    deal_id: initialData?.deal_id ?? '',
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  const showRefPickers = !initialData?.contact_id && !initialData?.deal_id;

  useEffect(() => {
    if (showRefPickers) {
      Promise.all([fetch('/api/contacts').then(r => r.json()), fetch('/api/deals').then(r => r.json())])
        .then(([c, d]) => { setContacts(c.data); setDeals(d.data); });
    }
  }, [showRefPickers]);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const body = { ...form, contact_id: form.contact_id || null, deal_id: form.deal_id || null };
    const url = initialData?.id ? `/api/notes/${initialData.id}` : '/api/notes';
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
      <Select label="Type" id="type" value={form.type} onChange={e => set('type', e.target.value)} options={TYPE_OPTIONS} />
      <Textarea label="Content *" id="content" rows={4} value={form.content} onChange={e => set('content', e.target.value)} required />
      {showRefPickers && (
        <>
          <Select label="Contact" id="contact_id" value={form.contact_id} onChange={e => set('contact_id', e.target.value)} options={contactOptions} />
          <Select label="Deal" id="deal_id" value={form.deal_id} onChange={e => set('deal_id', e.target.value)} options={dealOptions} />
        </>
      )}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : initialData?.id ? 'Update' : 'Log'}</Button>
      </div>
    </form>
  );
}
