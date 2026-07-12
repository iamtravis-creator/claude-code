import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';

  let sql = 'SELECT * FROM crew_members WHERE 1=1';
  const args: string[] = [];

  if (status) { sql += ' AND status = ?'; args.push(status); }
  sql += ' ORDER BY name ASC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  await db.execute({
    sql: `INSERT INTO crew_members (id, name, email, phone, role, pay_rate, pay_type, status, notes, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, body.name, body.email ?? null, body.phone ?? null,
      body.role ?? 'cleaner', body.pay_rate ?? null,
      body.pay_type ?? 'hourly', body.status ?? 'active', body.notes ?? null,
      now, now,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM crew_members WHERE id = ?', args: [id] });
  return NextResponse.json({ data: rows[0] }, { status: 201 });
}
