import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

type Params = { params: { id: string } };

const QTE_JOIN = `
  SELECT q.*, c.name AS contact_name, p.address AS property_address,
    p.city AS property_city, p.state AS property_state, s.name AS service_name
  FROM quotes q LEFT JOIN contacts c ON c.id = q.contact_id
  LEFT JOIN properties p ON p.id = q.property_id
  LEFT JOIN services s ON s.id = q.service_id WHERE q.id = ?`;

export async function GET(_req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: QTE_JOIN, args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC', args: [params.id] });
  return NextResponse.json({ data: { ...rows[0], items } });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { id } = params;
  const body = await req.json();
  const now = new Date().toISOString();

  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM quotes WHERE id = ?', args: [id] });
  if (!existing[0]) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });

  let subtotal = body.subtotal;
  let tax_amount = body.tax_amount;
  let total = body.total;

  if (Array.isArray(body.items)) {
    subtotal = body.items.reduce((sum: number, item: { total: number }) => sum + (item.total ?? 0), 0);
    const taxRate = body.tax_rate ?? 0;
    tax_amount = subtotal * (taxRate / 100);
    total = subtotal + tax_amount;
  }

  const stmts: { sql: string; args: (string | number | null)[] }[] = [
    {
      sql: `UPDATE quotes SET
        contact_id = COALESCE(?, contact_id), property_id = COALESCE(?, property_id),
        service_id = COALESCE(?, service_id), status = COALESCE(?, status),
        valid_until = COALESCE(?, valid_until), subtotal = COALESCE(?, subtotal),
        tax_rate = COALESCE(?, tax_rate), tax_amount = COALESCE(?, tax_amount),
        total = COALESCE(?, total), notes = COALESCE(?, notes), updated_at = ? WHERE id = ?`,
      args: [
        body.contact_id ?? null, body.property_id ?? null, body.service_id ?? null,
        body.status ?? null, body.valid_until ?? null, subtotal ?? null,
        body.tax_rate ?? null, tax_amount ?? null, total ?? null,
        body.notes ?? null, now, id,
      ],
    },
  ];

  if (Array.isArray(body.items)) {
    stmts.push({ sql: 'DELETE FROM quote_items WHERE quote_id = ?', args: [id] });
    for (const item of body.items) {
      stmts.push({
        sql: 'INSERT INTO quote_items (id, quote_id, description, quantity, unit_price, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [randomUUID(), id, item.description, item.quantity ?? 1, item.unit_price, item.total, now],
      });
    }
  }

  await db.batch(stmts, 'write');

  const { rows } = await db.execute({ sql: QTE_JOIN, args: [id] });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC', args: [id] });
  return NextResponse.json({ data: { ...rows[0], items } });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM quotes WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  await db.execute({ sql: 'DELETE FROM quotes WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
