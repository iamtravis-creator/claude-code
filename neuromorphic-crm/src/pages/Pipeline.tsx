import { useState } from 'react'
import { deals as initialDeals } from '../data/mockData'
import type { Deal, DealStage } from '../types'

type Column = { stage: DealStage; label: string; color: string; headerBg: string }

const COLUMNS: Column[] = [
  { stage: 'prospecting',   label: 'Prospecting',   color: '#7c3aed', headerBg: 'rgba(124,58,237,0.08)' },
  { stage: 'qualification', label: 'Qualification',  color: '#0891b2', headerBg: 'rgba(8,145,178,0.08)'  },
  { stage: 'proposal',      label: 'Proposal',       color: '#d97706', headerBg: 'rgba(217,119,6,0.08)'  },
  { stage: 'negotiation',   label: 'Negotiation',    color: '#6c63ff', headerBg: 'rgba(108,99,255,0.08)' },
  { stage: 'closed-won',    label: 'Closed Won',     color: '#059669', headerBg: 'rgba(5,150,105,0.08)'  },
  { stage: 'closed-lost',   label: 'Closed Lost',    color: '#dc2626', headerBg: 'rgba(220,38,38,0.08)'  },
]

export default function Pipeline() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)
  const [dragging, setDragging] = useState<string | null>(null)

  function moveToStage(dealId: string, stage: DealStage) {
    setDeals(prev => prev.map(d => d.id === dealId ? {
      ...d, stage,
      probability: stage === 'closed-won' ? 100 : stage === 'closed-lost' ? 0 : d.probability
    } : d))
  }

  function handleDrop(e: React.DragEvent, stage: DealStage) {
    e.preventDefault()
    if (dragging) moveToStage(dragging, stage)
    setDragging(null)
  }

  const totalValue = deals.filter(d => d.stage === 'closed-won').reduce((s, d) => s + d.value, 0)
  const pipelineValue = deals
    .filter(d => !['closed-won','closed-lost'].includes(d.stage))
    .reduce((s, d) => s + d.value * d.probability / 100, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Pipeline</h1>
          <p className="page-subtitle">
            Won: <strong>${(totalValue/1000).toFixed(0)}k</strong> ·
            Weighted pipeline: <strong>${(pipelineValue/1000).toFixed(0)}k</strong>
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="neu-card-sm text-xs text-muted" style={{ padding: '0.5rem 0.85rem' }}>
            Drag & drop to move stages
          </div>
        </div>
      </div>

      <div className="pipeline-board">
        {COLUMNS.map(col => {
          const colDeals = deals.filter(d => d.stage === col.stage)
          const colTotal = colDeals.reduce((s, d) => s + d.value, 0)
          return (
            <div
              key={col.stage}
              className="pipeline-column"
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, col.stage)}
            >
              <div className="pipeline-column-header" style={{ background: col.headerBg }}>
                <div>
                  <div className="pipeline-column-title" style={{ color: col.color }}>{col.label}</div>
                  <div className="text-xs text-muted">{colDeals.length} deal{colDeals.length !== 1 ? 's' : ''}</div>
                </div>
                <div
                  style={{
                    width: 24, height: 24, borderRadius: '50%', background: col.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: 'white', flexShrink: 0
                  }}
                >{colDeals.length}</div>
              </div>

              <div className="pipeline-cards">
                {colDeals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Drop deals here
                  </div>
                ) : colDeals.map(d => (
                  <div
                    key={d.id}
                    className="pipeline-deal-card"
                    draggable
                    onDragStart={() => setDragging(d.id)}
                    onDragEnd={() => setDragging(null)}
                    style={dragging === d.id ? { opacity: 0.5 } : {}}
                  >
                    <div className="font-semibold text-sm" style={{ marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {d.title}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="avatar avatar-sm">{d.contactName.split(' ').map(n=>n[0]).join('')}</div>
                      <div>
                        <div className="text-xs font-medium">{d.contactName}</div>
                        <div className="text-xs text-muted">{d.company}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm" style={{ color: col.color }}>
                        ${(d.value/1000).toFixed(0)}k
                      </span>
                      <span className={`badge badge-${d.priority}`} style={{ fontSize: '0.68rem' }}>
                        {d.priority}
                      </span>
                    </div>
                    <div style={{ marginTop: '0.6rem' }}>
                      <div style={{
                        height: 4, borderRadius: 2, background: 'var(--bg-dark)',
                        boxShadow: 'var(--neu-inset-sm)'
                      }}>
                        <div style={{
                          height: '100%', borderRadius: 2, width: `${d.probability}%`,
                          background: col.color, opacity: 0.7,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div className="text-xs text-muted" style={{ marginTop: '0.3rem' }}>
                        {d.probability}% · {d.closeDate || 'No close date'}
                      </div>
                    </div>
                    <div className="flex gap-1" style={{ marginTop: '0.6rem', flexWrap: 'wrap' }}>
                      {COLUMNS.filter(c => c.stage !== col.stage).map(c => (
                        <button
                          key={c.stage}
                          className="neu-btn neu-btn-sm"
                          style={{ fontSize: '0.65rem', padding: '0.25rem 0.5rem', color: c.color }}
                          onClick={() => moveToStage(d.id, c.stage)}
                        >→ {c.label}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pipeline-total">
                Total: <strong>${(colTotal/1000).toFixed(0)}k</strong>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
