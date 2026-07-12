import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || '';
  const active = searchParams.get('active') || '';

  let sql = 'SELECT * FROM services WHERE 1=1';
  const args: (string | number)[] = [];

  if (category) { sql += ' AND category = ?'; args.push(category); }
  if (active !== '') {
    sql += ' AND active = ?';
    args.push(active === 'true' || active === '1' ? 1 : 0);
  }
  sql += ' ORDER BY name ASC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();

  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (body.base_price === undefined || body.base_price === null) {
    return NextResponse.json({ error: 'base_price is required' }, { status: 400 });
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO services (id, name, description, category, base_price, price_per_sqft, estimated_hours, active, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, body.name, body.description ?? null, body.category ?? null, body.base_price,
      body.price_per_sqft ?? null, body.estimated_hours ?? null, body.active ?? 1, now, now,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM services WHERE id = ?', args: [id] });
  return NextResponse.json({ data: rows[0] }, { status: 201 });
}
