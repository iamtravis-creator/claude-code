'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ContactForm from '@/components/contacts/ContactForm';
import NoteForm from '@/components/notes/NoteForm';
import NoteCard from '@/components/notes/NoteCard';
import { Contact, Deal, Task, Note } from '@/lib/types';

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);

  const load = useCallback(async () => {
    const [cRes, dRes, tRes, nRes] = await Promise.all([
      fetch(`/api/contacts/${id}`),
      fetch(`/api/deals?contact_id=${id}`),
      fetch(`/api/tasks?contact_id=${id}`),
      fetch(`/api/notes?contact_id=${id}`),
    ]);
    const [cJson, dJson, tJson, nJson] = await Promise.all([cRes.json(), dRes.json(), tRes.json(), nRes.json()]);
    setContact(cJson.data);
    setDeals(dJson.data);
    setTasks(tJson.data);
    setNotes(nJson.data);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (!contact) return <div className="text-gray-400">Loading…</div>;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/contacts" className="text-sm text-blue-600 hover:underline">← Contacts</Link>
      </div>

      {/* Contact card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{contact.name}</h1>
            {contact.job_title && contact.company && (
              <p className="text-gray-500 mt-1">{contact.job_title} at {contact.company}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge value={contact.status} />
            <Button variant="secondary" size="sm" onClick={() => setEditModal(true)}>Edit</Button>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {contact.email && <><dt className="text-gray-500">Email</dt><dd>{contact.email}</dd></>}
          {contact.phone && <><dt className="text-gray-500">Phone</dt><dd>{contact.phone}</dd></>}
          {contact.source && <><dt className="text-gray-500">Source</dt><dd>{contact.source}</dd></>}
          <dt className="text-gray-500">Created</dt><dd>{fmt(contact.created_at)}</dd>
          {contact.notes_text && (
            <><dt className="text-gray-500 col-span-2">Quick note</dt><dd className="col-span-2 text-gray-700">{contact.notes_text}</dd></>
          )}
        </dl>
      </div>

      {/* Deals */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Deals ({deals.length})</h2>
        {deals.length === 0 ? (
          <p className="text-gray-400 text-sm">No deals linked</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{['Title', 'Stage', 'Value', 'Close Date'].map(h => (
                  <th key={h} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deals.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{d.title}</td>
                    <td className="px-4 py-3"><Badge value={d.stage} /></td>
                    <td className="px-4 py-3">{d.value ? `$${d.value.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{d.close_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Tasks */}
      <section className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-400 text-sm">No tasks linked</p>
        ) : (
          <div className="space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t.title}</p>
                  {t.due_date && <p className="text-xs text-gray-400 mt-0.5">Due {t.due_date}</p>}
                </div>
                <div className="flex gap-2">
                  <Badge value={t.priority} />
                  <Badge value={t.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-gray-900">Activity ({notes.length})</h2>
          <Button size="sm" onClick={() => setNoteModal(true)}>+ Log Activity</Button>
        </div>
        {notes.length === 0 ? (
          <p className="text-gray-400 text-sm">No activity logged</p>
        ) : (
          <div className="space-y-3">
            {notes.map(n => <NoteCard key={n.id} note={n} onDelete={load} />)}
          </div>
        )}
      </section>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Contact">
        <ContactForm initialData={contact} onSuccess={() => { setEditModal(false); load(); }} onCancel={() => setEditModal(false)} />
      </Modal>

      <Modal isOpen={noteModal} onClose={() => setNoteModal(false)} title="Log Activity">
        <NoteForm initialData={{ contact_id: id }} onSuccess={() => { setNoteModal(false); load(); }} onCancel={() => setNoteModal(false)} />
      </Modal>
    </div>
  );
}
