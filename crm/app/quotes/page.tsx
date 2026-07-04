'use client';
import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import { QuoteWithRefs, QuoteStatus, Job } from '@/lib/types';
import QuoteForm from '@/components/quotes/QuoteForm';

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | QuoteStatus;

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

function isExpired(quote: QuoteWithRefs): boolean {
  if (quote.status === 'accepted' || quote.status === 'declined' || quote.status === 'expired') return false;
  if (!quote.valid_until) return false;
  return new Date(quote.valid_until) < new Date();
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteWithRefs[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [newOpen, setNewOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<QuoteWithRefs | null>(null);
  const [convertTarget, setConvertTarget] = useState<QuoteWithRefs | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  // ── Fetch quotes ────────────────────────────────────────────────────────────
  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('status', activeTab);
      const res = await fetch(`/api/quotes?${params}`);
      const json = await res.json();
      setQuotes(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  // ── After form success ──────────────────────────────────────────────────────
  function handleSuccess() {
    setNewOpen(false);
    setEditTarget(null);
    fetchQuotes();
  }

  // ── Convert accepted quote to job ───────────────────────────────────────────
  async function handleConvertToJob() {
    if (!convertTarget) return;
    setConverting(true);
    setConvertError(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: convertTarget.contact_id,
          property_id: convertTarget.property_id ?? null,
          service_id: convertTarget.service_id ?? null,
          title: `Job from ${convertTarget.quote_number}`,
          status: 'scheduled',
          scheduled_date: new Date().toISOString().slice(0, 10),
          price: convertTarget.total,
          notes: convertTarget.notes ?? null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setConvertError(json.error ?? 'Failed to create job.');
      } else {
        setConvertTarget(null);
        fetchQuotes();
      }
    } catch {
      setConvertError('Network error. Please try again.');
    } finally {
      setConverting(false);
    }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  async function handleDelete(quote: QuoteWithRefs) {
    if (!confirm(`Delete quote ${quote.quote_number}? This cannot be undone.`)) return;
    await fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' });
    fetchQuotes();
  }

  // ── Filtered data ───────────────────────────────────────────────────────────
  const filtered = activeTab === 'all'
    ? quotes
    : activeTab === 'expired'
    ? quotes.filter(q => q.status === 'expired' || isExpired(q))
    : quotes.filter(q => q.status === activeTab);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-gray-900">Quotes</h2>
        <Button size="sm" onClick={() => setNewOpen(true)}>
          New Quote
        </Button>
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
        <div className="text-center py-12 text-sm text-gray-500">Loading quotes…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-gray-500">No quotes found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Quote #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Client</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Property</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Valid Until</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(quote => {
                const expired = isExpired(quote);
                return (
                  <tr
                    key={quote.id}
                    className={expired ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {quote.quote_number}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {quote.contact_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap max-w-[200px] truncate">
                      {quote.property_address
                        ? [quote.property_address, (quote as QuoteWithRefs & { property_city?: string }).property_city].filter(Boolean).join(', ')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 whitespace-nowrap">
                      {fmt(quote.total)}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap ${expired ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                      {fmtDate(quote.valid_until)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge value={expired && quote.status !== 'expired' ? 'expired' : quote.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        {quote.status === 'accepted' && (
                          <button
                            onClick={() => { setConvertTarget(quote); setConvertError(null); }}
                            className="text-xs px-2 py-1 rounded text-green-600 hover:bg-green-50 transition-colors font-medium"
                          >
                            Convert to Job
                          </button>
                        )}
                        <button
                          onClick={() => setEditTarget(quote)}
                          className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(quote)}
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

      {/* New Quote Modal */}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="New Quote">
        <QuoteForm
          onSuccess={handleSuccess}
          onCancel={() => setNewOpen(false)}
        />
      </Modal>

      {/* Edit Quote Modal */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={`Edit ${editTarget?.quote_number ?? 'Quote'}`}
      >
        {editTarget && (
          <QuoteForm
            initialData={editTarget}
            onSuccess={handleSuccess}
            onCancel={() => setEditTarget(null)}
          />
        )}
      </Modal>

      {/* Convert to Job Modal */}
      <Modal
        isOpen={!!convertTarget}
        onClose={() => setConvertTarget(null)}
        title="Convert Quote to Job"
      >
        {convertTarget && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              This will create a new scheduled job for{' '}
              <span className="font-semibold">{convertTarget.contact_name}</span> based on quote{' '}
              <span className="font-semibold">{convertTarget.quote_number}</span> (total{' '}
              {fmt(convertTarget.total)}).
            </p>
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm space-y-1 text-gray-600">
              {convertTarget.property_address && (
                <p>
                  <span className="font-medium text-gray-700">Property: </span>
                  {convertTarget.property_address}
                </p>
              )}
              {convertTarget.service_name && (
                <p>
                  <span className="font-medium text-gray-700">Service: </span>
                  {convertTarget.service_name}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">Scheduled date: </span>
                today (you can edit after creation)
              </p>
            </div>

            {convertError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {convertError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={() => setConvertTarget(null)}>
                Cancel
              </Button>
              <Button onClick={handleConvertToJob} disabled={converting}>
                {converting ? 'Creating Job…' : 'Create Job'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
