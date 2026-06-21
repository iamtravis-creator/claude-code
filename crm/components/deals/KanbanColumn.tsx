'use client';
import { DragEvent } from 'react';
import DealCard from './DealCard';
import { DealWithContact } from '@/lib/types';

interface KanbanColumnProps {
  stage: string;
  label: string;
  deals: DealWithContact[];
  draggingId: string | null;
  onDragStart: (id: string) => void;
  onDrop: (stage: string) => void;
  onDragOver: (e: DragEvent) => void;
  onCardClick: (deal: DealWithContact) => void;
}

export default function KanbanColumn({
  stage, label, deals, draggingId, onDragStart, onDrop, onDragOver, onCardClick,
}: KanbanColumnProps) {
  const total = deals.reduce((s, d) => s + (d.value ?? 0), 0);

  return (
    <div
      className="flex flex-col bg-gray-100 rounded-xl min-w-[220px] w-[220px]"
      onDragOver={onDragOver}
      onDrop={() => onDrop(stage)}
    >
      <div className="px-3 py-2.5 border-b border-gray-200">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {deals.length} deal{deals.length !== 1 ? 's' : ''}
          {total > 0 && ` · $${total.toLocaleString()}`}
        </p>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-[200px]">
        {deals.map(d => (
          <div key={d.id} className={draggingId === d.id ? 'opacity-40' : ''}>
            <DealCard deal={d} onDragStart={onDragStart} onClick={onCardClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
