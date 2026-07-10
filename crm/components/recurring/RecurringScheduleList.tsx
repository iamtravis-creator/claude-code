'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RecurringScheduleForm from './RecurringScheduleForm';
import { RecurringSchedule, RecurringScheduleWithRefs } from '@/lib/types';

const FREQ_LABEL: Record<string, string> = {
  weekly:    'Weekly',
  biweekly:  'Bi-weekly',
  monthly:   'Monthly',
};

const DOW_LABEL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const LOOKAHEAD_OPTIONS = [
  { value: '28',  label: '4 weeks' },
  { value: '56',  label: '8 weeks' },
  { value: '84',  label: '12 weeks' },
  { value: '180', label: '6 months' },
];

interface GenerateResult {
  scheduleId: string;
  created: number;
  message?: string;
}

export default function RecurringScheduleList() {
  const [schedules, setSchedules]       = useState<RecurringScheduleWithRefs[]>([]);
  const [loading,   setLoading]         = useState(true);
  const [error,     setError]           = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing,   setEditing]         = useState<RecurringScheduleWithRefs | null>(null);

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting,      setDeleting]      = useState(false);

  // Generate state per schedule
  const [generating,    setGenerating]  = useState<string | null>(null);   // schedule id being generated
  const [generateResult, setGenerateResult] = useState<GenerateResult | null>(null);
  const [lookahead,     setLookahead]   = useState('56');

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch('/api/recurring');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSchedules(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load schedules.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(s: RecurringScheduleWithRefs) {
    setEditing(s);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSuccess(_saved: RecurringSchedule) {
    closeModal();
    fetchSchedules();
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteConfirm(null);
      fetchSchedules();
    } catch {
      // leave confirm open so user can retry
    } finally {
      setDeleting(false);
    }
  }

  async function handleGenerate(id: string) {
    setGenerating(id);
    setGenerateResult(null);
    try {
      const res  = await fetch(`/api/recurring/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lookahead_days: Number(lookahead) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setGenerateResult({
        scheduleId: id,
        created:    json.data.created,
        message:    json.data.message,
      });
      // Refresh to pick up any next_job_date changes
      fetchSchedules();
    } catch (err) {
      setGenerateResult({
        scheduleId: id,
        created:    -1,
        message:    err instanceof Error ? err.message : 'Generate failed.',
      });
    } finally {
      setGenerating(null);
    }
  }

  function cadenceLabel(s: RecurringScheduleWithRefs) {
    const freq = FREQ_LABEL[s.frequency] ?? s.frequency;
    if (s.frequency === 'weekly' || s.frequency === 'biweekly') {
      const dow = s.day_of_week != null ? DOW_LABEL[s.day_of_week] : '';
      return `${freq}${dow ? ` · ${dow}s` : ''}`;
    }
    if (s.frequency === 'monthly') {
      return `${freq} · Day ${s.day_of_month ?? '—'}`;
    }
    return freq;
  }

  function fmtDate(d?: string | null) {
    if (!d) return '—';
    return new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Recurring Schedules</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Define a cadence, then generate scheduled jobs for the chosen window.
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Schedule
        </Button>
      </div>

      {/* Lookahead selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Generate jobs for the next</span>
        <select
          value={lookahead}
          onChange={e => setLookahead(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {LOOKAHEAD_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">(skips dates that already have a job)</span>
      </div>

      {/* Generate result banner */}
      {generateResult && (
        <div className={`flex items-center justify-between rounded-md px-4 py-3 text-sm border ${
          generateResult.created < 0
            ? 'bg-red-50 border-red-200 text-red-700'
            : generateResult.created === 0
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <span>
            {generateResult.created < 0
              ? generateResult.message
              : generateResult.created === 0
              ? (generateResult.message ?? 'No new jobs needed.')
              : `✓ Created ${generateResult.created} job${generateResult.created !== 1 ? 's' : ''} — view them in the Jobs list.`}
          </span>
          <button
            onClick={() => setGenerateResult(null)}
            className="ml-4 text-current opacity-60 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* States */}
      {loading && (
        <div className="text-center py-12 text-sm text-gray-500">Loading schedules…</div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}{' '}
          <button onClick={fetchSchedules} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && schedules.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <svg className="mx-auto w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500 mb-3">No recurring schedules yet</p>
          <Button onClick={openNew} size="sm" variant="secondary">Create your first schedule</Button>
        </div>
      )}

      {!loading && !error && schedules.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Schedule</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Cadence</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Start</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{s.title}</div>
                    {s.service_name && (
                      <div className="text-xs text-gray-400 mt-0.5">{s.service_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {s.contact_name ?? '—'}
                    {s.property_address && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[180px]">
                        {s.property_address}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{cadenceLabel(s)}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {fmtDate(s.start_date)}
                    {s.end_date && (
                      <div className="text-xs text-gray-400">until {fmtDate(s.end_date)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {s.price != null ? `$${s.price.toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {s.active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Generate button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGenerate(s.id)}
                        disabled={generating === s.id || !s.active}
                        title={!s.active ? 'Activate schedule to generate jobs' : 'Generate jobs for the selected window'}
                        className="text-green-700 border-green-200 hover:bg-green-50"
                      >
                        {generating === s.id ? (
                          <span className="animate-pulse">Generating…</span>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Generate
                          </>
                        )}
                      </Button>

                      {/* Edit button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        title="Edit schedule"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>

                      {/* Delete confirm */}
                      {deleteConfirm === s.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(s.id)}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting…' : 'Confirm'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            disabled={deleting}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirm(s.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Recurring Schedule' : 'New Recurring Schedule'}
      >
        <RecurringScheduleForm
          initialData={editing ?? undefined}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
