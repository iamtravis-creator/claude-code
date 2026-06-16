'use client';
import Select from '@/components/ui/Select';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

interface TaskFiltersProps {
  status: string;
  priority: string;
  onStatus: (v: string) => void;
  onPriority: (v: string) => void;
}

export default function TaskFilters({ status, priority, onStatus, onPriority }: TaskFiltersProps) {
  return (
    <div className="flex gap-3 mb-4">
      <Select value={status} onChange={e => onStatus(e.target.value)} options={STATUS_OPTIONS} className="w-40" />
      <Select value={priority} onChange={e => onPriority(e.target.value)} options={PRIORITY_OPTIONS} className="w-40" />
    </div>
  );
}
