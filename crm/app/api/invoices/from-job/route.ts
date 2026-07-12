import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  if (!body.job_id) return NextResponse.json({ error: 'job_id is required' }, { status: 400 });

  const { rows: jobRows } = await db.execute({
    sql: `SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
          FROM jobs j
          LEFT JOIN contacts c ON c.id = j.contact_id
          LEFT JOIN properties p ON p.id = j.property_id
          LEFT JOIN services s ON s.id = j.service_id WHERE j.id = ?`,
    args: [body.job_id],
  });

  const job = jobRows[0];
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  if (!job.contact_id) return NextResponse.json({ error: 'Job has no associated contact' }, { status: 422 });

  const today = new Date();
  const issueDate = today.toISOString().split('T')[0];
  const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const serviceLabel = job.service_name ? ` - ${job.service_name}` : '';
  const itemDescription = `${job.title}${serviceLabel}`;
  const unitPrice = (job.price as number) ?? 0;

  const invoiceId = randomUUID();
  const itemId = randomUUID();

  const tx = await db.transaction('write');
  try {
    const countResult = await tx.execute('SELECT COUNT(*) AS cnt FROM invoices');
    const seq = (Number(countResult.rows[0].cnt) + 1).toString().padStart(4, '0');
    const invoice_number = `INV-${seq}`;

    await tx.execute({
      sql: `INSERT INTO invoices (id, invoice_number, contact_id, job_id, status,
              issue_date, due_date, subtotal, tax_rate, tax_amount, total,
              amount_paid, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, 0, 0, ?, 0, ?, ?)`,
      args: [invoiceId, invoice_number, job.contact_id as string, body.job_id, issueDate, dueDate, unitPrice, unitPrice, now, now],
    });

    await tx.execute({
      sql: 'INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at) VALUES (?, ?, ?, 1, ?, ?, ?)',
      args: [itemId, invoiceId, itemDescription, unitPrice, unitPrice, now],
    });

    await tx.execute({
      sql: "UPDATE jobs SET status = 'invoiced', updated_at = ? WHERE id = ?",
      args: [now, body.job_id],
    });

    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }

  const { rows } = await db.execute({
    sql: `SELECT i.*, c.name AS contact_name, j.title AS job_title
          FROM invoices i LEFT JOIN contacts c ON c.id = i.contact_id LEFT JOIN jobs j ON j.id = i.job_id WHERE i.id = ?`,
    args: [invoiceId],
  });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC', args: [invoiceId] });
  return NextResponse.json({ data: { ...rows[0], items } }, { status: 201 });
}
