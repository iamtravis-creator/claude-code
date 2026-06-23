import { TrendingUp, Users, DollarSign, Target, ArrowUp, ArrowDown, Clock } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import { contacts, deals, activities } from '../data/mockData'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const revenueData = [
  { month: 'Jul', revenue: 48000, target: 45000 },
  { month: 'Aug', revenue: 52000, target: 50000 },
  { month: 'Sep', revenue: 61000, target: 55000 },
  { month: 'Oct', revenue: 58000, target: 60000 },
  { month: 'Nov', revenue: 95000, target: 70000 },
  { month: 'Dec', revenue: 42000, target: 75000 },
]

const STAGE_COLORS: Record<string, string> = {
  prospecting: '#7c3aed',
  qualification: '#0891b2',
  proposal: '#d97706',
  negotiation: '#6c63ff',
  'closed-won': '#10b981',
  'closed-lost': '#ef4444',
}

const stageData = Object.entries(
  deals.reduce((acc, d) => {
    acc[d.stage] = (acc[d.stage] || 0) + 1
    return acc
  }, {} as Record<string, number>)
).map(([name, value]) => ({ name, value }))

const wonDeals = deals.filter(d => d.stage === 'closed-won')
const totalRevenue = wonDeals.reduce((s, d) => s + d.value, 0)
const pipelineValue = deals
  .filter(d => !['closed-won','closed-lost'].includes(d.stage))
  .reduce((s, d) => s + d.value * d.probability / 100, 0)
const customerCount = contacts.filter(c => c.status === 'customer').length
const leadCount = contacts.filter(c => c.status === 'lead').length

function StatCard({ label, value, icon: Icon, iconBg, change, positive }: {
  label: string; value: string; icon: React.ElementType;
  iconBg: string; change?: string; positive?: boolean
}) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-center">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ background: iconBg }}>
          <Icon size={18} color="white" />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${positive ? 'text-success' : 'text-danger'}`}>
          {positive ? <ArrowUp size={13} /> : <ArrowDown size={13} />}
          {change} vs last month
        </div>
      )}
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="neu-card-sm" style={{ padding: '0.75rem 1rem', minWidth: 140 }}>
      <div className="font-semibold text-sm mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span className="text-secondary">{p.name}:</span>
          <span className="font-semibold">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const pendingActivities = activities.filter(a => !a.completed)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{today}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <StatCard
          label="Total Revenue" value={`$${(totalRevenue/1000).toFixed(0)}k`}
          icon={DollarSign} iconBg="linear-gradient(135deg,#10b981,#059669)"
          change="+23%" positive
        />
        <StatCard
          label="Pipeline Value" value={`$${(pipelineValue/1000).toFixed(0)}k`}
          icon={TrendingUp} iconBg="linear-gradient(135deg,#6c63ff,#8b5cf6)"
          change="+8%" positive
        />
        <StatCard
          label="Customers" value={String(customerCount)}
          icon={Users} iconBg="linear-gradient(135deg,#3b82f6,#2563eb)"
          change="+2" positive
        />
        <StatCard
          label="New Leads" value={String(leadCount)}
          icon={Target} iconBg="linear-gradient(135deg,#f59e0b,#d97706)"
          change="+5" positive
        />
      </div>

      <div className="dashboard-charts">
        <div className="neu-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="font-semibold">Revenue vs Target</div>
              <div className="text-xs text-muted mt-1">Last 6 months</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tgtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={v => `$${v/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6c63ff" strokeWidth={2.5}
                fill="url(#revGrad)" />
              <Area type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={2}
                strokeDasharray="5 4" fill="url(#tgtGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="neu-card">
          <div className="font-semibold mb-1">Deal Stages</div>
          <div className="text-xs text-muted mb-4">Current pipeline distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={stageData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {stageData.map((entry) => (
                  <Cell key={entry.name} fill={STAGE_COLORS[entry.name] || '#6c63ff'} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any, n: string) => [v + ' deals', n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1" style={{ marginTop: '0.5rem' }}>
            {stageData.map(s => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <span style={{ width: 8, height: 8, borderRadius: 2, background: STAGE_COLORS[s.name], display: 'inline-block', flexShrink: 0 }} />
                <span className="text-secondary capitalize">{s.name.replace('-', ' ')}</span>
                <span className="font-semibold" style={{ marginLeft: 'auto' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="neu-card">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Top Deals</div>
            <span className="text-xs text-muted">By value</span>
          </div>
          <div className="flex flex-col gap-3">
            {deals
              .filter(d => !['closed-lost'].includes(d.stage))
              .sort((a, b) => b.value - a.value)
              .slice(0, 5)
              .map(deal => (
                <div key={deal.id} className="flex items-center gap-3">
                  <div className="avatar avatar-sm">{deal.contactName.split(' ').map(n => n[0]).join('')}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-medium text-sm truncate">{deal.title}</div>
                    <div className="text-xs text-muted">{deal.company}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">${(deal.value/1000).toFixed(0)}k</div>
                    <span className={`badge badge-${deal.stage}`}>{deal.stage.replace('-', ' ')}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="neu-card">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Upcoming Tasks</div>
            <span className="text-xs text-muted">{pendingActivities.length} pending</span>
          </div>
          {pendingActivities.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✓</div>
              <div>All caught up!</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingActivities.map(a => (
                <div key={a.id} className="neu-card-sm flex items-center gap-3" style={{ padding: '0.75rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                    boxShadow: 'var(--neu-raise-sm)'
                  }}>
                    <Clock size={16} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-medium text-sm truncate">{a.subject}</div>
                    <div className="text-xs text-muted">{a.contactName} · {a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
