import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

const JOB_JOIN = `
  SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
  FROM jobs j
  LEFT JOIN contacts c ON c.id = j.contact_id
  LEFT JOIN properties p ON p.id = j.property_id
  LEFT JOIN services s ON s.id = j.service_id WHERE j.id = ?`;

const CREW_FOR_JOB = `
  SELECT cm.*, jc.role AS job_role FROM job_crew jc
  JOIN crew_members cm ON cm.id = jc.crew_member_id WHERE jc.job_id = ?`;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows } = await db.execute({ sql: JOB_JOIN, args: [params.id] });
  if (!rows[0]) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  const { rows: crew } = await db.execute({ sql: CREW_FOR_JOB, args: [params.id] });
  return NextResponse.json({ data: { ...rows[0], crew } });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();

  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM jobs WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const crewIds: string[] | null = Array.isArray(body.crew_ids) ? body.crew_ids : null;

  const stmts: { sql: string; args: (string | number | null)[] }[] = [
    {
      sql: `UPDATE jobs SET
        title = COALESCE(?, title), contact_id = COALESCE(?, contact_id),
        property_id = COALESCE(?, property_id), service_id = COALESCE(?, service_id),
        recurring_schedule_id = COALESCE(?, recurring_schedule_id), status = COALESCE(?, status),
        scheduled_date = COALESCE(?, scheduled_date), start_time = COALESCE(?, start_time),
        end_time = COALESCE(?, end_time), estimated_hours = COALESCE(?, estimated_hours),
        actual_hours = COALESCE(?, actual_hours), price = COALESCE(?, price),
        tip = COALESCE(?, tip), notes = COALESCE(?, notes),
        completion_notes = COALESCE(?, completion_notes), rating = COALESCE(?, rating),
        updated_at = ? WHERE id = ?`,
      args: [
        body.title ?? null, body.contact_id ?? null, body.property_id ?? null,
        body.service_id ?? null, body.recurring_schedule_id ?? null, body.status ?? null,
        body.scheduled_date ?? null, body.start_time ?? null, body.end_time ?? null,
        body.estimated_hours ?? null, body.actual_hours ?? null, body.price ?? null,
        body.tip ?? null, body.notes ?? null, body.completion_notes ?? null,
        body.rating ?? null, now, params.id,
      ],
    },
  ];

  if (crewIds !== null) {
    stmts.push({ sql: 'DELETE FROM job_crew WHERE job_id = ?', args: [params.id] });
    for (const crew_member_id of crewIds) {
      stmts.push({
        sql: 'INSERT OR IGNORE INTO job_crew (id, job_id, crew_member_id, role, created_at) VALUES (?, ?, ?, ?, ?)',
        args: [randomUUID(), params.id, crew_member_id, 'cleaner', now],
      });
    }
  }

  await db.batch(stmts, 'write');

  const { rows } = await db.execute({ sql: JOB_JOIN, args: [params.id] });
  const { rows: crew } = await db.execute({ sql: CREW_FOR_JOB, args: [params.id] });
  return NextResponse.json({ data: { ...rows[0], crew } });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = await getDb();
  const { rows: existing } = await db.execute({ sql: 'SELECT id FROM jobs WHERE id = ?', args: [params.id] });
  if (!existing[0]) return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  await db.execute({ sql: 'DELETE FROM jobs WHERE id = ?', args: [params.id] });
  return NextResponse.json({ success: true });
}
