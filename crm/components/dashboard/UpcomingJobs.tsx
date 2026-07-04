import Link from 'next/link';
import { JobWithRefs } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

interface UpcomingJobsProps {
  jobs: JobWithRefs[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  // dateStr is YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

function getUpcomingJobs(jobs: JobWithRefs[]): JobWithRefs[] {
  const today = new Date().toISOString().split('T')[0];
  return [...jobs]
    .filter((j) => j.scheduled_date > today)
    .sort((a, b) => {
      const dateCmp = a.scheduled_date.localeCompare(b.scheduled_date);
      if (dateCmp !== 0) return dateCmp;
      return (a.scheduled_time ?? '99:99').localeCompare(b.scheduled_time ?? '99:99');
    })
    .slice(0, 5);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function UpcomingJobs({ jobs }: UpcomingJobsProps) {
  const upcoming = getUpcomingJobs(jobs);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Upcoming Jobs</h2>
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-gray-400 text-sm">No upcoming jobs scheduled.</p>
      ) : (
        <div className="space-y-0 divide-y divide-gray-100">
          {upcoming.map((job) => {
            const timeLabel = formatTime(job.scheduled_time);
            const priceLabel = formatCurrency(job.price);

            return (
              <div key={job.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                {/* Date block */}
                <div className="shrink-0 text-center w-14">
                  <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide leading-none">
                    {new Date(job.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight tabular-nums">
                    {new Date(job.scheduled_date + 'T00:00:00').getDate()}
                  </p>
                  <p className="text-xs text-gray-400 leading-none">
                    {new Date(job.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.contact_name ?? 'Unknown Client'}
                      </p>
                      {job.service_name && (
                        <p className="text-xs text-gray-500 truncate">{job.service_name}</p>
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      {priceLabel && (
                        <p className="text-sm font-semibold text-green-700 tabular-nums">{priceLabel}</p>
                      )}
                      {timeLabel && (
                        <p className="text-xs text-gray-400 tabular-nums">{timeLabel}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <Link
            href="/jobs"
            className="block text-center text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium"
          >
            See all jobs
          </Link>
        </div>
      )}
    </div>
  );
}
