import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

const QTE_JOIN_BY_ID = `
  SELECT q.*, c.name AS contact_name, p.address AS property_address,
    p.city AS property_city, p.state AS property_state
  FROM quotes q
  LEFT JOIN contacts c ON c.id = q.contact_id
  LEFT JOIN properties p ON p.id = q.property_id WHERE q.id = ?`;

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);
  const contact_id = searchParams.get('contact_id') || '';
  const status = searchParams.get('status') || '';

  let sql = `SELECT q.*, c.name AS contact_name, p.address AS property_address,
    p.city AS property_city, p.state AS property_state
    FROM quotes q LEFT JOIN contacts c ON c.id = q.contact_id
    LEFT JOIN properties p ON p.id = q.property_id WHERE 1=1`;
  const args: string[] = [];

  if (contact_id) { sql += ' AND q.contact_id = ?'; args.push(contact_id); }
  if (status) { sql += ' AND q.status = ?'; args.push(status); }
  sql += ' ORDER BY q.created_at DESC';

  const { rows } = await db.execute({ sql, args });
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.contact_id) return NextResponse.json({ error: 'contact_id is required' }, { status: 400 });

  const tx = await db.transaction('write');
  try {
    const countResult = await tx.execute('SELECT COUNT(*) AS cnt FROM quotes');
    const seq = (Number(countResult.rows[0].cnt) + 1).toString().padStart(4, '0');
    const quote_number = `QTE-${seq}`;

    await tx.execute({
      sql: `INSERT INTO quotes (id, quote_number, contact_id, property_id, service_id,
              status, valid_until, subtotal, tax_rate, tax_amount, total, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, quote_number, body.contact_id, body.property_id ?? null, body.service_id ?? null,
        body.status ?? 'draft', body.valid_until ?? null,
        body.subtotal ?? 0, body.tax_rate ?? 0, body.tax_amount ?? 0, body.total ?? 0,
        body.notes ?? null, now, now,
      ],
    });

    if (Array.isArray(body.items)) {
      for (const item of body.items) {
        await tx.execute({
          sql: 'INSERT INTO quote_items (id, quote_id, description, quantity, unit_price, total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
          args: [randomUUID(), id, item.description, item.quantity ?? 1, item.unit_price, item.total, now],
        });
      }
    }

    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }

  const { rows } = await db.execute({ sql: QTE_JOIN_BY_ID, args: [id] });
  const { rows: items } = await db.execute({ sql: 'SELECT * FROM quote_items WHERE quote_id = ? ORDER BY rowid ASC', args: [id] });
  return NextResponse.json({ data: { ...rows[0], items } }, { status: 201 });
}
