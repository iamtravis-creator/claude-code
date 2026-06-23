export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'churned'
export type DealStage = 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
export type Priority = 'low' | 'medium' | 'high'
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task'

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  company: string
  title: string
  status: ContactStatus
  tags: string[]
  createdAt: string
  lastActivity: string
  avatar: string
  value: number
}

export interface Deal {
  id: string
  title: string
  contactId: string
  contactName: string
  company: string
  stage: DealStage
  value: number
  probability: number
  priority: Priority
  closeDate: string
  createdAt: string
  notes: string
  ownerId: string
}

export interface Activity {
  id: string
  type: ActivityType
  contactId: string
  contactName: string
  dealId?: string
  subject: string
  body: string
  date: string
  completed: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
