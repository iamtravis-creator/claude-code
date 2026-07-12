import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: 'SELECT * FROM crew_members WHERE id = ?', args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });
  return NextResponse.json({ data: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM crew_members WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });

  await db.execute({
    sql: `UPDATE crew_members SET
      name = COALESCE(?, name), email = COALESCE(?, email), phone = COALESCE(?, phone),
      role = COALESCE(?, role), pay_rate = COALESCE(?, pay_rate), pay_type = COALESCE(?, pay_type),
      status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?`,
    args: [
      body.name ?? null, body.email ?? null, body.phone ?? null,
      body.role ?? null, body.pay_rate ?? null, body.pay_type ?? null,
      body.status ?? null, body.notes ?? null, now, params.id,
    ],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM crew_members WHERE id = ?', args: [params.id] });
  return NextResponse.json({ data: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM crew_members WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });
  await db.execute({ sql: 'DELETE FROM crew_members WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
