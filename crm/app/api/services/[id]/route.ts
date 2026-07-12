import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: 'SELECT * FROM services WHERE id = ?', args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: rows[0] });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const fields = ['name', 'description', 'category', 'base_price', 'price_per_sqft', 'estimated_hours', 'active'];
  const updatable = fields.filter(f => f in body);
  if (!updatable.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  await db.execute({
    sql: `UPDATE services SET ${updatable.map(f => `${f} = ?`).join(', ')}, updated_at = ? WHERE id = ?`,
    args: [...updatable.map(f => body[f] ?? null), now, params.id],
  });

  const { rows } = await db.execute({ sql: 'SELECT * FROM services WHERE id = ?', args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: rows[0] });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM services WHERE id = ?', args: [params.id] });
  return NextResponse.json({ data: null });
}
