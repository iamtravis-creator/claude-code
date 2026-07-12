import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const JOIN = `SELECT t.*, c.name as contact_name, d.title as deal_title
  FROM tasks t LEFT JOIN contacts c ON t.contact_id = c.id LEFT JOIN deals d ON t.deal_id = d.id WHERE t.id = ?`;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: JOIN, args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = ['title', 'description', 'status', 'priority', 'due_date', 'contact_id', 'deal_id'];
  const updatable = fields.filter(f => f in body);
  if (!updatable.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  await db.execute({
    sql: `UPDATE tasks SET ${updatable.map(f => `${f} = ?`).join(', ')}, updated_at = ? WHERE id = ?`,
    args: [...updatable.map(f => body[f] ?? null), now, params.id],
  });

  const { rows } = await db.execute({ sql: JOIN, args: [params.id] });
  return NextResponse.json({ data: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [params.id] });
  return NextResponse.json({ data: null });
}
