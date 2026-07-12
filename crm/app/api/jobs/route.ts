import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

const JOB_JOIN_BY_ID = `
  SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
  FROM jobs j
  LEFT JOIN contacts c ON c.id = j.contact_id
  LEFT JOIN properties p ON p.id = j.property_id
  LEFT JOIN services s ON s.id = j.service_id
  WHERE j.id = ?`;

const CREW_FOR_JOB = `
  SELECT cm.*, jc.role AS job_role FROM job_crew jc
  JOIN crew_members cm ON cm.id = jc.crew_member_id WHERE jc.job_id = ?`;

export async function GET(req: NextRequest) {
  const db = await getDb();
  const { searchParams } = new URL(req.url);

  const contact_id = searchParams.get('contact_id') || '';
  const date = searchParams.get('date') || '';
  const date_from = searchParams.get('date_from') || '';
  const date_to = searchParams.get('date_to') || '';
  const status = searchParams.get('status') || '';
  const crew_id = searchParams.get('crew_id') || '';

  let sql = `SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
    FROM jobs j
    LEFT JOIN contacts c ON c.id = j.contact_id
    LEFT JOIN properties p ON p.id = j.property_id
    LEFT JOIN services s ON s.id = j.service_id WHERE 1=1`;
  const args: string[] = [];

  if (contact_id) { sql += ' AND j.contact_id = ?'; args.push(contact_id); }
  if (date) { sql += ' AND j.scheduled_date = ?'; args.push(date); }
  if (date_from) { sql += ' AND j.scheduled_date >= ?'; args.push(date_from); }
  if (date_to) { sql += ' AND j.scheduled_date <= ?'; args.push(date_to); }
  if (status) { sql += ' AND j.status = ?'; args.push(status); }
  if (crew_id) { sql += ' AND j.id IN (SELECT job_id FROM job_crew WHERE crew_member_id = ?)'; args.push(crew_id); }
  sql += ' ORDER BY j.scheduled_date ASC, j.start_time ASC';

  const { rows: jobs } = await db.execute({ sql, args });

  const data = await Promise.all(
    jobs.map(async job => {
      const { rows: crew } = await db.execute({ sql: CREW_FOR_JOB, args: [job.id as string] });
      return { ...job, crew };
    }),
  );

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.scheduled_date) {
    return NextResponse.json({ error: 'scheduled_date is required' }, { status: 400 });
  }

  const crewIds: string[] = Array.isArray(body.crew_ids) ? body.crew_ids : [];

  await db.batch([
    {
      sql: `INSERT INTO jobs (
        id, title, contact_id, property_id, service_id, recurring_schedule_id,
        status, scheduled_date, start_time, end_time,
        estimated_hours, actual_hours, price, tip,
        notes, completion_notes, rating, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id, body.title ?? 'Cleaning Job',
        body.contact_id ?? null, body.property_id ?? null,
        body.service_id ?? null, body.recurring_schedule_id ?? null,
        body.status ?? 'scheduled', body.scheduled_date,
        body.start_time ?? null, body.end_time ?? null,
        body.estimated_hours ?? null, body.actual_hours ?? null,
        body.price ?? null, body.tip ?? 0,
        body.notes ?? null, body.completion_notes ?? null, body.rating ?? null,
        now, now,
      ],
    },
    ...crewIds.map(crew_member_id => ({
      sql: 'INSERT OR IGNORE INTO job_crew (id, job_id, crew_member_id, role, created_at) VALUES (?, ?, ?, ?, ?)',
      args: [randomUUID(), id, crew_member_id, 'cleaner', now],
    })),
  ], 'write');

  const { rows: jobRows } = await db.execute({ sql: JOB_JOIN_BY_ID, args: [id] });
  const { rows: crew } = await db.execute({ sql: CREW_FOR_JOB, args: [id] });
  return NextResponse.json({ data: { ...jobRows[0], crew } }, { status: 201 });
}
