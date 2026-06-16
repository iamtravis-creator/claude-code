'use client';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/layout/PageHeader';
import NoteCard from './NoteCard';
import NoteForm from './NoteForm';
import { NoteWithRefs } from '@/lib/types';

const TYPES = ['', 'note', 'call', 'email', 'meeting'];
const TYPE_LABELS: Record<string, string> = { '': 'All', note: 'Notes', call: 'Calls', email: 'Emails', meeting: 'Meetings' };

export default function NoteList() {
  const [notes, setNotes] = useState<NoteWithRefs[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [modal, setModal] = useState<{ open: boolean; note?: NoteWithRefs }>({ open: false });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (typeFilter) params.set('type', typeFilter);
    const res = await fetch(`/api/notes?${params}`);
    const json = await res.json();
    setNotes(json.data);
  }, [typeFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <PageHeader
        title="Activity Log"
        action={<Button onClick={() => setModal({ open: true })}>+ Log Activity</Button>}
      />

      <div className="flex gap-2 mb-4">
        {TYPES.map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${
              typeFilter === t
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {notes.length === 0 && (
          <div className="text-center py-12 text-gray-400">No activity logged yet</div>
        )}
        {notes.map(n => (
          <NoteCard
            key={n.id}
            note={n}
            onDelete={load}
            onEdit={note => setModal({ open: true, note })}
          />
        ))}
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.note ? 'Edit Note' : 'Log Activity'}
      >
        <NoteForm
          initialData={modal.note}
          onSuccess={() => { setModal({ open: false }); load(); }}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
