import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;

  const invoice = db.prepare(`
    SELECT
      i.*,
      c.name  AS contact_name,
      j.title AS job_title
    FROM invoices i
    LEFT JOIN contacts c ON c.id = i.contact_id
    LEFT JOIN jobs     j ON j.id = i.job_id
    WHERE i.id = ?
  `).get(id) as Record<string, unknown> | undefined;

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  const items = db.prepare(
    'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC'
  ).all(id);

  return NextResponse.json({ data: { ...invoice, items } });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;
  const body = await req.json();
  const now = new Date().toISOString();

  const existing = db.prepare('SELECT id FROM invoices WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // If items are provided, recalculate financials from them
  let subtotal = body.subtotal;
  let tax_amount = body.tax_amount;
  let total = body.total;

  if (Array.isArray(body.items)) {
    subtotal = body.items.reduce(
      (sum: number, item: { total: number }) => sum + (item.total ?? 0),
      0,
    );
    const taxRate = body.tax_rate ?? 0;
    tax_amount = subtotal * (taxRate / 100);
    total = subtotal + tax_amount;
  }

  const updateInvoice = db.prepare(`
    UPDATE invoices SET
      contact_id     = COALESCE(?, contact_id),
      job_id         = COALESCE(?, job_id),
      status         = COALESCE(?, status),
      issue_date     = COALESCE(?, issue_date),
      due_date       = COALESCE(?, due_date),
      subtotal       = COALESCE(?, subtotal),
      tax_rate       = COALESCE(?, tax_rate),
      tax_amount     = COALESCE(?, tax_amount),
      total          = COALESCE(?, total),
      amount_paid    = COALESCE(?, amount_paid),
      payment_date   = COALESCE(?, payment_date),
      payment_method = COALESCE(?, payment_method),
      notes          = COALESCE(?, notes),
      updated_at     = ?
    WHERE id = ?
  `);

  const deleteItems = db.prepare('DELETE FROM invoice_items WHERE invoice_id = ?');

  const insertItem = db.prepare(`
    INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transact = db.transaction(() => {
    updateInvoice.run(
      body.contact_id ?? null,
      body.job_id ?? null,
      body.status ?? null,
      body.issue_date ?? null,
      body.due_date ?? null,
      subtotal ?? null,
      body.tax_rate ?? null,
      tax_amount ?? null,
      total ?? null,
      body.amount_paid ?? null,
      body.payment_date ?? null,
      body.payment_method ?? null,
      body.notes ?? null,
      now,
      id,
    );

    if (Array.isArray(body.items)) {
      deleteItems.run(id);
      for (const item of body.items) {
        insertItem.run(
          randomUUID(),
          id,
          item.description,
          item.quantity ?? 1,
          item.unit_price,
          item.total,
          now,
        );
      }
    }
  });

  transact();

  const invoice = db.prepare(`
    SELECT
      i.*,
      c.name  AS contact_name,
      j.title AS job_title
    FROM invoices i
    LEFT JOIN contacts c ON c.id = i.contact_id
    LEFT JOIN jobs     j ON j.id = i.job_id
    WHERE i.id = ?
  `).get(id) as Record<string, unknown>;

  const items = db.prepare(
    'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC'
  ).all(id);

  return NextResponse.json({ data: { ...invoice, items } });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;

  const existing = db.prepare('SELECT id FROM invoices WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  // invoice_items will cascade delete via FK constraint
  db.prepare('DELETE FROM invoices WHERE id = ?').run(id);

  return NextResponse.json({ success: true });
}
