// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'churned';
export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NoteType = 'note' | 'call' | 'email' | 'meeting';

export type PropertyType = 'residential' | 'commercial';
export type JobStatus = 'scheduled' | 'confirmed' | 'en_route' | 'in_progress' | 'completed' | 'cancelled' | 'invoiced';
export type CrewRole = 'cleaner' | 'team_lead' | 'supervisor';
export type PayType = 'hourly' | 'per_job' | 'salary';
export type CrewStatus = 'active' | 'inactive' | 'on_leave';
export type Frequency = 'weekly' | 'biweekly' | 'monthly';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
export type PaymentMethod = 'cash' | 'check' | 'card' | 'bank_transfer' | 'venmo' | 'zelle';
export type ServiceCategory = 'residential' | 'commercial' | 'specialty';

// ─── Core CRM Interfaces (matching exact DB column names) ─────────────────────

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

// ─── Cleaning Business Interfaces (matching exact DB column names) ────────────

export interface Property {
  id: string;
  contact_id?: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zip?: string;
  type: PropertyType;
  size_sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  entry_method?: string;
  entry_code?: string;
  alarm_code?: string;
  pets?: string;
  parking?: string;
  special_instructions?: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface CleaningService {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  base_price: number;
  price_per_sqft?: number;
  estimated_hours?: number;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface CrewMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: CrewRole;
  pay_rate?: number;
  pay_type: PayType;
  status: CrewStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RecurringSchedule {
  id: string;
  contact_id?: string;
  property_id?: string;
  service_id?: string;
  title: string;
  frequency: Frequency;
  day_of_week?: number;
  day_of_month?: number;
  start_date: string;
  end_date?: string;
  start_time?: string;
  estimated_hours?: number;
  price?: number;
  active: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  contact_id?: string;
  property_id?: string;
  service_id?: string;
  recurring_schedule_id?: string;
  title: string;
  status: JobStatus;
  scheduled_date: string;
  start_time?: string;
  end_time?: string;
  estimated_hours?: number;
  actual_hours?: number;
  price?: number;
  tip?: number;
  notes?: string;
  completion_notes?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface JobCrew {
  id: string;
  job_id: string;
  crew_member_id: string;
  role: CrewRole;
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  contact_id?: string;
  job_id?: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  payment_date?: string;
  payment_method?: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface Quote {
  id: string;
  quote_number: string;
  contact_id?: string;
  property_id?: string;
  service_id?: string;
  status: QuoteStatus;
  valid_until?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

// ─── Extended / Joined Interfaces ─────────────────────────────────────────────

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

export interface PropertyWithContact extends Property {
  contact_name?: string;
}

export interface JobWithRefs extends Job {
  contact_name?: string;
  property_address?: string;
  service_name?: string;
  crew?: CrewMember[];
  // alias used by some components
  scheduled_time?: string;
}

export interface InvoiceWithRefs extends Invoice {
  contact_name?: string;
  job_title?: string;
  items?: InvoiceItem[];
}

export interface QuoteWithRefs extends Quote {
  contact_name?: string;
  property_address?: string;
  service_name?: string;
  items?: QuoteItem[];
}
