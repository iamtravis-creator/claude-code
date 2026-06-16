'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import PageHeader from '@/components/layout/PageHeader';
import ContactForm from './ContactForm';
import { Contact } from '@/lib/types';

const STATUS_FILTER = [
  { value: '', label: 'All statuses' },
  { value: 'lead', label: 'Lead' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'churned', label: 'Churned' },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [modal, setModal] = useState<{ open: boolean; contact?: Contact }>({ open: false });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    const res = await fetch(`/api/contacts?${params}`);
    const json = await res.json();
    setContacts(json.data);
  }, [search, status]);

  useEffect(() => { load(); }, [load]);

  async function deleteContact(id: string) {
    if (!confirm('Delete this contact?')) return;
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <>
      <PageHeader
        title="Contacts"
        action={<Button onClick={() => setModal({ open: true })}>+ New Contact</Button>}
      />
      <div className="flex gap-3 mb-4">
        <Input
          placeholder="Search name, email, company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select
          value={status}
          onChange={e => setStatus(e.target.value)}
          options={STATUS_FILTER}
          className="w-40"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Name', 'Company', 'Email', 'Status', 'Created', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contacts.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No contacts found</td></tr>
            )}
            {contacts.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/contacts/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{c.company ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600">{c.email ?? '—'}</td>
                <td className="px-4 py-3"><Badge value={c.status} /></td>
                <td className="px-4 py-3 text-gray-500">{fmt(c.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, contact: c })}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteContact(c.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false })}
        title={modal.contact ? 'Edit Contact' : 'New Contact'}
      >
        <ContactForm
          initialData={modal.contact}
          onSuccess={() => { setModal({ open: false }); load(); }}
          onCancel={() => setModal({ open: false })}
        />
      </Modal>
    </>
  );
}
