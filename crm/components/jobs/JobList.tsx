'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { JobWithRefs, JobStatus } from '@/lib/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface JobListProps {
  jobs: JobWithRefs[];
  onEdit: (job: JobWithRefs) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const ALL_STATUSES: JobStatus[] = [
  'scheduled',
  'confirmed',
  'en_route',
  'in_progress',
  'completed',
  'cancelled',
  'invoiced',
];

const STATUS_LABELS: Record<JobStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  en_route: 'En Route',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  invoiced: 'Invoiced',
};

const TERMINAL_STATUSES: JobStatus[] = ['completed', 'cancelled', 'invoiced'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function buildTimeRange(job: JobWithRefs): string {
  const start = formatTime(job.start_time);
  const end = formatTime(job.end_time);
  if (start && end) return `${start}–${end}`;
  return start;
}

function isOverdue(job: JobWithRefs): boolean {
  if (TERMINAL_STATUSES.includes(job.status)) return false;
  const today = new Date().toISOString().slice(0, 10);
  return job.scheduled_date < today;
}

function formatDate(dateStr: string): string {
  // Parse as local date to avoid timezone shift
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Status dropdown ───────────────────────────────────────────────────────────

interface StatusDropdownProps {
  currentStatus: JobStatus;
  jobId: string;
  onStatusChange: (id: string, status: JobStatus) => void;
}

function StatusDropdown({ currentStatus, jobId, onStatusChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        Status
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {open && (
        <>
          {/* Backdrop to close */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white shadow-lg py-1 text-sm"
          >
            {ALL_STATUSES.map(status => (
              <li key={status}>
                <button
                  type="button"
                  role="option"
                  aria-selected={status === currentStatus}
                  onClick={() => {
                    setOpen(false);
                    if (status !== currentStatus) onStatusChange(jobId, status);
                  }}
                  className={`w-full text-left px-3 py-1.5 transition-colors ${
                    status === currentStatus
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────

interface DeleteButtonProps {
  jobId: string;
  onDelete: (id: string) => void;
}

function DeleteButton({ jobId, onDelete }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={() => { onDelete(jobId); setConfirming(false); }}
          className="text-xs font-medium text-red-600 hover:text-red-800 underline"
        >
          Confirm
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      Delete
    </Button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JobList({ jobs, onEdit, onDelete, onStatusChange }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-sm">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Time
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Client
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Property
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Service
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Crew
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {jobs.map(job => {
            const overdue = isOverdue(job);
            const timeRange = buildTimeRange(job);
            const crewNames = job.crew?.map(c => c.name).join(', ') ?? '—';

            return (
              <tr
                key={job.id}
                className={`hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50/40' : ''}`}
              >
                {/* Date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-gray-900">
                      {formatDate(job.scheduled_date)}
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 w-fit">
                        Overdue
                      </span>
                    )}
                  </div>
                </td>

                {/* Time */}
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {timeRange || <span className="text-gray-300">—</span>}
                </td>

                {/* Client */}
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">
                    {job.contact_name ?? <span className="text-gray-300">—</span>}
                  </span>
                </td>

                {/* Property */}
                <td className="px-4 py-3 max-w-[180px]">
                  <span
                    className="text-gray-600 truncate block"
                    title={job.property_address ?? undefined}
                  >
                    {job.property_address ?? <span className="text-gray-300">—</span>}
                  </span>
                </td>

                {/* Service */}
                <td className="px-4 py-3">
                  <span className="text-gray-700">
                    {job.service_name ?? <span className="text-gray-300">—</span>}
                  </span>
                </td>

                {/* Crew */}
                <td className="px-4 py-3 max-w-[160px]">
                  <span
                    className="text-gray-600 text-xs truncate block"
                    title={crewNames !== '—' ? crewNames : undefined}
                  >
                    {crewNames}
                  </span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  {job.price != null ? (
                    <span className="font-semibold text-green-700">
                      ${Number(job.price).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge value={job.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 flex-wrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(job)}
                    >
                      Edit
                    </Button>
                    <StatusDropdown
                      currentStatus={job.status}
                      jobId={job.id}
                      onStatusChange={onStatusChange}
                    />
                    <DeleteButton jobId={job.id} onDelete={onDelete} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
