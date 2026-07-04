import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'crm.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    -- contacts
    CREATE TABLE IF NOT EXISTS contacts (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT,
      phone      TEXT,
      company    TEXT,
      job_title  TEXT,
      status     TEXT NOT NULL DEFAULT 'lead',
      source     TEXT,
      notes_text TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- deals
    CREATE TABLE IF NOT EXISTS deals (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      contact_id  TEXT REFERENCES contacts(id) ON DELETE SET NULL,
      value       REAL,
      currency    TEXT NOT NULL DEFAULT 'USD',
      stage       TEXT NOT NULL DEFAULT 'lead',
      probability INTEGER,
      close_date  TEXT,
      description TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    -- tasks
    CREATE TABLE IF NOT EXISTS tasks (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      status      TEXT NOT NULL DEFAULT 'open',
      priority    TEXT NOT NULL DEFAULT 'medium',
      due_date    TEXT,
      contact_id  TEXT REFERENCES contacts(id) ON DELETE SET NULL,
      deal_id     TEXT REFERENCES deals(id) ON DELETE SET NULL,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    -- notes
    CREATE TABLE IF NOT EXISTS notes (
      id          TEXT PRIMARY KEY,
      content     TEXT NOT NULL,
      type        TEXT NOT NULL DEFAULT 'note',
      contact_id  TEXT REFERENCES contacts(id) ON DELETE CASCADE,
      deal_id     TEXT REFERENCES deals(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    -- properties (service locations per client)
    CREATE TABLE IF NOT EXISTS properties (
      id                   TEXT PRIMARY KEY,
      contact_id           TEXT REFERENCES contacts(id) ON DELETE CASCADE,
      name                 TEXT NOT NULL,
      address              TEXT NOT NULL,
      city                 TEXT,
      state                TEXT,
      zip                  TEXT,
      type                 TEXT DEFAULT 'residential',
      size_sqft            INTEGER,
      bedrooms             INTEGER,
      bathrooms            REAL,
      entry_method         TEXT,
      entry_code           TEXT,
      alarm_code           TEXT,
      pets                 TEXT,
      parking              TEXT,
      special_instructions TEXT,
      active               INTEGER DEFAULT 1,
      created_at           TEXT,
      updated_at           TEXT
    );

    -- services (cleaning services catalog)
    CREATE TABLE IF NOT EXISTS services (
      id               TEXT PRIMARY KEY,
      name             TEXT NOT NULL,
      description      TEXT,
      category         TEXT DEFAULT 'residential',
      base_price       REAL NOT NULL DEFAULT 0,
      price_per_sqft   REAL,
      estimated_hours  REAL,
      active           INTEGER DEFAULT 1,
      created_at       TEXT,
      updated_at       TEXT
    );

    -- crew_members (staff/employees)
    CREATE TABLE IF NOT EXISTS crew_members (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT,
      phone      TEXT,
      role       TEXT DEFAULT 'cleaner',
      pay_rate   REAL,
      pay_type   TEXT DEFAULT 'hourly',
      status     TEXT DEFAULT 'active',
      notes      TEXT,
      created_at TEXT,
      updated_at TEXT
    );

    -- recurring_schedules (weekly/biweekly/monthly bookings)
    CREATE TABLE IF NOT EXISTS recurring_schedules (
      id             TEXT PRIMARY KEY,
      contact_id     TEXT REFERENCES contacts(id) ON DELETE CASCADE,
      property_id    TEXT REFERENCES properties(id) ON DELETE SET NULL,
      service_id     TEXT REFERENCES services(id) ON DELETE SET NULL,
      title          TEXT NOT NULL,
      frequency      TEXT NOT NULL,
      day_of_week    INTEGER,
      day_of_month   INTEGER,
      start_date     TEXT NOT NULL,
      end_date       TEXT,
      start_time     TEXT,
      estimated_hours REAL,
      price          REAL,
      active         INTEGER DEFAULT 1,
      notes          TEXT,
      created_at     TEXT,
      updated_at     TEXT
    );

    -- jobs (cleaning appointments — the core table)
    CREATE TABLE IF NOT EXISTS jobs (
      id                    TEXT PRIMARY KEY,
      contact_id            TEXT REFERENCES contacts(id) ON DELETE SET NULL,
      property_id           TEXT REFERENCES properties(id) ON DELETE SET NULL,
      service_id            TEXT REFERENCES services(id) ON DELETE SET NULL,
      recurring_schedule_id TEXT REFERENCES recurring_schedules(id) ON DELETE SET NULL,
      title                 TEXT NOT NULL,
      status                TEXT DEFAULT 'scheduled',
      scheduled_date        TEXT NOT NULL,
      start_time            TEXT,
      end_time              TEXT,
      estimated_hours       REAL,
      actual_hours          REAL,
      price                 REAL,
      tip                   REAL DEFAULT 0,
      notes                 TEXT,
      completion_notes      TEXT,
      rating                INTEGER,
      created_at            TEXT,
      updated_at            TEXT
    );

    -- job_crew (M2M: jobs <-> crew_members)
    CREATE TABLE IF NOT EXISTS job_crew (
      id              TEXT PRIMARY KEY,
      job_id          TEXT REFERENCES jobs(id) ON DELETE CASCADE,
      crew_member_id  TEXT REFERENCES crew_members(id) ON DELETE CASCADE,
      role            TEXT DEFAULT 'cleaner',
      created_at      TEXT,
      UNIQUE(job_id, crew_member_id)
    );

    -- invoices (billing)
    CREATE TABLE IF NOT EXISTS invoices (
      id              TEXT PRIMARY KEY,
      invoice_number  TEXT NOT NULL UNIQUE,
      contact_id      TEXT REFERENCES contacts(id) ON DELETE SET NULL,
      job_id          TEXT REFERENCES jobs(id) ON DELETE SET NULL,
      status          TEXT DEFAULT 'draft',
      issue_date      TEXT NOT NULL,
      due_date        TEXT,
      subtotal        REAL DEFAULT 0,
      tax_rate        REAL DEFAULT 0,
      tax_amount      REAL DEFAULT 0,
      total           REAL DEFAULT 0,
      amount_paid     REAL DEFAULT 0,
      payment_date    TEXT,
      payment_method  TEXT,
      notes           TEXT,
      created_at      TEXT,
      updated_at      TEXT
    );

    -- invoice_items (line items per invoice)
    CREATE TABLE IF NOT EXISTS invoice_items (
      id          TEXT PRIMARY KEY,
      invoice_id  TEXT REFERENCES invoices(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      quantity    REAL DEFAULT 1,
      unit_price  REAL NOT NULL,
      total       REAL NOT NULL,
      created_at  TEXT
    );

    -- quotes (pre-job estimates)
    CREATE TABLE IF NOT EXISTS quotes (
      id           TEXT PRIMARY KEY,
      quote_number TEXT NOT NULL UNIQUE,
      contact_id   TEXT REFERENCES contacts(id) ON DELETE SET NULL,
      property_id  TEXT REFERENCES properties(id) ON DELETE SET NULL,
      service_id   TEXT REFERENCES services(id) ON DELETE SET NULL,
      status       TEXT DEFAULT 'draft',
      valid_until  TEXT,
      subtotal     REAL DEFAULT 0,
      tax_rate     REAL DEFAULT 0,
      tax_amount   REAL DEFAULT 0,
      total        REAL DEFAULT 0,
      notes        TEXT,
      created_at   TEXT,
      updated_at   TEXT
    );

    -- quote_items (line items per quote)
    CREATE TABLE IF NOT EXISTS quote_items (
      id          TEXT PRIMARY KEY,
      quote_id    TEXT REFERENCES quotes(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      quantity    REAL DEFAULT 1,
      unit_price  REAL NOT NULL,
      total       REAL NOT NULL,
      created_at  TEXT
    );

    -- indexes: contacts
    CREATE INDEX IF NOT EXISTS idx_contacts_email  ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

    -- indexes: deals
    CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);
    CREATE INDEX IF NOT EXISTS idx_deals_stage      ON deals(stage);

    -- indexes: tasks
    CREATE INDEX IF NOT EXISTS idx_tasks_contact_id ON tasks(contact_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_deal_id    ON tasks(deal_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status     ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date   ON tasks(due_date);

    -- indexes: notes
    CREATE INDEX IF NOT EXISTS idx_notes_contact_id ON notes(contact_id);
    CREATE INDEX IF NOT EXISTS idx_notes_deal_id    ON notes(deal_id);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);

    -- indexes: properties
    CREATE INDEX IF NOT EXISTS idx_properties_contact_id ON properties(contact_id);
    CREATE INDEX IF NOT EXISTS idx_properties_active     ON properties(active);
    CREATE INDEX IF NOT EXISTS idx_properties_type       ON properties(type);

    -- indexes: services
    CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
    CREATE INDEX IF NOT EXISTS idx_services_active   ON services(active);

    -- indexes: crew_members
    CREATE INDEX IF NOT EXISTS idx_crew_members_status ON crew_members(status);
    CREATE INDEX IF NOT EXISTS idx_crew_members_role   ON crew_members(role);

    -- indexes: recurring_schedules
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_contact_id  ON recurring_schedules(contact_id);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_property_id ON recurring_schedules(property_id);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_service_id  ON recurring_schedules(service_id);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_active      ON recurring_schedules(active);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_frequency   ON recurring_schedules(frequency);
    CREATE INDEX IF NOT EXISTS idx_recurring_schedules_start_date  ON recurring_schedules(start_date);

    -- indexes: jobs
    CREATE INDEX IF NOT EXISTS idx_jobs_contact_id            ON jobs(contact_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_property_id           ON jobs(property_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_service_id            ON jobs(service_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_recurring_schedule_id ON jobs(recurring_schedule_id);
    CREATE INDEX IF NOT EXISTS idx_jobs_status                ON jobs(status);
    CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date        ON jobs(scheduled_date);
    CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date_status ON jobs(scheduled_date, status);

    -- indexes: job_crew
    CREATE INDEX IF NOT EXISTS idx_job_crew_job_id         ON job_crew(job_id);
    CREATE INDEX IF NOT EXISTS idx_job_crew_crew_member_id ON job_crew(crew_member_id);

    -- indexes: invoices
    CREATE INDEX IF NOT EXISTS idx_invoices_contact_id     ON invoices(contact_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_job_id         ON invoices(job_id);
    CREATE INDEX IF NOT EXISTS idx_invoices_status         ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_issue_date     ON invoices(issue_date);
    CREATE INDEX IF NOT EXISTS idx_invoices_due_date       ON invoices(due_date);
    CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);

    -- indexes: invoice_items
    CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

    -- indexes: quotes
    CREATE INDEX IF NOT EXISTS idx_quotes_contact_id   ON quotes(contact_id);
    CREATE INDEX IF NOT EXISTS idx_quotes_property_id  ON quotes(property_id);
    CREATE INDEX IF NOT EXISTS idx_quotes_service_id   ON quotes(service_id);
    CREATE INDEX IF NOT EXISTS idx_quotes_status       ON quotes(status);
    CREATE INDEX IF NOT EXISTS idx_quotes_valid_until  ON quotes(valid_until);
    CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);

    -- indexes: quote_items
    CREATE INDEX IF NOT EXISTS idx_quote_items_quote_id ON quote_items(quote_id);
  `);
}
