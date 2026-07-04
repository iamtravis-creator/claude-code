'use client';
import { useState, useEffect, useCallback } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import JobList from '@/components/jobs/JobList';
import JobCalendar from '@/components/jobs/JobCalendar';
import JobForm from '@/components/jobs/JobForm';
import { JobWithRefs, JobStatus, Job } from '@/lib/types';

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'list' | 'calendar';

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'en_route', label: 'En Route' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'invoiced', label: 'Invoiced' },
];

// ── Main component ────────────────────────────────────────────────────────────

export default function JobsPage() {
  // ── View & filter state ─────────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // ── Data state ──────────────────────────────────────────────────────────────
  const [jobs, setJobs] = useState<JobWithRefs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [newJobModal, setNewJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobWithRefs | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);
      const res = await fetch(`/api/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load jobs');
      const json = await res.json();
      setJobs(json.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, dateFrom, dateTo]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // ── Handlers ──────────────────────────────────────────────────────────────────

  function handleJobClick(job: JobWithRefs) {
    setEditingJob(job);
  }

  function handleFormSuccess(_job: Job) {
    setNewJobModal(false);
    setEditingJob(null);
    fetchJobs();
  }

  async function handleStatusChange(id: string, status: JobStatus) {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchJobs();
    } catch {
      // silently refresh to keep UI consistent
      fetchJobs();
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      fetchJobs();
    } catch {
      fetchJobs();
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl">
      <PageHeader
        title="Jobs"
        action={
          <Button onClick={() => setNewJobModal(true)}>
            + New Job
          </Button>
        }
      />

      {/* Toolbar: view toggle + filters */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        {/* View toggle */}
        <div className="inline-flex rounded-md border border-gray-300 bg-white overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              view === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            List View
          </button>
          <button
            type="button"
            onClick={() => setView('calendar')}
            className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
              view === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Calendar View
          </button>
        </div>

        {/* Status filter */}
        <div className="w-44">
          <Select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>

        {/* Date range */}
        <div className="flex items-end gap-2">
          <Input
            id="date-from"
            type="date"
            label="From"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
          />
          <Input
            id="date-to"
            type="date"
            label="To"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
          />
        </div>

        {/* Clear filters */}
        {(statusFilter || dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStatusFilter(''); setDateFrom(''); setDateTo(''); }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <p className="text-sm">Loading jobs…</p>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : view === 'list' ? (
        <JobList
          jobs={jobs}
          onEdit={handleJobClick}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <JobCalendar
          jobs={jobs}
          onJobClick={handleJobClick}
          onRefresh={fetchJobs}
        />
      )}

      {/* New Job modal */}
      <Modal
        isOpen={newJobModal}
        onClose={() => setNewJobModal(false)}
        title="New Job"
      >
        <JobForm
          onSuccess={handleFormSuccess}
          onCancel={() => setNewJobModal(false)}
        />
      </Modal>

      {/* Edit Job modal */}
      {editingJob && (
        <Modal
          isOpen
          onClose={() => setEditingJob(null)}
          title={editingJob.title}
        >
          <JobForm
            initialData={{
              ...editingJob,
              crew_ids: editingJob.crew?.map(c => String(c.id)) ?? [],
            }}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingJob(null)}
          />
        </Modal>
      )}
    </div>
  );
}
