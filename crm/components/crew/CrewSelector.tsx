'use client';
import { useState, useEffect } from 'react';
import { CrewMember } from '@/lib/types';

interface CrewSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const ROLE_LABELS: Record<string, string> = {
  cleaner: 'Cleaner',
  team_lead: 'Team Lead',
  supervisor: 'Supervisor',
};

export default function CrewSelector({ selectedIds, onChange }: CrewSelectorProps) {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/crew?status=active')
      .then(r => r.json())
      .then(json => setCrew(json.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-28 rounded-full bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (crew.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-2">No active crew members found.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 py-1">
      {crew.map(member => {
        const id = String(member.id);
        const selected = selectedIds.includes(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => toggle(id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              selected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            aria-pressed={selected}
          >
            <span
              className={`inline-flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 ${
                selected
                  ? 'bg-white border-white'
                  : 'border-gray-400'
              }`}
              aria-hidden="true"
            >
              {selected && (
                <svg className="w-3 h-3 text-blue-600" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span>{member.name}</span>
            <span className={`text-xs ${selected ? 'text-blue-200' : 'text-gray-400'}`}>
              {ROLE_LABELS[member.role] ?? member.role}
            </span>
          </button>
        );
      })}
    </div>
  );
}
