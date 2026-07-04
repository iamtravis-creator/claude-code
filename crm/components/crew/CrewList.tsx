'use client';
import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/layout/PageHeader';
import CrewForm from './CrewForm';
import { CrewMember } from '@/lib/types';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
];

function payLabel(member: CrewMember): string {
  if (member.pay_rate == null) return '—';
  const rate = `$${Number(member.pay_rate).toFixed(2)}`;
  switch (member.pay_type) {
    case 'hourly': return `${rate}/hr`;
    case 'per_job': return `${rate}/job`;
    case 'salary': return `${rate}/yr`;
    default: return rate;
  }
}

interface CrewCardProps {
  member: CrewMember;
  onEdit: (member: CrewMember) => void;
  onDelete: (id: string) => void;
}

function CrewCard({ member, onEdit, onDelete }: CrewCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900 text-base leading-tight">{member.name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge value={member.role} />
            <Badge value={member.status} />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        {member.phone && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </span>
            <a href={`tel:${member.phone}`} className="hover:text-blue-600">{member.phone}</a>
          </div>
        )}
        {member.email && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">{member.email}</a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">{payLabel(member)}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>Edit</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(member.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CrewList() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState<{ open: boolean; member?: CrewMember }>({ open: false });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/crew?${params}`);
    const json = await res.json();
    setCrew(json.data ?? []);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function deleteMember(id: string) {
    if (!confirm('Delete this crew member?')) return;
    await fetch(`/api/crew/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <PageHeader
        title="Crew"
        action={
          <Button onClick={() => setModal({ open: true })}>
            + Add Team Member
          </Button>
        }
      />

      <div className="flex gap-2 mb-5">
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {crew.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No crew members found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {crew.map(member => (
            <CrewCard
              key={member.id}
              member={member}
              onEdit={m => setModal({ open: true, member: m })}
              onDelete={deleteMember}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.member ? 'Edit Team Member' : 'Add Team Member'}
      >
        <CrewForm
          initialData={modal.member}
          onSuccess={() => { setModal({ open: false }); load(); }}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
