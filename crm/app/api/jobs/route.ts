import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);

  const contact_id = searchParams.get('contact_id') || '';
  const date = searchParams.get('date') || '';
  const date_from = searchParams.get('date_from') || '';
  const date_to = searchParams.get('date_to') || '';
  const status = searchParams.get('status') || '';
  const crew_id = searchParams.get('crew_id') || '';

  let sql = `
    SELECT
      j.*,
      c.name   AS contact_name,
      p.address AS property_address,
      s.name   AS service_name
    FROM jobs j
    LEFT JOIN contacts   c ON c.id = j.contact_id
    LEFT JOIN properties p ON p.id = j.property_id
    LEFT JOIN services   s ON s.id = j.service_id
    WHERE 1=1
  `;
  const params: string[] = [];

  if (contact_id) {
    sql += ' AND j.contact_id = ?';
    params.push(contact_id);
  }
  if (date) {
    sql += ' AND j.scheduled_date = ?';
    params.push(date);
  }
  if (date_from) {
    sql += ' AND j.scheduled_date >= ?';
    params.push(date_from);
  }
  if (date_to) {
    sql += ' AND j.scheduled_date <= ?';
    params.push(date_to);
  }
  if (status) {
    sql += ' AND j.status = ?';
    params.push(status);
  }
  if (crew_id) {
    sql += ' AND j.id IN (SELECT job_id FROM job_crew WHERE crew_member_id = ?)';
    params.push(crew_id);
  }

  sql += ' ORDER BY j.scheduled_date ASC, j.start_time ASC';

  const jobs = db.prepare(sql).all(...params) as Record<string, unknown>[];

  // Attach crew array to each job
  const crewStmt = db.prepare(`
    SELECT cm.*, jc.role AS job_role
    FROM job_crew jc
    JOIN crew_members cm ON cm.id = jc.crew_member_id
    WHERE jc.job_id = ?
  `);

  const data = jobs.map((job) => ({
    ...job,
    crew: crewStmt.all(job.id as string),
  }));

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  const body = await req.json();
  const now = new Date().toISOString();
  const id = randomUUID();

  if (!body.scheduled_date) {
    return NextResponse.json({ error: 'scheduled_date is required' }, { status: 400 });
  }

  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, contact_id, property_id, service_id, recurring_schedule_id,
      status, scheduled_date, start_time, end_time,
      estimated_hours, actual_hours, price, tip,
      notes, completion_notes, rating,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?
    )
  `);

  const insertCrewMember = db.prepare(`
    INSERT OR IGNORE INTO job_crew (id, job_id, crew_member_id, role, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  const transact = db.transaction(() => {
    insertJob.run(
      id,
      body.title ?? 'Cleaning Job',
      body.contact_id ?? null,
      body.property_id ?? null,
      body.service_id ?? null,
      body.recurring_schedule_id ?? null,
      body.status ?? 'scheduled',
      body.scheduled_date,
      body.start_time ?? null,
      body.end_time ?? null,
      body.estimated_hours ?? null,
      body.actual_hours ?? null,
      body.price ?? null,
      body.tip ?? 0,
      body.notes ?? null,
      body.completion_notes ?? null,
      body.rating ?? null,
      now,
      now,
    );

    if (Array.isArray(body.crew_ids)) {
      for (const crew_member_id of body.crew_ids) {
        insertCrewMember.run(randomUUID(), id, crew_member_id, 'cleaner', now);
      }
    }
  });

  transact();

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
  `).get(id) as Record<string, unknown>;

  const crew = db.prepare(`
    SELECT cm.*, jc.role AS job_role
    FROM job_crew jc
    JOIN crew_members cm ON cm.id = jc.crew_member_id
    WHERE jc.job_id = ?
  `).all(id);

  const data = { ...job, crew };
  return NextResponse.json({ data }, { status: 201 });
}
