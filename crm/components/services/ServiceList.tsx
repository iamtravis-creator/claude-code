'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ServiceForm from './ServiceForm';
import { CleaningService, ServiceCategory } from '@/lib/types';

type FilterTab = 'all' | ServiceCategory;

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'specialty', label: 'Specialty' },
];

export default function ServiceList() {
  const [services, setServices] = useState<CleaningService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CleaningService | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: CleaningService[] = Array.isArray(data)
        ? data
        : (data as { services: CleaningService[] }).services ?? [];
      setServices(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const filtered = activeTab === 'all'
    ? services
    : services.filter(s => s.category === activeTab);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(s: CleaningService) {
    setEditing(s);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSuccess(saved: CleaningService) {
    closeModal();
    fetchServices();
    void saved;
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteConfirm(null);
      fetchServices();
    } catch {
      // silently leave confirm open
    } finally {
      setDeleting(false);
    }
  }

  function formatPrice(val: number | null) {
    if (val == null) return '—';
    return `$${val.toFixed(2)}`;
  }

  function formatHours(val: number | null | undefined) {
    if (val == null) return '—';
    return `${val}h`;
  }

  const categoryCounts = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Services</h2>
        <Button onClick={openNew} size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Service
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => {
          const count = tab.value === 'all' ? services.length : (categoryCounts[tab.value] ?? 0);
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5
                ${isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.label}
              {!loading && (
                <span className={`
                  inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium min-w-[1.25rem]
                  ${isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-12 text-sm text-gray-500">Loading services...</div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}{' '}
          <button onClick={fetchServices} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <svg className="mx-auto w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm text-gray-500">
            {activeTab === 'all' ? 'No services yet' : `No ${activeTab} services`}
          </p>
          <Button onClick={openNew} size="sm" variant="secondary" className="mt-3">
            Add Service
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Base Price</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Per Sq Ft</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Est. Hours</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{s.name}</div>
                    {s.description && (
                      <div className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-xs">
                        {s.description}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`
                      inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                      ${s.category === 'residential' ? 'bg-blue-100 text-blue-700'
                        : s.category === 'commercial' ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-orange-700'}
                    `}>
                      {s.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {formatPrice(s.base_price)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {s.price_per_sqft != null ? `$${s.price_per_sqft.toFixed(3)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {formatHours(s.estimated_hours)}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(s)}
                        title="Edit service"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      {deleteConfirm === s.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(s.id)}
                            disabled={deleting}
                          >
                            {deleting ? 'Deleting...' : 'Confirm'}
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
                          title="Delete service"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
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
        title={editing ? 'Edit Service' : 'New Service'}
      >
        <ServiceForm
          initialData={editing ?? undefined}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
