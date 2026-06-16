import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const deal_id = searchParams.get('deal_id') || '';
  const type = searchParams.get('type') || '';

  let sql = `
    SELECT n.*, c.name as contact_name, d.title as deal_title
    FROM notes n
    LEFT JOIN contacts c ON n.contact_id = c.id
    LEFT JOIN deals d ON n.deal_id = d.id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) { sql += ' AND n.contact_id = ?'; params.push(contact_id); }
  if (deal_id) { sql += ' AND n.deal_id = ?'; params.push(deal_id); }
  if (type) { sql += ' AND n.type = ?'; params.push(type); }
  sql += ' ORDER BY n.created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(`
    INSERT INTO notes (id, content, type, contact_id, deal_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, body.content, body.type ?? 'note',
    body.contact_id ?? null, body.deal_id ?? null,
    now, now,
  );

  const data = db.prepare(`
    SELECT n.*, c.name as contact_name, d.title as deal_title
    FROM notes n
    LEFT JOIN contacts c ON n.contact_id = c.id
    LEFT JOIN deals d ON n.deal_id = d.id
    WHERE n.id = ?
  `).get(id);
  return NextResponse.json({ data }, { status: 201 });
}
