'use client';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/layout/PageHeader';
import KanbanBoard from '@/components/deals/KanbanBoard';
import DealForm from '@/components/deals/DealForm';
import { DealWithContact } from '@/lib/types';

export default function DealsPage() {
  const [deals, setDeals] = useState<DealWithContact[]>([]);
  const [newModal, setNewModal] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/deals');
    const json = await res.json();
    setDeals(json.data);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <PageHeader
        title="Deals Pipeline"
        action={<Button onClick={() => setNewModal(true)}>+ New Deal</Button>}
      />
      <KanbanBoard deals={deals} onRefresh={load} />
      <Modal isOpen={newModal} onClose={() => setNewModal(false)} title="New Deal">
        <DealForm onSuccess={() => { setNewModal(false); load(); }} onCancel={() => setNewModal(false)} />
      </Modal>
    </>
  );
}
