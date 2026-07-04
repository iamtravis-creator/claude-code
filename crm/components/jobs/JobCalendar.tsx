'use client';
import { useState, useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import JobCard from '@/components/jobs/JobCard';
import JobForm from '@/components/jobs/JobForm';
import { JobWithRefs, Job, JobStatus } from '@/lib/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface JobCalendarProps {
  jobs: JobWithRefs[];
  onJobClick: (job: JobWithRefs) => void;
  onRefresh: () => void;
}

// ── Status color for calendar blocks ─────────────────────────────────────────

const BLOCK_COLORS: Record<JobStatus, string> = {
  scheduled: 'bg-blue-50 border-blue-300 hover:bg-blue-100',
  confirmed: 'bg-indigo-50 border-indigo-300 hover:bg-indigo-100',
  en_route: 'bg-orange-50 border-orange-300 hover:bg-orange-100',
  in_progress: 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100',
  completed: 'bg-green-50 border-green-300 hover:bg-green-100',
  cancelled: 'bg-red-50 border-red-300 hover:bg-red-100',
  invoiced: 'bg-purple-50 border-purple-300 hover:bg-purple-100',
};

const BLOCK_TEXT_COLORS: Record<JobStatus, string> = {
  scheduled: 'text-blue-800',
  confirmed: 'text-indigo-800',
  en_route: 'text-orange-800',
  in_progress: 'text-yellow-800',
  completed: 'text-green-800',
  cancelled: 'text-red-800',
  invoiced: 'text-purple-800',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Return the Monday of the week containing `date`. */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift so Mon=0
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Return array of 7 Date objects for Mon–Sun of the week. */
function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatTime(time: string | null | undefined): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDateRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDayHeader(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(d: Date): boolean {
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

// ── Job block ────────────────────────────────────────────────────────────────

interface JobBlockProps {
  job: JobWithRefs;
  onClick: () => void;
}

function JobBlock({ job, onClick }: JobBlockProps) {
  const colors = BLOCK_COLORS[job.status] ?? 'bg-gray-50 border-gray-300 hover:bg-gray-100';
  const textColors = BLOCK_TEXT_COLORS[job.status] ?? 'text-gray-800';
  const crewCount = job.crew?.length ?? 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded border px-2 py-1.5 mb-1 transition-colors cursor-pointer ${colors}`}
    >
      <p className={`text-xs font-semibold leading-tight truncate ${textColors}`}>
        {formatTime(job.scheduled_time) || job.scheduled_date}
      </p>
      <p className={`text-xs leading-tight truncate font-medium ${textColors}`}>
        {job.contact_name ?? 'Unknown client'}
      </p>
      {job.service_name && (
        <p className="text-xs text-gray-500 leading-tight truncate">{job.service_name}</p>
      )}
      {crewCount > 0 && (
        <p className="text-xs text-gray-400 leading-tight">
          {crewCount} crew
        </p>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JobCalendar({ jobs, onJobClick, onRefresh }: JobCalendarProps) {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));
  const [selectedJob, setSelectedJob] = useState<JobWithRefs | null>(null);
  const [editingJob, setEditingJob] = useState<JobWithRefs | null>(null);
  const [addDate, setAddDate] = useState<string | null>(null);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const weekEnd = weekDays[6];

  // Group jobs by ISO date
  const jobsByDate = useMemo(() => {
    const map: Record<string, JobWithRefs[]> = {};
    for (const job of jobs) {
      const key = job.scheduled_date;
      if (!map[key]) map[key] = [];
      map[key].push(job);
    }
    // Sort each day by start time
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => {
        const ta = a.scheduled_time ?? '99:99';
        const tb = b.scheduled_time ?? '99:99';
        return ta.localeCompare(tb);
      });
    }
    return map;
  }, [jobs]);

  // ── Navigation ───────────────────────────────────────────────────────────
  function prevWeek() {
    setWeekStart(d => {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      return next;
    });
  }
  function nextWeek() {
    setWeekStart(d => {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      return next;
    });
  }
  function goToday() {
    setWeekStart(getWeekStart(new Date()));
  }

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleJobBlockClick(job: JobWithRefs) {
    setSelectedJob(job);
  }

  function handleStatusChange(id: string, status: JobStatus) {
    fetch(`/api/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(() => onRefresh());
  }

  function handleFormSuccess(_job: Job) {
    setAddDate(null);
    setEditingJob(null);
    setSelectedJob(null);
    onRefresh();
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevWeek}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Previous week"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goToday}
            className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextWeek}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Next week"
          >
            ›
          </button>
        </div>
        <h3 className="text-sm font-semibold text-gray-700">
          Week of {formatDateRange(weekStart, weekEnd)}
        </h3>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200">
        {weekDays.map((day, i) => {
          const iso = toISODate(day);
          const dayJobs = jobsByDate[iso] ?? [];
          const today = isToday(day);

          return (
            <div key={iso} className="bg-white flex flex-col min-h-[160px]">
              {/* Day header */}
              <div
                className={`px-2 pt-2 pb-1 text-center border-b border-gray-100 ${
                  today ? 'bg-blue-50' : ''
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${today ? 'text-blue-600' : 'text-gray-500'}`}>
                  {DAY_NAMES[i]}
                </p>
                <p className={`text-sm font-bold leading-none ${today ? 'text-blue-700' : 'text-gray-800'}`}>
                  {day.getDate()}
                </p>
                <p className={`text-xs ${today ? 'text-blue-400' : 'text-gray-400'}`}>
                  {formatDayHeader(day)}
                </p>
              </div>

              {/* Job blocks */}
              <div className="flex-1 p-1.5 overflow-y-auto max-h-64">
                {dayJobs.map(job => (
                  <JobBlock
                    key={job.id}
                    job={job}
                    onClick={() => handleJobBlockClick(job)}
                  />
                ))}

                {/* Add job button */}
                <button
                  type="button"
                  onClick={() => setAddDate(iso)}
                  className="w-full mt-1 flex items-center justify-center py-1 rounded text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors text-lg leading-none"
                  aria-label={`Add job for ${iso}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View/edit job modal */}
      {selectedJob && !editingJob && (
        <Modal
          isOpen
          onClose={() => setSelectedJob(null)}
          title={selectedJob.title}
        >
          <JobCard
            job={selectedJob}
            onClick={() => {
              setEditingJob(selectedJob);
            }}
            onStatusChange={(id, status) => {
              handleStatusChange(id, status);
              setSelectedJob(null);
            }}
          />
          <div className="flex justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => setEditingJob(selectedJob)}
              className="px-4 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Edit Job
            </button>
          </div>
        </Modal>
      )}

      {/* Edit job modal */}
      {editingJob && (
        <Modal
          isOpen
          onClose={() => { setEditingJob(null); setSelectedJob(null); }}
          title="Edit Job"
        >
          <JobForm
            initialData={editingJob}
            onSuccess={handleFormSuccess}
            onCancel={() => { setEditingJob(null); setSelectedJob(null); }}
          />
        </Modal>
      )}

      {/* Add job modal */}
      {addDate && (
        <Modal
          isOpen
          onClose={() => setAddDate(null)}
          title={`New Job — ${addDate}`}
        >
          <JobForm
            initialData={{ scheduled_date: addDate }}
            onSuccess={handleFormSuccess}
            onCancel={() => setAddDate(null)}
          />
        </Modal>
      )}
    </div>
  );
}
