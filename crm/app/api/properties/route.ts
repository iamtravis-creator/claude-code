import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const type = searchParams.get('type') || '';

  let sql = `
    SELECT p.*, c.name AS contact_name
    FROM properties p
    LEFT JOIN contacts c ON c.id = p.contact_id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) {
    sql += ' AND p.contact_id = ?';
    params.push(contact_id);
  }
  if (type) {
    sql += ' AND p.type = ?';
    params.push(type);
  }
  sql += ' ORDER BY p.created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();

  if (!body.name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!body.address) return NextResponse.json({ error: 'address is required' }, { status: 400 });

  const id = randomUUID();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO properties (
      id, name, contact_id, address, city, state, zip, type,
      size_sqft, bedrooms, bathrooms, entry_method, entry_code,
      alarm_code, pets, parking, special_instructions, active,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?
    )
  `).run(
    id,
    body.name,
    body.contact_id ?? null,
    body.address,
    body.city ?? null,
    body.state ?? null,
    body.zip ?? null,
    body.type ?? null,
    body.size_sqft ?? null,
    body.bedrooms ?? null,
    body.bathrooms ?? null,
    body.entry_method ?? null,
    body.entry_code ?? null,
    body.alarm_code ?? null,
    body.pets ?? null,
    body.parking ?? null,
    body.special_instructions ?? null,
    body.active ?? 1,
    now,
    now,
  );

  const data = db.prepare(`
    SELECT p.*, c.name AS contact_name
    FROM properties p
    LEFT JOIN contacts c ON c.id = p.contact_id
    WHERE p.id = ?
  `).get(id);

  return NextResponse.json({ data }, { status: 201 });
}
