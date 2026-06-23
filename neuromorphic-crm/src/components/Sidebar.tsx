import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, Kanban, Settings, Brain } from 'lucide-react'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts',  icon: Users,          label: 'Contacts'  },
  { to: '/deals',     icon: Briefcase,      label: 'Deals'     },
  { to: '/pipeline',  icon: Kanban,         label: 'Pipeline'  },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Brain size={22} />
        </div>
        <span className="sidebar-logo-text">Neuro<span>CRM</span></span>
      </div>

      <span className="sidebar-section">Navigation</span>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}

      <div className="sidebar-spacer" />

      <span className="sidebar-section">Account</span>
      <button className="sidebar-link">
        <Settings size={18} />
        Settings
      </button>
      <div style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
        <div className="neu-card-sm flex items-center gap-3" style={{ padding: '0.75rem' }}>
          <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg,#6c63ff,#a78bfa)' }}>TM</div>
          <div>
            <div className="font-semibold text-sm">Travis M.</div>
            <div className="text-xs text-muted">Admin</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
