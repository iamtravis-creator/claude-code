'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import PropertyForm from './PropertyForm';
import { Property, PropertyWithContact } from '@/lib/types';

interface PropertyListProps {
  contact_id?: string;
}

export default function PropertyList({ contact_id }: PropertyListProps) {
  const [properties, setProperties] = useState<PropertyWithContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PropertyWithContact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = contact_id
        ? `/api/properties?contact_id=${contact_id}`
        : '/api/properties';
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list: PropertyWithContact[] = Array.isArray(data)
        ? data
        : (data as { properties: PropertyWithContact[] }).properties ?? [];
      setProperties(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties.');
    } finally {
      setLoading(false);
    }
  }, [contact_id]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: PropertyWithContact) {
    setEditing(p);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSuccess(saved: Property) {
    closeModal();
    fetchProperties();
    // Suppress unused var warning — saved is available for caller use if needed
    void saved;
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDeleteConfirm(null);
      fetchProperties();
    } catch {
      // leave delete confirm open so user sees it failed silently
    } finally {
      setDeleting(false);
    }
  }

  function formatAddress(p: Property) {
    const parts = [p.address, p.city, p.state].filter(Boolean);
    return parts.join(', ');
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        <Button onClick={openNew} size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Property
        </Button>
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-12 text-sm text-gray-500">Loading properties...</div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}{' '}
          <button onClick={fetchProperties} className="underline font-medium">Retry</button>
        </div>
      )}

      {!loading && !error && properties.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <svg className="mx-auto w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-sm text-gray-500">No properties yet</p>
          <Button onClick={openNew} size="sm" variant="secondary" className="mt-3">
            Add First Property
          </Button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && properties.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Address</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Size</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Beds / Baths</th>
                {!contact_id && (
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                )}
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {p.name ?? <span className="text-gray-400 font-normal italic">Unnamed</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatAddress(p)}</td>
                  <td className="px-4 py-3">
                    <Badge value={p.type} />
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {p.size_sqft != null ? `${p.size_sqft.toLocaleString()} sqft` : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {(p.bedrooms != null || p.bathrooms != null)
                      ? `${p.bedrooms ?? '?'} bd / ${p.bathrooms ?? '?'} ba`
                      : '—'}
                  </td>
                  {!contact_id && (
                    <td className="px-4 py-3 text-gray-600">
                      {p.contact_name ?? <span className="text-gray-400">—</span>}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {p.active ? (
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
                        onClick={() => openEdit(p)}
                        title="Edit property"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(p.id)}
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
                          onClick={() => setDeleteConfirm(p.id)}
                          title="Delete property"
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
        title={editing ? 'Edit Property' : 'New Property'}
      >
        <PropertyForm
          initialData={editing ?? (contact_id ? { contact_id } : undefined)}
          onSuccess={handleSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
