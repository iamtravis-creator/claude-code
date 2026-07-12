import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: 'SELECT * FROM contacts WHERE id = ?', args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const dealCount = await db.execute({ sql: 'SELECT COUNT(*) AS c FROM deals WHERE contact_id = ?', args: [params.id] });
  const taskCount = await db.execute({ sql: "SELECT COUNT(*) AS c FROM tasks WHERE contact_id = ? AND status NOT IN ('done','cancelled')", args: [params.id] });

  return NextResponse.json({ data: { ...rows[0], deal_count: dealCount.rows[0].c, open_task_count: taskCount.rows[0].c } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = ['name', 'email', 'phone', 'company', 'job_title', 'status', 'source', 'notes_text'];
  const updatable = fields.filter(f => f in body);
  if (!updatable.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  const setClauses = updatable.map(f => `${f} = ?`).join(', ');
  const values = updatable.map(f => body[f] ?? null);

  await db.execute({
    sql: `UPDATE contacts SET ${setClauses}, updated_at = ? WHERE id = ?`,
    args: [...values, now, params.id],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM contacts WHERE id = ?', args: [params.id] });
  return NextResponse.json({ data: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM contacts WHERE id = ?', args: [params.id] });
  return NextResponse.json({ data: null });
}
