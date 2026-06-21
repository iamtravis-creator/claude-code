import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const JOIN = 'SELECT d.*, c.name as contact_name FROM deals d LEFT JOIN contacts c ON d.contact_id = c.id WHERE d.id = ?';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const data = db.prepare(JOIN).get(params.id);
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = ['title', 'contact_id', 'value', 'currency', 'stage', 'probability', 'close_date', 'description'];
  const updates = fields.filter(f => f in body).map(f => `${f} = ?`).join(', ');
  const values = fields.filter(f => f in body).map(f => body[f]);

  if (!updates) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  db.prepare(`UPDATE deals SET ${updates}, updated_at = ? WHERE id = ?`).run(...values, now, params.id);
  const data = db.prepare(JOIN).get(params.id);
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  db.prepare('DELETE FROM deals WHERE id = ?').run(params.id);
  return NextResponse.json({ data: null });
}
