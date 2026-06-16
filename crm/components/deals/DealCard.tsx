'use client';
import Link from 'next/link';
import { DealWithContact } from '@/lib/types';

interface DealCardProps {
  deal: DealWithContact;
  onDragStart: (id: string) => void;
  onClick: (deal: DealWithContact) => void;
}

export default function DealCard({ deal, onDragStart, onClick }: DealCardProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal.id)}
      onClick={() => onClick(deal)}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <p className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{deal.title}</p>
      {deal.contact_name && (
        <p className="text-xs text-blue-600 mb-2 truncate">
          <Link href={`/contacts/${deal.contact_id}`} onClick={e => e.stopPropagation()} className="hover:underline">
            {deal.contact_name}
          </Link>
        </p>
      )}
      <div className="flex items-center justify-between">
        {deal.value ? (
          <span className="text-xs font-semibold text-green-700">${deal.value.toLocaleString()}</span>
        ) : <span />}
        {deal.close_date && (
          <span className="text-xs text-gray-400">{deal.close_date}</span>
        )}
      </div>
    </div>
  );
}
