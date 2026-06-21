'use client';
import { useState, DragEvent } from 'react';
import KanbanColumn from './KanbanColumn';
import Modal from '@/components/ui/Modal';
import DealForm from './DealForm';
import { DealWithContact, DealStage } from '@/lib/types';

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'lead', label: 'Lead' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];

interface KanbanBoardProps {
  deals: DealWithContact[];
  onRefresh: () => void;
}

export default function KanbanBoard({ deals, onRefresh }: KanbanBoardProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; deal?: DealWithContact }>({ open: false });

  function onDragOver(e: DragEvent) { e.preventDefault(); }

  async function onDrop(stage: string) {
    if (!draggingId) return;
    const deal = deals.find(d => d.id === draggingId);
    if (!deal || deal.stage === stage) { setDraggingId(null); return; }
    await fetch(`/api/deals/${draggingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    setDraggingId(null);
    onRefresh();
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map(s => (
          <KanbanColumn
            key={s.id}
            stage={s.id}
            label={s.label}
            deals={deals.filter(d => d.stage === s.id)}
            draggingId={draggingId}
            onDragStart={setDraggingId}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onCardClick={deal => setEditModal({ open: true, deal })}
          />
        ))}
      </div>

      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false })}
        title={editModal.deal ? 'Edit Deal' : 'New Deal'}
      >
        <DealForm
          initialData={editModal.deal}
          onSuccess={() => { setEditModal({ open: false }); onRefresh(); }}
          onCancel={() => setEditModal({ open: false })}
        />
      </Modal>
    </>
  );
}
