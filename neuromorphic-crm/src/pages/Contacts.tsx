import { useState } from 'react'
import { Search, Plus, X, Mail, Phone, Building2, Tag } from 'lucide-react'
import { contacts as initialContacts } from '../data/mockData'
import type { Contact, ContactStatus } from '../types'

const STATUS_LABELS: Record<ContactStatus, string> = {
  lead: 'Lead', prospect: 'Prospect', customer: 'Customer', churned: 'Churned'
}

function ContactModal({ contact, onClose, onSave }: {
  contact?: Contact; onClose: () => void; onSave: (c: Contact) => void
}) {
  const [form, setForm] = useState<Partial<Contact>>(contact || {
    name: '', email: '', phone: '', company: '', title: '', status: 'lead',
    tags: [], value: 0, avatar: '', createdAt: new Date().toISOString().slice(0, 10),
    lastActivity: new Date().toISOString().slice(0, 10)
  })

  function set(k: keyof Contact, v: any) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.name || !form.email) return
    const c: Contact = {
      id: contact?.id || `c${Date.now()}`,
      name: form.name!, email: form.email!, phone: form.phone || '',
      company: form.company || '', title: form.title || '',
      status: form.status as ContactStatus || 'lead',
      tags: form.tags || [],
      value: form.value || 0,
      avatar: (form.name!).split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: form.createdAt || new Date().toISOString().slice(0, 10),
      lastActivity: form.lastActivity || new Date().toISOString().slice(0, 10),
    }
    onSave(c)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="modal-title">{contact ? 'Edit Contact' : 'New Contact'}</h2>
          <button className="neu-btn neu-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input className="neu-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Sarah Chen" />
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="neu-input" value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="VP of Engineering" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="neu-input" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} placeholder="sarah@company.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="neu-input" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 555-0100" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Company</label>
            <input className="neu-input" value={form.company || ''} onChange={e => set('company', e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="neu-select" value={form.status || 'lead'} onChange={e => set('status', e.target.value)}>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Deal Value ($)</label>
          <input className="neu-input" type="number" value={form.value || ''} onChange={e => set('value', Number(e.target.value))} placeholder="50000" />
        </div>
        <div className="flex gap-3 justify-between" style={{ marginTop: '0.5rem' }}>
          <button className="neu-btn" onClick={onClose}>Cancel</button>
          <button className="neu-btn neu-btn-primary" onClick={handleSave}>
            {contact ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [modal, setModal] = useState<{ open: boolean; contact?: Contact }>({ open: false })

  const filtered = contacts.filter(c => {
    const matchSearch = !search || [c.name, c.email, c.company].some(v => v.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  function saveContact(c: Contact) {
    setContacts(prev => prev.some(p => p.id === c.id) ? prev.map(p => p.id === c.id ? c : p) : [...prev, c])
    setModal({ open: false })
  }

  function deleteContact(id: string) {
    if (confirm('Delete this contact?')) setContacts(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">{contacts.length} total contacts</p>
        </div>
        <button className="neu-btn neu-btn-primary" onClick={() => setModal({ open: true })}>
          <Plus size={16} /> Add Contact
        </button>
      </div>

      <div className="filters-row">
        <div className="search-bar" style={{ maxWidth: 280 }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
          />
        </div>
        {(['all', 'lead', 'prospect', 'customer', 'churned'] as const).map(s => (
          <button
            key={s}
            className={`neu-btn neu-btn-sm${statusFilter === s ? '' : ''}`}
            style={statusFilter === s ? { boxShadow: 'var(--neu-inset-sm)', color: 'var(--accent)' } : {}}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s as ContactStatus]}
          </button>
        ))}
      </div>

      <div className="neu-card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Company</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Value</th>
                <th>Last Activity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">No contacts found</div>
                </td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md">{c.avatar}</div>
                      <div>
                        <div className="font-semibold text-sm">{c.name}</div>
                        <div className="text-xs text-muted flex items-center gap-1">
                          <Mail size={11} />{c.email}
                        </div>
                        {c.phone && (
                          <div className="text-xs text-muted flex items-center gap-1">
                            <Phone size={11} />{c.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Building2 size={14} color="var(--text-muted)" />
                      <div>
                        <div className="font-medium text-sm">{c.company}</div>
                        <div className="text-xs text-muted">{c.title}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge badge-${c.status}`}>{STATUS_LABELS[c.status]}</span></td>
                  <td>
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.slice(0, 2).map(t => (
                        <span key={t} className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>
                          <Tag size={9} style={{ marginRight: 2 }} />{t}
                        </span>
                      ))}
                      {c.tags.length > 2 && <span className="text-xs text-muted">+{c.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td>
                    <span className="font-semibold text-sm">
                      {c.value > 0 ? `$${(c.value / 1000).toFixed(0)}k` : '—'}
                    </span>
                  </td>
                  <td><span className="text-xs text-muted">{c.lastActivity}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="neu-btn neu-btn-sm" onClick={() => setModal({ open: true, contact: c })}>Edit</button>
                      <button className="neu-btn neu-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => deleteContact(c.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <ContactModal
          contact={modal.contact}
          onClose={() => setModal({ open: false })}
          onSave={saveContact}
        />
      )}
    </div>
  )
}
