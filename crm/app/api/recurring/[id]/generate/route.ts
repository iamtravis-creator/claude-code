import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { randomUUID } from 'crypto';
import { RecurringSchedule } from '@/lib/types';

type Params = { params: { id: string } };

// Compute all dates in the lookahead window that fall on the schedule's cadence,
// starting from today (or start_date, whichever is later).
function computeDates(schedule: RecurringSchedule, lookaheadDays: number): string[] {
  const dates: string[] = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const windowEnd = new Date(today);
  windowEnd.setDate(windowEnd.getDate() + lookaheadDays);

  const schedEnd = schedule.end_date ? new Date(schedule.end_date + 'T00:00:00') : null;
  const effectiveEnd = schedEnd && schedEnd < windowEnd ? schedEnd : windowEnd;

  const startDate = new Date(schedule.start_date + 'T00:00:00');
  const rangeStart = startDate > today ? startDate : today;

  if (schedule.frequency === 'weekly' || schedule.frequency === 'biweekly') {
    const step = schedule.frequency === 'weekly' ? 7 : 14;
    const dow = schedule.day_of_week ?? 1; // Monday default

    // First occurrence of `dow` on or after start_date
    const firstFromStart = new Date(startDate);
    const daysUntil = (dow - firstFromStart.getDay() + 7) % 7;
    firstFromStart.setDate(firstFromStart.getDate() + daysUntil);

    // Advance firstFromStart to the first occurrence >= rangeStart
    // while staying on the correct cadence
    const msPerStep = step * 24 * 60 * 60 * 1000;
    let cur = new Date(firstFromStart);
    if (cur < rangeStart) {
      const stepsNeeded = Math.ceil(
        (rangeStart.getTime() - cur.getTime()) / msPerStep,
      );
      cur = new Date(cur.getTime() + stepsNeeded * msPerStep);
    }

    while (cur <= effectiveEnd) {
      dates.push(cur.toISOString().slice(0, 10));
      cur = new Date(cur.getTime() + msPerStep);
    }
  } else if (schedule.frequency === 'monthly') {
    const dom = schedule.day_of_month ?? 1;

    let year = rangeStart.getFullYear();
    let month = rangeStart.getMonth();

    // Safety cap at 36 months
    for (let i = 0; i < 36; i++) {
      // Clamp to last day of month (e.g. day 31 in Feb → Feb 28/29)
      const lastDay = new Date(year, month + 1, 0).getDate();
      const day = Math.min(dom, lastDay);
      const candidate = new Date(year, month, day);

      if (candidate > effectiveEnd) break;
      if (candidate >= rangeStart) {
        dates.push(candidate.toISOString().slice(0, 10));
      }

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
  }

  return dates;
}

export async function POST(req: NextRequest, { params }: Params) {
  const db = getDb();
  const { id } = params;

  const schedule = db.prepare(`
    SELECT rs.*, c.name AS contact_name, s.name AS service_name
    FROM recurring_schedules rs
    LEFT JOIN contacts c ON c.id = rs.contact_id
    LEFT JOIN services s ON s.id = rs.service_id
    WHERE rs.id = ?
  `).get(id) as (RecurringSchedule & { contact_name?: string; service_name?: string }) | undefined;

  if (!schedule) {
    return NextResponse.json({ error: 'Recurring schedule not found' }, { status: 404 });
  }
  if (!schedule.active) {
    return NextResponse.json({ error: 'Schedule is inactive — activate it first' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({})) as { lookahead_days?: number };
  const lookaheadDays = Number(body.lookahead_days) || 56; // 8 weeks default

  const allDates = computeDates(schedule, lookaheadDays);

  // Dates that already have a job linked to this schedule
  const existingDates = new Set<string>(
    (db.prepare('SELECT scheduled_date FROM jobs WHERE recurring_schedule_id = ?')
      .all(id) as { scheduled_date: string }[])
      .map(r => r.scheduled_date),
  );

  const newDates = allDates.filter(d => !existingDates.has(d));

  if (newDates.length === 0) {
    return NextResponse.json({
      data: { created: 0, dates: [], message: 'All dates in the window already have jobs.' },
    });
  }

  const now = new Date().toISOString();

  const jobTitle = schedule.service_name
    ? `${schedule.service_name}${schedule.contact_name ? ` — ${schedule.contact_name}` : ''}`
    : schedule.title;

  const insertJob = db.prepare(`
    INSERT INTO jobs (
      id, title, contact_id, property_id, service_id, recurring_schedule_id,
      status, scheduled_date, start_time, estimated_hours, price,
      notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 'scheduled', ?, ?, ?, ?, ?, ?, ?)
  `);

  const createAll = db.transaction(() => {
    for (const date of newDates) {
      insertJob.run(
        randomUUID(),
        jobTitle,
        schedule.contact_id ?? null,
        schedule.property_id ?? null,
        schedule.service_id ?? null,
        schedule.id,
        date,
        schedule.start_time ?? null,
        schedule.estimated_hours ?? null,
        schedule.price ?? null,
        schedule.notes ?? null,
        now,
        now,
      );
    }
  });

  createAll();

  return NextResponse.json({ data: { created: newDates.length, dates: newDates } });
}
