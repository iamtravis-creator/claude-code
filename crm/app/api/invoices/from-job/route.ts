import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  if (!body.job_id) {
    return NextResponse.json({ error: 'job_id is required' }, { status: 400 });
  }

  // Fetch job with related service, property, and contact info
  const job = db.prepare(`
    SELECT
      j.*,
      c.name    AS contact_name,
      p.address AS property_address,
      s.name    AS service_name
    FROM jobs j
    LEFT JOIN contacts   c ON c.id = j.contact_id
    LEFT JOIN properties p ON p.id = j.property_id
    LEFT JOIN services   s ON s.id = j.service_id
    WHERE j.id = ?
  `).get(body.job_id) as Record<string, unknown> | undefined;

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (!job.contact_id) {
    return NextResponse.json({ error: 'Job has no associated contact' }, { status: 422 });
  }

  // Calculate dates
  const today = new Date();
  const issueDate = today.toISOString().split('T')[0];
  const dueDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  // Build line item description
  const serviceLabel = job.service_name ? ` - ${job.service_name}` : '';
  const itemDescription = `${job.title as string}${serviceLabel}`;
  const unitPrice = (job.price as number) ?? 0;

  // Auto-generate invoice_number: INV-XXXX
  const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM invoices').get() as { cnt: number };
  const seq = (countRow.cnt + 1).toString().padStart(4, '0');
  const invoice_number = `INV-${seq}`;

  const invoiceId = randomUUID();
  const itemId = randomUUID();

  const transact = db.transaction(() => {
    db.prepare(`
      INSERT INTO invoices (
        id, invoice_number, contact_id, job_id, status,
        issue_date, due_date,
        subtotal, tax_rate, tax_amount, total,
        amount_paid, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?
      )
    `).run(
      invoiceId,
      invoice_number,
      job.contact_id as string,
      body.job_id,
      'draft',
      issueDate,
      dueDate,
      unitPrice,
      0,
      0,
      unitPrice,
      0,
      now,
      now,
    );

    db.prepare(`
      INSERT INTO invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(itemId, invoiceId, itemDescription, 1, unitPrice, unitPrice, now);

    // Update the job status to 'invoiced'
    db.prepare(
      "UPDATE jobs SET status = 'invoiced', updated_at = ? WHERE id = ?"
    ).run(now, body.job_id);
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
  `).get(invoiceId) as Record<string, unknown>;

  const items = db.prepare(
    'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY rowid ASC'
  ).all(invoiceId);

  return NextResponse.json({ data: { ...invoice, items } }, { status: 201 });
}
