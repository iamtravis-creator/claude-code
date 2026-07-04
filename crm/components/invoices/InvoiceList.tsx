'use client';
import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { InvoiceWithRefs, InvoiceStatus, Job } from '@/lib/types';
import InvoiceForm from './InvoiceForm';
import { Invoice } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | InvoiceStatus;

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function isOverdue(inv: InvoiceWithRefs): boolean {
  if (inv.status === 'paid' || inv.status === 'cancelled') return false;
  if (!inv.due_date) return false;
  return new Date(inv.due_date) < new Date();
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<InvoiceWithRefs[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [newOpen, setNewOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<InvoiceWithRefs | null>(null);
  const [fromJobOpen, setFromJobOpen] = useState(false);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [generatingFromJob, setGeneratingFromJob] = useState(false);
  const [fromJobError, setFromJobError] = useState<string | null>(null);

  // ── Fetch invoices ──────────────────────────────────────────────────────────
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('status', activeTab);
      const res = await fetch(`/api/invoices?${params}`);
      const json = await res.json();
      setInvoices(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  // ── Load completed jobs for "Generate from Job" ─────────────────────────────
  function openFromJobModal() {
    setFromJobOpen(true);
    setSelectedJobId('');
    setFromJobError(null);
    setLoadingJobs(true);
    fetch('/api/jobs?status=completed')
      .then(r => r.json())
      .then(json => setCompletedJobs(json.data ?? []))
      .finally(() => setLoadingJobs(false));
  }

  async function handleGenerateFromJob() {
    if (!selectedJobId) {
      setFromJobError('Please select a job.');
      return;
    }
    setGeneratingFromJob(true);
    setFromJobError(null);
    try {
      const res = await fetch('/api/invoices/from-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: Number(selectedJobId) }),
      });
      const json = await res.json();
      if (!res.ok) {
        setFromJobError(json.error ?? 'Failed to generate invoice.');
      } else {
        setFromJobOpen(false);
        fetchInvoices();
      }
    } catch {
      setFromJobError('Network error. Please try again.');
    } finally {
      setGeneratingFromJob(false);
    }
  }

  // ── After form success ──────────────────────────────────────────────────────
  function handleSuccess() {
    setNewOpen(false);
    setEditTarget(null);
    fetchInvoices();
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(inv: InvoiceWithRefs) {
    if (!confirm(`Delete invoice ${inv.invoice_number}? This cannot be undone.`)) return;
    await fetch(`/api/invoices/${inv.id}`, { method: 'DELETE' });
    fetchInvoices();
  }

  // ── Filtered data ───────────────────────────────────────────────────────────
  const filtered = activeTab === 'all'
    ? invoices
    : activeTab === 'overdue'
    ? invoices.filter(isOverdue)
    : invoices.filter(inv => inv.status === activeTab);

  const jobOptions = [
    { value: '', label: loadingJobs ? 'Loading…' : completedJobs.length === 0 ? 'No completed jobs found' : 'Select a completed job…' },
    ...completedJobs.map(j => ({
      value: String(j.id),
      label: `${j.title} — ${fmtDate(j.scheduled_date)}`,
    })),
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={openFromJobModal}>
            Generate from Job
          </Button>
          <Button size="sm" onClick={() => setNewOpen(true)}>
            New Invoice
          </Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-0.5 border-b border-gray-200 mb-4">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Loading invoices…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500">No invoices found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Job</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Issue Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Due Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(inv => {
                const overdue = isOverdue(inv);
                return (
                  <tr
                    key={inv.id}
                    className={overdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {inv.invoice_number}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {inv.contact_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap max-w-[160px] truncate">
                      {inv.job_title ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {fmtDate(inv.issue_date)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${overdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      {fmtDate(inv.due_date)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      {fmt(inv.total)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <span className={inv.amount_paid && inv.amount_paid > 0 ? 'text-green-700 font-medium' : 'text-gray-400'}>
                        {fmt(inv.amount_paid)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge value={overdue ? 'overdue' : inv.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditTarget(inv)}
                          className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inv)}
                          className="text-xs px-2 py-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* New Invoice Modal */}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="New Invoice">
        <InvoiceForm
          onSuccess={handleSuccess}
          onCancel={() => setNewOpen(false)}
        />
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit ${editTarget?.invoice_number ?? 'Invoice'}`}
      >
        {editTarget && (
          <InvoiceForm
            initialData={editTarget}
            onSuccess={handleSuccess}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Generate from Job Modal */}
      <Modal isOpen={fromJobOpen} onClose={() => setFromJobOpen(false)} title="Generate Invoice from Job">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a completed job to auto-generate an invoice pre-populated with job details.
          </p>
          <Select
            label="Completed Job"
            id="from_job_id"
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            options={jobOptions}
            disabled={loadingJobs || completedJobs.length === 0}
          />
          {fromJobError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {fromJobError}
            </p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setFromJobOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateFromJob} disabled={generatingFromJob || !selectedJobId}>
              {generatingFromJob ? 'Generating…' : 'Generate Invoice'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
