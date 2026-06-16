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

    CREATE TABLE IF NOT EXISTS notes (
      id          TEXT PRIMARY KEY,
      content     TEXT NOT NULL,
      type        TEXT NOT NULL DEFAULT 'note',
      contact_id  TEXT REFERENCES contacts(id) ON DELETE CASCADE,
      deal_id     TEXT REFERENCES deals(id) ON DELETE CASCADE,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_deals_contact_id  ON deals(contact_id);
    CREATE INDEX IF NOT EXISTS idx_deals_stage        ON deals(stage);
    CREATE INDEX IF NOT EXISTS idx_tasks_contact_id   ON tasks(contact_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_deal_id      ON tasks(deal_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_status       ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_due_date     ON tasks(due_date);
    CREATE INDEX IF NOT EXISTS idx_notes_contact_id   ON notes(contact_id);
    CREATE INDEX IF NOT EXISTS idx_notes_deal_id      ON notes(deal_id);
    CREATE INDEX IF NOT EXISTS idx_notes_created_at   ON notes(created_at);
  `);
}
