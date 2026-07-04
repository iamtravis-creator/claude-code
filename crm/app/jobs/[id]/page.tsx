'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import JobForm from '@/components/jobs/JobForm';
import { JobWithRefs, InvoiceWithRefs, JobStatus, Job } from '@/lib/types';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LEFT_BORDER: Record<JobStatus, string> = {
  scheduled: 'border-l-blue-400',
  confirmed: 'border-l-indigo-400',
  en_route: 'border-l-orange-400',
  in_progress: 'border-l-yellow-400',
  completed: 'border-l-green-400',
  cancelled: 'border-l-red-400',
  invoiced: 'border-l-purple-400',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  // Parse as local date to avoid timezone shift
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

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
  if (start && end) return `${start} – ${end}`;
  return start;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
      <h2 className="text-base font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  );
}

interface TimelineEventProps {
  label: string;
  time: string;
  isLast?: boolean;
}

function TimelineEvent({ label, time, isLast = false }: TimelineEventProps) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" />
        {!isLast && <div className="w-px flex-1 bg-gray-200 mt-1" />}
      </div>
      <div className="pb-4">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [job, setJob] = useState<JobWithRefs | null>(null);
  const [invoice, setInvoice] = useState<InvoiceWithRefs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editModal, setEditModal] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Job not found.');
        throw new Error('Failed to load job.');
      }
      const json = await res.json();
      const jobData: JobWithRefs = json.data;
      setJob(jobData);

      // Find any invoice linked to this job (invoices.job_id -> this job's id).
      // The invoices API filters by contact_id; we fetch all for this contact
      // and find the one whose job_id matches.
      if (jobData.contact_id) {
        const invRes = await fetch(`/api/invoices?contact_id=${jobData.contact_id}`);
        if (invRes.ok) {
          const invJson = await invRes.json();
          const all = (invJson.data ?? []) as InvoiceWithRefs[];
          const linked = all.find(inv => String(inv.job_id) === String(id)) ?? null;
          setInvoice(linked);
        }
      } else {
        setInvoice(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  async function handleMarkComplete() {
    if (!job) return;
    setMarkingComplete(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
      if (!res.ok) throw new Error('Failed to update job status.');
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to mark complete.');
    } finally {
      setMarkingComplete(false);
    }
  }

  async function handleGenerateInvoice() {
    if (!job) return;
    setGeneratingInvoice(true);
    setActionError(null);
    try {
      const res = await fetch('/api/invoices/from-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to generate invoice.');
      await load();
      // Navigate to invoice detail if available
      if (json.data?.id) {
        router.push(`/invoices/${json.data.id}`);
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to generate invoice.');
    } finally {
      setGeneratingInvoice(false);
    }
  }

  function handleEditSuccess(_updated: Job) {
    setEditModal(false);
    load();
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        <p className="text-sm">Loading job…</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          &larr; Jobs
        </Link>
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error ?? 'Job not found.'}
        </div>
      </div>
    );
  }

  const timeRange = buildTimeRange(job);
  const borderClass = STATUS_LEFT_BORDER[job.status] ?? 'border-l-gray-300';
  const crewMembers = job.crew ?? [];
  const canComplete = !['completed', 'cancelled', 'invoiced'].includes(job.status);
  const canInvoice = job.status !== 'invoiced' && !invoice;

  // Timeline events derived from available data
  const timelineEvents: { label: string; time: string }[] = [];
  timelineEvents.push({ label: 'Job created', time: formatDateTime(job.created_at) });
  if (job.status !== 'scheduled') {
    timelineEvents.push({ label: `Status: ${job.status.replace(/_/g, ' ')}`, time: formatDateTime(job.updated_at) });
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
          &larr; Jobs
        </Link>
      </div>

      {/* Hero card */}
      <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${borderClass} p-6 mb-4`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{job.title}</h1>
            {job.contact_name && (
              <p className="text-gray-500 mt-1 text-sm">{job.contact_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge value={job.status} />
            <Button variant="secondary" size="sm" onClick={() => setEditModal(true)}>
              Edit
            </Button>
            {canComplete && (
              <Button
                variant="secondary"
                size="sm"
                disabled={markingComplete}
                onClick={handleMarkComplete}
              >
                {markingComplete ? 'Saving…' : 'Mark Complete'}
              </Button>
            )}
            {canInvoice && (
              <Button
                size="sm"
                disabled={generatingInvoice}
                onClick={handleGenerateInvoice}
              >
                {generatingInvoice ? 'Generating…' : 'Generate Invoice'}
              </Button>
            )}
          </div>
        </div>

        {/* Action error */}
        {actionError && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {actionError}
          </div>
        )}
      </div>

      {/* Job details */}
      <Section title="Job Details">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          <DetailRow label="Scheduled Date" value={formatDate(job.scheduled_date)} />
          {timeRange && <DetailRow label="Time" value={timeRange} />}
          {job.estimated_hours != null && (
            <DetailRow label="Estimated Hours" value={`${job.estimated_hours} hrs`} />
          )}
          {job.actual_hours != null && (
            <DetailRow label="Actual Hours" value={`${job.actual_hours} hrs`} />
          )}
          {job.price != null && (
            <DetailRow label="Price" value={
              <span className="font-semibold text-green-700">${Number(job.price).toFixed(2)}</span>
            } />
          )}
          {job.tip != null && Number(job.tip) > 0 && (
            <DetailRow label="Tip" value={`$${Number(job.tip).toFixed(2)}`} />
          )}
          {job.service_name && <DetailRow label="Service" value={job.service_name} />}
          {job.property_address && <DetailRow label="Property" value={job.property_address} />}
          {job.recurring_schedule_id && (
            <DetailRow label="Recurring" value={
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                Yes
              </span>
            } />
          )}
        </dl>
      </Section>

      {/* Crew */}
      <Section title={`Assigned Crew (${crewMembers.length})`}>
        {crewMembers.length === 0 ? (
          <p className="text-sm text-gray-400">No crew assigned.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {crewMembers.map(member => (
              <li key={member.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  {member.phone && (
                    <p className="text-xs text-gray-400 mt-0.5">{member.phone}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={member.role} />
                  <Badge value={member.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Notes */}
      {(job.notes || job.completion_notes) && (
        <Section title="Notes">
          <div className="space-y-4">
            {job.notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Client Notes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}
            {job.completion_notes && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Completion Notes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.completion_notes}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Linked invoice */}
      <Section title="Invoice">
        {invoice ? (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">{invoice.invoice_number}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Issued {invoice.issue_date}
                {invoice.due_date ? ` · Due ${invoice.due_date}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-green-700">
                ${Number(invoice.total).toFixed(2)}
              </span>
              <Badge value={invoice.status} />
              <Link
                href={`/invoices/${invoice.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                View Invoice
              </Link>
            </div>
          </div>
        ) : job.status === 'invoiced' ? (
          <p className="text-sm text-gray-400">Invoice linked externally or not yet loaded.</p>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-gray-400">No invoice generated yet.</p>
            {canInvoice && (
              <Button
                size="sm"
                disabled={generatingInvoice}
                onClick={handleGenerateInvoice}
              >
                {generatingInvoice ? 'Generating…' : 'Generate Invoice'}
              </Button>
            )}
          </div>
        )}
      </Section>

      {/* Timeline */}
      <Section title="History">
        <div className="pl-1">
          {timelineEvents.map((ev, i) => (
            <TimelineEvent
              key={i}
              label={ev.label}
              time={ev.time}
              isLast={i === timelineEvents.length - 1}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Last updated {formatDateTime(job.updated_at)}
        </div>
      </Section>

      {/* Edit modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Job">
        <JobForm
          initialData={{
            ...job,
            crew_ids: crewMembers.map(c => String(c.id)),
          }}
          onSuccess={handleEditSuccess}
          onCancel={() => setEditModal(false)}
        />
      </Modal>
    </div>
  );
}
