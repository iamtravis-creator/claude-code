export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'churned';
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoteType = 'note' | 'call' | 'email' | 'meeting';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  status: ContactStatus;
  source?: string;
  notes_text?: string;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  title: string;
  contact_id?: string;
  value?: number;
  currency: string;
  stage: DealStage;
  probability?: number;
  close_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  contact_id?: string;
  deal_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: string;
  content: string;
  type: NoteType;
  contact_id?: string;
  deal_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DealWithContact extends Deal {
  contact_name?: string;
}

export interface TaskWithRefs extends Task {
  contact_name?: string;
  deal_title?: string;
}

export interface NoteWithRefs extends Note {
  contact_name?: string;
  deal_title?: string;
}

export interface ContactWithCounts extends Contact {
  deal_count: number;
  open_task_count: number;
}
