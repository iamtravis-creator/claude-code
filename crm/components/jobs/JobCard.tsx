'use client';
import { JobWithRefs, JobStatus } from '@/lib/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface JobCardProps {
  job: JobWithRefs;
  onClick: (job: JobWithRefs) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<JobStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  confirmed: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  en_route: 'bg-orange-100 text-orange-700 border-orange-200',
  in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  invoiced: 'bg-purple-100 text-purple-700 border-purple-200',
};

const STATUS_LEFT_BORDER: Record<JobStatus, string> = {
  scheduled: 'border-l-blue-400',
  confirmed: 'border-l-indigo-400',
  en_route: 'border-l-orange-400',
  in_progress: 'border-l-yellow-400',
  completed: 'border-l-green-400',
  cancelled: 'border-l-red-400',
  invoiced: 'border-l-purple-400',
};

const STATUS_LABELS: Record<JobStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  en_route: 'En Route',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  invoiced: 'Invoiced',
};

// Next logical status for the quick-action button
const NEXT_STATUS: Partial<Record<JobStatus, JobStatus>> = {
  scheduled: 'confirmed',
  confirmed: 'en_route',
  en_route: 'in_progress',
  in_progress: 'completed',
  completed: 'invoiced',
};

const NEXT_STATUS_LABEL: Partial<Record<JobStatus, string>> = {
  scheduled: 'Confirm',
  confirmed: 'En Route',
  en_route: 'Start Job',
  in_progress: 'Complete',
  completed: 'Invoice',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  // Handle "HH:MM" or "HH:MM:SS"
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function buildTimeRange(job: JobWithRefs): string {
  const start = formatTime(job.start_time);
  const end = formatTime(job.end_time);
  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  return '';
}

function truncate(str: string | undefined | null, max: number): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function JobCard({ job, onClick, onStatusChange }: JobCardProps) {
  const timeRange = buildTimeRange(job);
  const nextStatus = NEXT_STATUS[job.status];
  const nextLabel = NEXT_STATUS_LABEL[job.status];

  const badgeClass = STATUS_COLORS[job.status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  const borderClass = STATUS_LEFT_BORDER[job.status] ?? 'border-l-gray-300';

  const crewNames = job.crew?.map(c => c.name).join(', ') ?? '';

  return (
    <div
      onClick={() => onClick(job)}
      className={`group relative bg-white rounded-lg border border-gray-200 border-l-4 ${borderClass} p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
    >
      {/* Header row: time + status badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-xs font-semibold text-gray-500 tabular-nums whitespace-nowrap">
          {timeRange || 'No time set'}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${badgeClass}`}>
          {STATUS_LABELS[job.status]}
        </span>
      </div>

      {/* Client name */}
      {job.contact_name && (
        <p className="text-sm font-semibold text-gray-900 leading-tight mb-0.5 truncate">
          {job.contact_name}
        </p>
      )}

      {/* Property address */}
      {job.property_address && (
        <p className="text-xs text-gray-500 truncate mb-1">
          {truncate(job.property_address, 48)}
        </p>
      )}

      {/* Service + price row */}
      <div className="flex items-center justify-between gap-2 mt-1.5">
        {job.service_name && (
          <span className="text-xs text-gray-600 truncate">{job.service_name}</span>
        )}
        {job.price != null && (
          <span className="text-xs font-semibold text-green-700 whitespace-nowrap">
            ${Number(job.price).toFixed(2)}
          </span>
        )}
      </div>

      {/* Crew */}
      {crewNames && (
        <p className="text-xs text-blue-600 mt-1 truncate" title={crewNames}>
          {truncate(crewNames, 44)}
        </p>
      )}

      {/* Quick status action */}
      {nextStatus && nextLabel && (
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onStatusChange(job.id, nextStatus);
          }}
          className="mt-2 w-full text-xs font-medium py-1 px-2 rounded border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label={`Mark as ${nextLabel}`}
        >
          {nextLabel} →
        </button>
      )}
    </div>
  );
}
