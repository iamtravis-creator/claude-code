import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const JOIN = `
  SELECT t.*, c.name as contact_name, d.title as deal_title
  FROM tasks t
  LEFT JOIN contacts c ON t.contact_id = c.id
  LEFT JOIN deals d ON t.deal_id = d.id
  WHERE t.id = ?
`;

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

  const fields = ['title', 'description', 'status', 'priority', 'due_date', 'contact_id', 'deal_id'];
  const updates = fields.filter(f => f in body).map(f => `${f} = ?`).join(', ');
  const values = fields.filter(f => f in body).map(f => body[f]);

  if (!updates) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  db.prepare(`UPDATE tasks SET ${updates}, updated_at = ? WHERE id = ?`).run(...values, now, params.id);
  const data = db.prepare(JOIN).get(params.id);
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  db.prepare('DELETE FROM tasks WHERE id = ?').run(params.id);
  return NextResponse.json({ data: null });
}
