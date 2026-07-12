import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

const JOIN = `SELECT d.*, c.name as contact_name FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE d.id = ?`;

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const stage = searchParams.get('stage') || '';

  let sql = `SELECT d.*, c.name as contact_name FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE 1=1`;
  const args: string[] = [];

  if (contact_id) { sql += ' AND d.contact_id = ?'; args.push(contact_id); }
  if (stage) { sql += ' AND d.stage = ?'; args.push(stage); }
  sql += ' ORDER BY d.created_at DESC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  await db.execute({
    sql: `INSERT INTO deals (id, title, contact_id, value, currency, stage, probability, close_date, description, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, body.title, body.contact_id ?? null, body.value ?? null,
      body.currency ?? 'USD', body.stage ?? 'lead',
      body.probability ?? null, body.close_date ?? null, body.description ?? null,
      now, now,
    ],
  });

  const { rows } = await db.execute({ sql: JOIN, args: [id] });
  return NextResponse.json({ data: rows[0] }, { status: 201 });
}
