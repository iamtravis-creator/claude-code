'use client';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { NoteWithRefs } from '@/lib/types';

interface NoteCardProps {
  note: NoteWithRefs;
  onDelete?: () => void;
  onEdit?: (note: NoteWithRefs) => void;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  async function handleDelete() {
    if (!confirm('Delete this note?')) return;
    await fetch(`/api/notes/${note.id}`, { method: 'DELETE' });
    onDelete?.();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge value={note.type} />
          {note.contact_name && (
            <span className="text-xs text-gray-500">
              <Link href={`/contacts/${note.contact_id}`} className="text-blue-600 hover:underline">{note.contact_name}</Link>
            </span>
          )}
          {note.deal_title && (
            <span className="text-xs text-gray-500">· {note.deal_title}</span>
          )}
          <span className="text-xs text-gray-400">{fmt(note.created_at)}</span>
        </div>
        <div className="flex gap-1 shrink-0">
          {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(note)}>Edit</Button>}
          {onDelete && <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}
