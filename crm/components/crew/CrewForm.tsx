'use client';
import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { CrewMember } from '@/lib/types';

const ROLE_OPTIONS = [
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'team_lead', label: 'Team Lead' },
  { value: 'supervisor', label: 'Supervisor' },
];

const PAY_TYPE_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'per_job', label: 'Per Job' },
  { value: 'salary', label: 'Salary' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_leave', label: 'On Leave' },
];

interface CrewFormProps {
  initialData?: Partial<CrewMember>;
  onSuccess: (member: CrewMember) => void;
  onCancel: () => void;
}

export default function CrewForm({ initialData, onSuccess, onCancel }: CrewFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    role: initialData?.role ?? 'cleaner',
    pay_rate: initialData?.pay_rate != null ? String(initialData.pay_rate) : '',
    pay_type: initialData?.pay_type ?? 'hourly',
    status: initialData?.status ?? 'active',
    notes: initialData?.notes ?? '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      pay_rate: form.pay_rate !== '' ? parseFloat(form.pay_rate) : null,
    };

    const url = initialData?.id ? `/api/crew/${initialData.id}` : '/api/crew';
    const method = initialData?.id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error ?? 'Something went wrong.');
      return;
    }

    onSuccess(json.data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        label="Name *"
        id="name"
        value={form.name}
        onChange={e => set('name', e.target.value)}
        placeholder="Full name"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          id="email"
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          placeholder="crew@example.com"
        />
        <Input
          label="Phone"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="(555) 000-0000"
        />
      </div>

      <Select
        label="Role"
        id="role"
        value={form.role}
        onChange={e => set('role', e.target.value)}
        options={ROLE_OPTIONS}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Pay Rate"
          id="pay_rate"
          type="number"
          min="0"
          step="0.01"
          value={form.pay_rate}
          onChange={e => set('pay_rate', e.target.value)}
          placeholder="0.00"
        />
        <Select
          label="Pay Type"
          id="pay_type"
          value={form.pay_type}
          onChange={e => set('pay_type', e.target.value)}
          options={PAY_TYPE_OPTIONS}
        />
      </div>

      <Select
        label="Status"
        id="status"
        value={form.status}
        onChange={e => set('status', e.target.value)}
        options={STATUS_OPTIONS}
      />

      <Textarea
        label="Notes"
        id="notes"
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
        placeholder="Additional notes about this crew member…"
        rows={3}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : initialData?.id ? 'Update' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
}
