import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);

  const contact_id = searchParams.get('contact_id') || '';
  const status = searchParams.get('status') || '';

  let sql = `
    SELECT
      i.*,
      c.name  AS contact_name,
      j.title AS job_title
    FROM invoices i
    LEFT JOIN contacts c ON c.id = i.contact_id
    LEFT JOIN jobs     j ON j.id = i.job_id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) {
    sql += ' AND i.contact_id = ?';
    params.push(contact_id);
  }
  if (status) {
    sql += ' AND i.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY i.created_at DESC';

  const data = db.prepare(sql).all(...params);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.contact_id) {
    return NextResponse.json({ error: 'contact_id is required' }, { status: 400 });
  }
  if (!body.issue_date) {
    return NextResponse.json({ error: 'issue_date is required' }, { status: 400 });
  }

  // Auto-generate invoice_number: INV-XXXX
  const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM invoices').get() as { cnt: number };
  const seq = (countRow.cnt + 1).toString().padStart(4, '0');
  const invoice_number = `INV-${seq}`;

  const insertInvoice = db.prepare(`
    INSERT INTO invoices (
      id, invoice_number, contact_id, job_id, status,
      issue_date, due_date,
      subtotal, tax_rate, tax_amount, total,
      amount_paid, payment_date, payment_method,
      notes, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertItem = db.prepare(`
    INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transact = db.transaction(() => {
    insertInvoice.run(
      id,
      invoice_number,
      body.contact_id,
      body.job_id ?? null,
      body.status ?? 'draft',
      body.issue_date,
      body.due_date ?? null,
      body.subtotal ?? 0,
      body.tax_rate ?? 0,
      body.tax_amount ?? 0,
      body.total ?? 0,
      body.amount_paid ?? 0,
      body.payment_date ?? null,
      body.payment_method ?? null,
      body.notes ?? null,
      now,
      now,
    );

    if (Array.isArray(body.items)) {
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

  return NextResponse.json({ data: { ...invoice, items } }, { status: 201 });
}
