import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

const INV_JOIN_BY_ID = `
  SELECT i.*, c.name AS contact_name, j.title AS job_title
  FROM invoices i
  LEFT JOIN contacts c ON c.id = i.contact_id
  LEFT JOIN jobs j ON j.id = i.job_id WHERE i.id = ?`;

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const status = searchParams.get('status') || '';

  let sql = `SELECT i.*, c.name AS contact_name, j.title AS job_title
    FROM invoices i LEFT JOIN contacts c ON c.id = i.contact_id LEFT JOIN jobs j ON j.id = i.job_id WHERE 1=1`;
  const args: string[] = [];

  if (contact_id) { sql += ' AND i.contact_id = ?'; args.push(contact_id); }
  if (status) { sql += ' AND i.status = ?'; args.push(status); }
  sql += ' ORDER BY i.created_at DESC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.contact_id) return NextResponse.json({ error: 'contact_id is required' }, { status: 400 });
  if (!body.issue_date) return NextResponse.json({ error: 'issue_date is required' }, { status: 400 });

  const tx = await db.transaction('write');
  try {
    const countResult = await tx.execute('SELECT COUNT(*) AS cnt FROM invoices');
    const seq = (Number(countResult.rows[0].cnt) + 1).toString().padStart(4, '0');
    const invoice_number = `INV-${seq}`;

    await tx.execute({
      sql: `INSERT INTO invoices (id, invoice_number, contact_id, job_id, status,
              issue_date, due_date, subtotal, tax_rate, tax_amount, total,
              amount_paid, payment_date, payment_method, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, invoice_number, body.contact_id, body.job_id ?? null, body.status ?? 'draft',
        body.issue_date, body.due_date ?? null,
        body.subtotal ?? 0, body.tax_rate ?? 0, body.tax_amount ?? 0, body.total ?? 0,
        body.amount_paid ?? 0, body.payment_date ?? null, body.payment_method ?? null,
        body.notes ?? null, now, now,
      ],
    });

    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        await tx.execute({
          sql: 'INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [randomUUID(), id, item.description, item.quantity ?? 1, item.unit_price, item.total, now],
        });
      }
    }

    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }

  const { rows } = await db.execute({ sql: INV_JOIN_BY_ID, args: [id] });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC', args: [id] });
  return NextResponse.json({ data: { ...rows[0], items } }, { status: 201 });
}
