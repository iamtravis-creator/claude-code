import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);

  const contact_id = searchParams.get('contact_id') || '';
  const active = searchParams.get('active') || '';

  let sql = `
    SELECT
      rs.*,
      c.name    AS contact_name,
      p.address AS property_address,
      p.city    AS property_city,
      p.state   AS property_state,
      s.name    AS service_name,
      s.category AS service_category
    FROM recurring_schedules rs
    LEFT JOIN contacts   c ON c.id = rs.contact_id
    LEFT JOIN properties p ON p.id = rs.property_id
    LEFT JOIN services   s ON s.id = rs.service_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (contact_id) {
    sql += ' AND rs.contact_id = ?';
    params.push(contact_id);
  }
  if (active !== '') {
    // Accept "true"/"1" as active=1, "false"/"0" as active=0
    const activeVal = active === 'true' || active === '1' ? 1 : 0;
    sql += ' AND rs.active = ?';
    params.push(activeVal);
  }

  sql += ' ORDER BY rs.start_date ASC, rs.created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.contact_id) {
    return NextResponse.json({ error: 'contact_id is required' }, { status: 400 });
  }
  if (!body.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (!body.frequency) {
    return NextResponse.json({ error: 'frequency is required' }, { status: 400 });
  }
  if (!body.start_date) {
    return NextResponse.json({ error: 'start_date is required' }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO recurring_schedules (
      id, contact_id, property_id, service_id,
      title, frequency, day_of_week, day_of_month,
      start_date, end_date, start_time,
      estimated_hours, price, active,
      notes, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )
  `).run(
    id,
    body.contact_id,
    body.property_id ?? null,
    body.service_id ?? null,
    body.title,
    body.frequency,
    body.day_of_week ?? null,
    body.day_of_month ?? null,
    body.start_date,
    body.end_date ?? null,
    body.start_time ?? null,
    body.estimated_hours ?? null,
    body.price ?? null,
    body.active !== undefined ? (body.active ? 1 : 0) : 1,
    body.notes ?? null,
    now,
    now,
  );

  const schedule = db.prepare(`
    SELECT
      rs.*,
      c.name    AS contact_name,
      p.address AS property_address,
      p.city    AS property_city,
      p.state   AS property_state,
      s.name    AS service_name,
      s.category AS service_category
    FROM recurring_schedules rs
    LEFT JOIN contacts   c ON c.id = rs.contact_id
    LEFT JOIN properties p ON p.id = rs.property_id
    LEFT JOIN services   s ON s.id = rs.service_id
    WHERE rs.id = ?
  `).get(id);

  return NextResponse.json({ data: schedule }, { status: 201 });
}
