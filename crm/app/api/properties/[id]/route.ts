import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const data = db.prepare(`
    SELECT p.*, c.name AS contact_name
    FROM properties p
    LEFT JOIN contacts c ON c.id = p.contact_id
    WHERE p.id = ?
  `).get(params.id);

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = [
    'name', 'contact_id', 'address', 'city', 'state', 'zip', 'type',
    'size_sqft', 'bedrooms', 'bathrooms', 'entry_method', 'entry_code',
    'alarm_code', 'pets', 'parking', 'special_instructions', 'active',
  ];

  const updatable = fields.filter(f => f in body);
  if (!updatable.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  const setClauses = updatable.map(f => `${f} = ?`).join(', ');
  const values = updatable.map(f => body[f]);

  db.prepare(`UPDATE properties SET ${setClauses}, updated_at = ? WHERE id = ?`).run(...values, now, params.id);

  const data = db.prepare(`
    SELECT p.*, c.name AS contact_name
    FROM properties p
    LEFT JOIN contacts c ON c.id = p.contact_id
    WHERE p.id = ?
  `).get(params.id);

  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  db.prepare('DELETE FROM properties WHERE id = ?').run(params.id);
  return NextResponse.json({ data: null });
}
