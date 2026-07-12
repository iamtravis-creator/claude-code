import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

type Params = { params: { id: string } };

const INV_JOIN = `
  SELECT i.*, c.name AS contact_name, j.title AS job_title
  FROM invoices i LEFT JOIN contacts c ON c.id = i.contact_id LEFT JOIN jobs j ON j.id = i.job_id WHERE i.id = ?`;

export async function GET(_req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: INV_JOIN, args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC', args: [params.id] });
  return NextResponse.json({ data: { ...rows[0], items } });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { id } = params;
  const body = await req.json();
  const now = new Date().toISOString();

  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM invoices WHERE id = ?', args: [id] });
  if (!existing[0]) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

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
      sql: `UPDATE invoices SET
        contact_id = COALESCE(?, contact_id), job_id = COALESCE(?, job_id),
        status = COALESCE(?, status), issue_date = COALESCE(?, issue_date),
        due_date = COALESCE(?, due_date), subtotal = COALESCE(?, subtotal),
        tax_rate = COALESCE(?, tax_rate), tax_amount = COALESCE(?, tax_amount),
        total = COALESCE(?, total), amount_paid = COALESCE(?, amount_paid),
        payment_date = COALESCE(?, payment_date), payment_method = COALESCE(?, payment_method),
        notes = COALESCE(?, notes), updated_at = ? WHERE id = ?`,
      args: [
        body.contact_id ?? null, body.job_id ?? null, body.status ?? null,
        body.issue_date ?? null, body.due_date ?? null, subtotal ?? null,
        body.tax_rate ?? null, tax_amount ?? null, total ?? null,
        body.amount_paid ?? null, body.payment_date ?? null, body.payment_method ?? null,
        body.notes ?? null, now, id,
      ],
    },
  ];

  if (Array.isArray(body.items)) {
    stmts.push({ sql: 'DELETE FROM invoice_items WHERE invoice_id = ?', args: [id] });
    for (const item of body.items) {
      stmts.push({
        sql: 'INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        args: [randomUUID(), id, item.description, item.quantity ?? 1, item.unit_price, item.total, now],
      });
    }
  }

  await db.batch(stmts, 'write');

  const { rows } = await db.execute({ sql: INV_JOIN, args: [id] });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC', args: [id] });
  return NextResponse.json({ data: { ...rows[0], items } });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = await getDb();
  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM invoices WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  await db.execute({ sql: 'DELETE FROM invoices WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
