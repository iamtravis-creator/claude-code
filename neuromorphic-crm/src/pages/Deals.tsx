import { useState } from 'react'
import { Search, Plus, X, TrendingUp, Calendar, Building2 } from 'lucide-react'
import { deals as initialDeals, contacts } from '../data/mockData'
import type { Deal, DealStage, Priority } from '../types'

const STAGE_LABELS: Record<DealStage, string> = {
  prospecting: 'Prospecting', qualification: 'Qualification', proposal: 'Proposal',
  negotiation: 'Negotiation', 'closed-won': 'Closed Won', 'closed-lost': 'Closed Lost'
}
const PRIORITY_LABELS: Record<Priority, string> = { low: 'Low', medium: 'Medium', high: 'High' }

function DealModal({ deal, onClose, onSave }: {
  deal?: Deal; onClose: () => void; onSave: (d: Deal) => void
}) {
  const [form, setForm] = useState<Partial<Deal>>(deal || {
    title: '', contactId: '', contactName: '', company: '',
    stage: 'prospecting', value: 0, probability: 20, priority: 'medium',
    closeDate: '', notes: '', ownerId: 'u1', createdAt: new Date().toISOString().slice(0, 10)
  })

  function set(k: keyof Deal, v: any) { setForm(f => ({ ...f, [k]: v })) }

  function handleContactChange(id: string) {
    const c = contacts.find(c => c.id === id)
    if (c) set('contactId', id), set('contactName', c.name), set('company', c.company)
    else set('contactId', id)
  }

  function handleSave() {
    if (!form.title || !form.contactId) return
    const d: Deal = {
      id: deal?.id || `d${Date.now()}`,
      title: form.title!, contactId: form.contactId!, contactName: form.contactName || '',
      company: form.company || '', stage: form.stage as DealStage || 'prospecting',
      value: form.value || 0, probability: form.probability || 20,
      priority: form.priority as Priority || 'medium',
      closeDate: form.closeDate || '', notes: form.notes || '',
      ownerId: form.ownerId || 'u1', createdAt: form.createdAt || new Date().toISOString().slice(0, 10),
    }
    onSave(d)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="modal-title">{deal ? 'Edit Deal' : 'New Deal'}</h2>
          <button className="neu-btn neu-btn-icon" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">Deal Title *</label>
          <input className="neu-input" value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="Enterprise License" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contact *</label>
            <select className="neu-select" value={form.contactId || ''} onChange={e => handleContactChange(e.target.value)}>
              <option value="">Select contact…</option>
              {contacts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Stage</label>
            <select className="neu-select" value={form.stage || 'prospecting'} onChange={e => set('stage', e.target.value)}>
              {Object.entries(STAGE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Value ($)</label>
            <input className="neu-input" type="number" value={form.value || ''} onChange={e => set('value', Number(e.target.value))} placeholder="50000" />
          </div>
          <div className="form-group">
            <label className="form-label">Probability (%)</label>
            <input className="neu-input" type="number" min={0} max={100} value={form.probability || ''} onChange={e => set('probability', Number(e.target.value))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Close Date</label>
            <input className="neu-input" type="date" value={form.closeDate || ''} onChange={e => set('closeDate', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="neu-select" value={form.priority || 'medium'} onChange={e => set('priority', e.target.value as Priority)}>
              {Object.entries(PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="neu-input" rows={3} value={form.notes || ''} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
        </div>
        <div className="flex gap-3 justify-between">
          <button className="neu-btn" onClick={onClose}>Cancel</button>
          <button className="neu-btn neu-btn-primary" onClick={handleSave}>
            {deal ? 'Save Changes' : 'Add Deal'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [modal, setModal] = useState<{ open: boolean; deal?: Deal }>({ open: false })

  const filtered = deals.filter(d => {
    const matchSearch = !search || [d.title, d.contactName, d.company].some(v => v.toLowerCase().includes(search.toLowerCase()))
    const matchStage = stageFilter === 'all' || d.stage === stageFilter
    return matchSearch && matchStage
  })

  function saveDeal(d: Deal) {
    setDeals(prev => prev.some(p => p.id === d.id) ? prev.map(p => p.id === d.id ? d : p) : [...prev, d])
    setModal({ open: false })
  }

  function deleteDeal(id: string) {
    if (confirm('Delete this deal?')) setDeals(prev => prev.filter(d => d.id !== id))
  }

  const totalPipeline = filtered
    .filter(d => !['closed-won','closed-lost'].includes(d.stage))
    .reduce((s, d) => s + d.value * d.probability / 100, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Deals</h1>
          <p className="page-subtitle">{deals.length} deals · Weighted pipeline: ${(totalPipeline/1000).toFixed(0)}k</p>
        </div>
        <button className="neu-btn neu-btn-primary" onClick={() => setModal({ open: true })}>
          <Plus size={16} /> Add Deal
        </button>
      </div>

      <div className="filters-row">
        <div className="search-bar" style={{ maxWidth: 260 }}>
          <Search size={15} color="var(--text-muted)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deals..." />
        </div>
        <button
          className="neu-btn neu-btn-sm"
          style={stageFilter === 'all' ? { boxShadow: 'var(--neu-inset-sm)', color: 'var(--accent)' } : {}}
          onClick={() => setStageFilter('all')}
        >All</button>
        {Object.entries(STAGE_LABELS).map(([v, l]) => (
          <button
            key={v}
            className="neu-btn neu-btn-sm"
            style={stageFilter === v ? { boxShadow: 'var(--neu-inset-sm)', color: 'var(--accent)' } : {}}
            onClick={() => setStageFilter(v)}
          >{l}</button>
        ))}
      </div>

      <div className="neu-card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Contact</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Probability</th>
                <th>Priority</th>
                <th>Close Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8}><div className="empty-state">No deals found</div></td></tr>
              ) : filtered.map(d => (
                <tr key={d.id}>
                  <td>
                    <div>
                      <div className="font-semibold text-sm">{d.title}</div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        <Building2 size={11} />{d.company}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm">{d.contactName.split(' ').map(n=>n[0]).join('')}</div>
                      <span className="text-sm">{d.contactName}</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${d.stage}`}>{STAGE_LABELS[d.stage]}</span></td>
                  <td><span className="font-semibold">${d.value.toLocaleString()}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div style={{
                        height: 6, borderRadius: 3, background: 'var(--bg-dark)',
                        width: 60, boxShadow: 'var(--neu-inset-sm)'
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 3, width: `${d.probability}%`,
                          background: d.probability >= 80 ? 'var(--success)' : d.probability >= 50 ? 'var(--accent)' : 'var(--warning)'
                        }} />
                      </div>
                      <span className="text-xs text-secondary">{d.probability}%</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${d.priority}`}>{PRIORITY_LABELS[d.priority]}</span></td>
                  <td>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <Calendar size={11} />{d.closeDate || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="neu-btn neu-btn-sm" onClick={() => setModal({ open: true, deal: d })}>Edit</button>
                      <button className="neu-btn neu-btn-sm" style={{ color: 'var(--danger)' }} onClick={() => deleteDeal(d.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <DealModal
          deal={modal.deal}
          onClose={() => setModal({ open: false })}
          onSave={saveDeal}
        />
      )}
    </div>
  )
}
