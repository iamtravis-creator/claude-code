import type { Contact, Deal, Activity } from '../types'

export const contacts: Contact[] = [
  {
    id: 'c1', name: 'Sarah Chen', email: 'sarah.chen@techinnovate.io', phone: '+1 415-555-0101',
    company: 'TechInnovate', title: 'VP of Engineering', status: 'customer',
    tags: ['enterprise', 'saas', 'high-value'], createdAt: '2024-01-15', lastActivity: '2024-11-28',
    avatar: 'SC', value: 85000
  },
  {
    id: 'c2', name: 'Marcus Rivera', email: 'mrivera@globalops.com', phone: '+1 312-555-0202',
    company: 'GlobalOps', title: 'COO', status: 'prospect',
    tags: ['mid-market', 'operations'], createdAt: '2024-03-22', lastActivity: '2024-12-01',
    avatar: 'MR', value: 42000
  },
  {
    id: 'c3', name: 'Aisha Patel', email: 'aisha@growthco.ai', phone: '+1 650-555-0303',
    company: 'GrowthCo AI', title: 'CEO', status: 'customer',
    tags: ['startup', 'ai', 'high-growth'], createdAt: '2024-02-10', lastActivity: '2024-11-30',
    avatar: 'AP', value: 120000
  },
  {
    id: 'c4', name: 'James Whitfield', email: 'j.whitfield@enterprise-corp.com', phone: '+1 212-555-0404',
    company: 'EnterpriseCorp', title: 'CTO', status: 'lead',
    tags: ['enterprise', 'inbound'], createdAt: '2024-11-20', lastActivity: '2024-12-02',
    avatar: 'JW', value: 0
  },
  {
    id: 'c5', name: 'Elena Kozlov', email: 'elena.k@scalewise.eu', phone: '+44 20-5550-0505',
    company: 'ScaleWise', title: 'Head of Product', status: 'prospect',
    tags: ['europe', 'product', 'mid-market'], createdAt: '2024-09-05', lastActivity: '2024-11-25',
    avatar: 'EK', value: 38000
  },
  {
    id: 'c6', name: 'David Thompson', email: 'dthompson@velocity.io', phone: '+1 415-555-0606',
    company: 'Velocity', title: 'Director of Sales', status: 'customer',
    tags: ['sales', 'high-value', 'expansion'], createdAt: '2023-11-01', lastActivity: '2024-12-01',
    avatar: 'DT', value: 95000
  },
  {
    id: 'c7', name: 'Priya Nair', email: 'priya@nexusplatform.com', phone: '+1 408-555-0707',
    company: 'Nexus Platform', title: 'Product Manager', status: 'lead',
    tags: ['platform', 'inbound', 'smb'], createdAt: '2024-11-28', lastActivity: '2024-11-28',
    avatar: 'PN', value: 0
  },
  {
    id: 'c8', name: 'Carlos Mendez', email: 'c.mendez@databridge.mx', phone: '+52 55-5550-0808',
    company: 'DataBridge', title: 'CTO', status: 'churned',
    tags: ['latam', 'data', 'churned'], createdAt: '2023-06-15', lastActivity: '2024-08-10',
    avatar: 'CM', value: 22000
  },
]

export const deals: Deal[] = [
  {
    id: 'd1', title: 'TechInnovate Enterprise License', contactId: 'c1', contactName: 'Sarah Chen',
    company: 'TechInnovate', stage: 'closed-won', value: 85000, probability: 100,
    priority: 'high', closeDate: '2024-11-15', createdAt: '2024-09-01', notes: 'Annual enterprise renewal with seat expansion.',
    ownerId: 'u1'
  },
  {
    id: 'd2', title: 'GlobalOps Operations Suite', contactId: 'c2', contactName: 'Marcus Rivera',
    company: 'GlobalOps', stage: 'proposal', value: 42000, probability: 60,
    priority: 'high', closeDate: '2024-12-31', createdAt: '2024-10-15', notes: 'Proposal sent. Awaiting legal review.',
    ownerId: 'u1'
  },
  {
    id: 'd3', title: 'GrowthCo AI Platform — Year 2', contactId: 'c3', contactName: 'Aisha Patel',
    company: 'GrowthCo AI', stage: 'negotiation', value: 140000, probability: 80,
    priority: 'high', closeDate: '2024-12-15', createdAt: '2024-10-01', notes: 'Negotiating multi-year contract. Strong champion.',
    ownerId: 'u2'
  },
  {
    id: 'd4', title: 'EnterpriseCorp Pilot', contactId: 'c4', contactName: 'James Whitfield',
    company: 'EnterpriseCorp', stage: 'qualification', value: 200000, probability: 25,
    priority: 'medium', closeDate: '2025-03-31', createdAt: '2024-11-20', notes: 'Early stage. Large potential deal.',
    ownerId: 'u1'
  },
  {
    id: 'd5', title: 'ScaleWise Growth Package', contactId: 'c5', contactName: 'Elena Kozlov',
    company: 'ScaleWise', stage: 'proposal', value: 38000, probability: 55,
    priority: 'medium', closeDate: '2025-01-15', createdAt: '2024-10-28', notes: 'Proposal sent. Pricing negotiation ongoing.',
    ownerId: 'u2'
  },
  {
    id: 'd6', title: 'Velocity Expansion — Sales Team', contactId: 'c6', contactName: 'David Thompson',
    company: 'Velocity', stage: 'closed-won', value: 95000, probability: 100,
    priority: 'high', closeDate: '2024-10-01', createdAt: '2024-08-15', notes: 'Added 20 new seats for sales team expansion.',
    ownerId: 'u1'
  },
  {
    id: 'd7', title: 'Nexus Platform Starter', contactId: 'c7', contactName: 'Priya Nair',
    company: 'Nexus Platform', stage: 'prospecting', value: 12000, probability: 15,
    priority: 'low', closeDate: '2025-02-28', createdAt: '2024-11-28', notes: 'Initial outreach. Discovery call scheduled.',
    ownerId: 'u2'
  },
  {
    id: 'd8', title: 'DataBridge Recovery', contactId: 'c8', contactName: 'Carlos Mendez',
    company: 'DataBridge', stage: 'closed-lost', value: 25000, probability: 0,
    priority: 'low', closeDate: '2024-09-01', createdAt: '2024-07-01', notes: 'Lost to competitor on pricing.',
    ownerId: 'u1'
  },
]

export const activities: Activity[] = [
  {
    id: 'a1', type: 'meeting', contactId: 'c1', contactName: 'Sarah Chen',
    dealId: 'd1', subject: 'Renewal kickoff call', body: 'Discussed expansion to 50 seats. Very positive.',
    date: '2024-11-28', completed: true
  },
  {
    id: 'a2', type: 'email', contactId: 'c2', contactName: 'Marcus Rivera',
    dealId: 'd2', subject: 'Proposal follow-up', body: 'Sent updated pricing breakdown and case studies.',
    date: '2024-12-01', completed: true
  },
  {
    id: 'a3', type: 'call', contactId: 'c3', contactName: 'Aisha Patel',
    dealId: 'd3', subject: 'Contract negotiation', body: 'Agreed on 3-year term. Finalizing discount structure.',
    date: '2024-11-30', completed: true
  },
  {
    id: 'a4', type: 'task', contactId: 'c4', contactName: 'James Whitfield',
    dealId: 'd4', subject: 'Send technical whitepaper', body: 'Requested security and compliance documentation.',
    date: '2024-12-03', completed: false
  },
  {
    id: 'a5', type: 'note', contactId: 'c5', contactName: 'Elena Kozlov',
    dealId: 'd5', subject: 'Internal champion update', body: 'Elena confirmed budget approval. CFO sign-off needed.',
    date: '2024-11-25', completed: true
  },
  {
    id: 'a6', type: 'call', contactId: 'c6', contactName: 'David Thompson',
    dealId: 'd6', subject: 'Onboarding check-in', body: '20 new seats fully onboarded. NPS score 9/10.',
    date: '2024-12-01', completed: true
  },
  {
    id: 'a7', type: 'email', contactId: 'c7', contactName: 'Priya Nair',
    dealId: 'd7', subject: 'Discovery call confirmation', body: 'Confirmed discovery call for Dec 5th.',
    date: '2024-11-28', completed: true
  },
]
