import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';

  let sql = 'SELECT * FROM crew_members WHERE 1=1';
  const params: string[] = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }

  sql += ' ORDER BY name ASC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  db.prepare(`
    INSERT INTO crew_members (id, name, email, phone, role, pay_rate, pay_type, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    body.name,
    body.email ?? null,
    body.phone ?? null,
    body.role ?? 'cleaner',
    body.pay_rate ?? null,
    body.pay_type ?? 'hourly',
    body.status ?? 'active',
    body.notes ?? null,
    now,
    now,
  );

  const data = db.prepare('SELECT * FROM crew_members WHERE id = ?').get(id);
  return NextResponse.json({ data }, { status: 201 });
}
