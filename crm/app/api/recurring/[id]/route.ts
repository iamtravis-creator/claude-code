import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

type Params = { params: { id: string } };

const selectSchedule = `
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
`;

export async function GET(_req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;

  const schedule = db.prepare(selectSchedule).get(id);

  if (!schedule) {
    return NextResponse.json({ error: 'Recurring schedule not found' }, { status: 404 });
  }

  return NextResponse.json({ data: schedule });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;
  const body = await req.json();
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM recurring_schedules WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Recurring schedule not found' }, { status: 404 });
  }

  // Resolve active flag if provided
  let activeVal: number | null = null;
  if (body.active !== undefined) {
    activeVal = body.active ? 1 : 0;
  }

  db.prepare(`
    UPDATE recurring_schedules SET
      contact_id      = COALESCE(?, contact_id),
      property_id     = COALESCE(?, property_id),
      service_id      = COALESCE(?, service_id),
      title           = COALESCE(?, title),
      frequency       = COALESCE(?, frequency),
      day_of_week     = COALESCE(?, day_of_week),
      day_of_month    = COALESCE(?, day_of_month),
      start_date      = COALESCE(?, start_date),
      end_date        = COALESCE(?, end_date),
      start_time      = COALESCE(?, start_time),
      estimated_hours = COALESCE(?, estimated_hours),
      price           = COALESCE(?, price),
      active          = COALESCE(?, active),
      notes           = COALESCE(?, notes),
      updated_at      = ?
    WHERE id = ?
  `).run(
    body.contact_id ?? null,
    body.property_id ?? null,
    body.service_id ?? null,
    body.title ?? null,
    body.frequency ?? null,
    body.day_of_week ?? null,
    body.day_of_month ?? null,
    body.start_date ?? null,
    body.end_date ?? null,
    body.start_time ?? null,
    body.estimated_hours ?? null,
    body.price ?? null,
    activeVal,
    body.notes ?? null,
    now,
    id,
  );

  const schedule = db.prepare(selectSchedule).get(id);
  return NextResponse.json({ data: schedule });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;

  const existing = db.prepare('SELECT id FROM recurring_schedules WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Recurring schedule not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM recurring_schedules WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}
