import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const data = db.prepare('SELECT * FROM crew_members WHERE id = ?').get(params.id);

  if (!data) {
    return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM crew_members WHERE id = ?').get(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });
  }

  db.prepare(`
    UPDATE crew_members
    SET name       = COALESCE(?, name),
        email      = COALESCE(?, email),
        phone      = COALESCE(?, phone),
        role       = COALESCE(?, role),
        pay_rate   = COALESCE(?, pay_rate),
        pay_type   = COALESCE(?, pay_type),
        status     = COALESCE(?, status),
        notes      = COALESCE(?, notes),
        updated_at = ?
    WHERE id = ?
  `).run(
    body.name ?? null,
    body.email ?? null,
    body.phone ?? null,
    body.role ?? null,
    body.pay_rate ?? null,
    body.pay_type ?? null,
    body.status ?? null,
    body.notes ?? null,
    now,
    params.id,
  );

  const data = db.prepare('SELECT * FROM crew_members WHERE id = ?').get(params.id);
  return NextResponse.json({ data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM crew_members WHERE id = ?').get(params.id);
  if (!existing) {
    return NextResponse.json({ error: 'Crew member not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM crew_members WHERE id = ?').run(params.id);
  return NextResponse.json({ success: true });
}
