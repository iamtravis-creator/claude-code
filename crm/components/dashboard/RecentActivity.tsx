import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { NoteWithRefs } from '@/lib/types';

interface RecentActivityProps {
  notes: NoteWithRefs[];
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function RecentActivity({ notes }: RecentActivityProps) {
  if (notes.length === 0) {
    return <p className="text-gray-400 text-sm">No recent activity</p>;
  }
  return (
    <div className="space-y-3">
      {notes.map(n => (
        <div key={n.id} className="flex gap-3 items-start">
          <Badge value={n.type} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 line-clamp-1">{n.content}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {n.contact_name && (
                <Link href={`/contacts/${n.contact_id}`} className="text-xs text-blue-600 hover:underline">{n.contact_name}</Link>
              )}
              <span className="text-xs text-gray-400">{fmt(n.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
