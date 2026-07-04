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
      q.*,
      c.name    AS contact_name,
      p.address AS property_address,
      p.city    AS property_city,
      p.state   AS property_state
    FROM quotes q
    LEFT JOIN contacts   c ON c.id = q.contact_id
    LEFT JOIN properties p ON p.id = q.property_id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) {
    sql += ' AND q.contact_id = ?';
    params.push(contact_id);
  }
  if (status) {
    sql += ' AND q.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY q.created_at DESC';

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

  // Auto-generate quote_number: QTE-XXXX
  const countRow = db.prepare('SELECT COUNT(*) AS cnt FROM quotes').get() as { cnt: number };
  const seq = (countRow.cnt + 1).toString().padStart(4, '0');
  const quote_number = `QTE-${seq}`;

  const insertQuote = db.prepare(`
    INSERT INTO quotes (
      id, quote_number, contact_id, property_id, service_id,
      status, valid_until,
      subtotal, tax_rate, tax_amount, total,
      notes, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `);

  const insertItem = db.prepare(`
    INSERT INTO quote_items (id, quote_id, description, quantity, unit_price, total, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const transact = db.transaction(() => {
    insertQuote.run(
      id,
      quote_number,
      body.contact_id,
      body.property_id ?? null,
      body.service_id ?? null,
      body.status ?? 'draft',
      body.valid_until ?? null,
      body.subtotal ?? 0,
      body.tax_rate ?? 0,
      body.tax_amount ?? 0,
      body.total ?? 0,
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

  const quote = db.prepare(`
    SELECT
      q.*,
      c.name    AS contact_name,
      p.address AS property_address,
      p.city    AS property_city,
      p.state   AS property_state
    FROM quotes q
    LEFT JOIN contacts   c ON c.id = q.contact_id
    LEFT JOIN properties p ON p.id = q.property_id
    WHERE q.id = ?
  `).get(id) as Record<string, unknown>;

  const items = db.prepare(
    'SELECT * FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC'
  ).all(id);

  return NextResponse.json({ data: { ...quote, items } }, { status: 201 });
}
