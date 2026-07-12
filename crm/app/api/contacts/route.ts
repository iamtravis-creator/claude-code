import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';

  let sql = 'SELECT * FROM contacts WHERE 1=1';
  const args: (string | null)[] = [];

  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR company LIKE ?)';
    const like = `%${search}%`;
    args.push(like, like, like);
  }
  if (status) {
    sql += ' AND status = ?';
    args.push(status);
  }
  sql += ' ORDER BY created_at DESC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  await db.execute({
    sql: `INSERT INTO contacts (id, name, email, phone, company, job_title, status, source, notes_text, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, body.name, body.email ?? null, body.phone ?? null,
      body.company ?? null, body.job_title ?? null,
      body.status ?? 'lead', body.source ?? null, body.notes_text ?? null,
      now, now,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM contacts WHERE id = ?', args: [id] });
  return NextResponse.json({ data: rows[0] }, { status: 201 });
}
