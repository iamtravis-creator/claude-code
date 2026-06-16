import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const stage = searchParams.get('stage') || '';

  let sql = `
    SELECT d.*, c.name as contact_name
    FROM deals d
    LEFT JOIN contacts c ON d.contact_id = c.id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) { sql += ' AND d.contact_id = ?'; params.push(contact_id); }
  if (stage) { sql += ' AND d.stage = ?'; params.push(stage); }
  sql += ' ORDER BY d.created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(`
    INSERT INTO deals (id, title, contact_id, value, currency, stage, probability, close_date, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, body.title, body.contact_id ?? null, body.value ?? null,
    body.currency ?? 'USD', body.stage ?? 'lead',
    body.probability ?? null, body.close_date ?? null, body.description ?? null,
    now, now,
  );

  const data = db.prepare('SELECT d.*, c.name as contact_name FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE d.id = ?').get(id);
  return NextResponse.json({ data }, { status: 201 });
}
