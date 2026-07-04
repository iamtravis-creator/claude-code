import { JobWithRefs, JobStatus } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface TodayScheduleProps {
  jobs: JobWithRefs[];
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_BORDER: Record<JobStatus, string> = {
  scheduled: 'border-l-blue-400',
  confirmed: 'border-l-indigo-400',
  en_route: 'border-l-orange-400',
  in_progress: 'border-l-yellow-400',
  completed: 'border-l-green-400',
  cancelled: 'border-l-red-300',
  invoiced: 'border-l-purple-400',
};

const STATUS_BADGE: Record<JobStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  en_route: 'bg-orange-100 text-orange-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-500',
  invoiced: 'bg-purple-100 text-purple-700',
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

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

function sortByTime(jobs: JobWithRefs[]): JobWithRefs[] {
  return [...jobs].sort((a, b) => {
    const ta = a.scheduled_time ?? '99:99';
    const tb = b.scheduled_time ?? '99:99';
    return ta.localeCompare(tb);
  });
}

// ── Component ────────────────────────────────────────────────────────────────

export default function TodaySchedule({ jobs }: TodayScheduleProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
        No jobs scheduled for today 🎉
      </div>
    );
  }

  const sorted = sortByTime(jobs);

  return (
    <div className="space-y-2">
      {sorted.map((job) => {
        const borderClass = STATUS_BORDER[job.status] ?? 'border-l-gray-300';
        const badgeClass = STATUS_BADGE[job.status] ?? 'bg-gray-100 text-gray-600';
        const statusLabel = STATUS_LABELS[job.status] ?? job.status;
        const crewNames = job.crew?.map((c) => c.name).join(', ');
        const timeLabel = formatTime(job.scheduled_time);

        return (
          <div
            key={job.id}
            className={`flex items-start gap-4 bg-white rounded-lg border border-gray-200 border-l-4 ${borderClass} px-4 py-3 shadow-sm`}
          >
            {/* Time pill */}
            <div className="shrink-0 pt-0.5">
              {timeLabel ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold tabular-nums whitespace-nowrap">
                  {timeLabel}
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 text-gray-400 text-xs font-medium whitespace-nowrap">
                  No time
                </span>
              )}
            </div>

            {/* Main details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {job.contact_name ?? 'Unknown Client'}
                  </p>
                  {job.property_address && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {job.property_address}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {job.price != null && (
                    <span className="text-sm font-semibold text-green-700 tabular-nums">
                      {formatCurrency(job.price)}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {job.service_name && (
                  <span className="text-xs text-gray-600">{job.service_name}</span>
                )}
                {crewNames && (
                  <span className="text-xs text-blue-600 truncate" title={crewNames}>
                    {crewNames}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
