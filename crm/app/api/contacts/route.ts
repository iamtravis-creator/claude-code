import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  let sql = 'SELECT * FROM contacts WHERE 1=1';
  const params: string[] = [];

  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(`
    INSERT INTO contacts (id, name, email, phone, company, job_title, status, source, notes_text, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, body.name, body.email ?? null, body.phone ?? null,
    body.company ?? null, body.job_title ?? null,
    body.status ?? 'lead', body.source ?? null, body.notes_text ?? null,
    now, now,
  );

  const data = db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
  return NextResponse.json({ data }, { status: 201 });
}
