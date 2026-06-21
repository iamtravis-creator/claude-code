import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(params.id);
  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const deal_count = (db.prepare('SELECT COUNT(*) as c FROM deals WHERE contact_id = ?').get(params.id) as { c: number }).c;
  const open_task_count = (db.prepare("SELECT COUNT(*) as c FROM tasks WHERE contact_id = ? AND status NOT IN ('done','cancelled')").get(params.id) as { c: number }).c;

  return NextResponse.json({ data: { ...contact, deal_count, open_task_count } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = ['name', 'email', 'phone', 'company', 'job_title', 'status', 'source', 'notes_text'];
  const updates = fields.filter(f => f in body).map(f => `${f} = ?`).join(', ');
  const values = fields.filter(f => f in body).map(f => body[f]);

  if (!updates) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  db.prepare(`UPDATE contacts SET ${updates}, updated_at = ? WHERE id = ?`).run(...values, now, params.id);
  const data = db.prepare('SELECT * FROM contacts WHERE id = ?').get(params.id);
  return NextResponse.json({ data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  db.prepare('DELETE FROM contacts WHERE id = ?').run(params.id);
  return NextResponse.json({ data: null });
}
