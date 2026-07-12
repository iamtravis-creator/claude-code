import Link from 'next/link';
import { getDb } from '@/lib/db';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import TodaySchedule from '@/components/dashboard/TodaySchedule';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import RevenueCard from '@/components/dashboard/RevenueCard';
import { JobWithRefs, NoteWithRefs, CrewMember } from '@/lib/types';

function getWeekBounds(): { weekStart: string; weekEnd: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const mon = new Date(now);
  mon.setDate(now.getDate() + diffToMon);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return {
    weekStart: mon.toISOString().split('T')[0],
    weekEnd: sun.toISOString().split('T')[0],
  };
}

function getMonthBounds(): { monthStart: string; monthEnd: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    monthStart: start.toISOString().split('T')[0],
    monthEnd: end.toISOString().split('T')[0],
  };
}

async function getDashboardData() {
  const db = await getDb();
  const today = new Date().toISOString().split('T')[0];
  const { weekStart, weekEnd } = getWeekBounds();
  const { monthStart, monthEnd } = getMonthBounds();

  const [
    contactRes,
    activeJobsRes,
    todayCountRes,
    weekCompleteRes,
    weekRevRes,
    monthRevRes,
    outstandingRes,
  ] = await Promise.all([
    db.execute('SELECT COUNT(*) as c FROM contacts'),
    db.execute("SELECT COUNT(*) as c FROM jobs WHERE status NOT IN ('completed','cancelled','invoiced')"),
    db.execute({ sql: 'SELECT COUNT(*) as c FROM jobs WHERE scheduled_date = ?', args: [today] }),
    db.execute({ sql: "SELECT COUNT(*) as c FROM jobs WHERE status = 'completed' AND scheduled_date >= ? AND scheduled_date <= ?", args: [weekStart, weekEnd] }),
    db.execute({ sql: "SELECT COALESCE(SUM(price),0) as total FROM jobs WHERE status = 'completed' AND scheduled_date >= ? AND scheduled_date <= ?", args: [weekStart, weekEnd] }),
    db.execute({ sql: "SELECT COALESCE(SUM(price),0) as total FROM jobs WHERE status IN ('completed','invoiced') AND scheduled_date >= ? AND scheduled_date <= ?", args: [monthStart, monthEnd] }),
    db.execute("SELECT COALESCE(SUM(total - amount_paid),0) as amount, COUNT(*) as cnt FROM invoices WHERE status IN ('sent','overdue')"),
  ]);

  const contact_count = Number(contactRes.rows[0].c);
  const active_jobs = Number(activeJobsRes.rows[0].c);
  const jobs_today_count = Number(todayCountRes.rows[0].c);
  const completed_this_week = Number(weekCompleteRes.rows[0].c);
  const week_revenue = Number(weekRevRes.rows[0].total);
  const month_revenue = Number(monthRevRes.rows[0].total);
  const outstanding_invoices_amount = Number(outstandingRes.rows[0].amount);
  const outstanding_invoices_count = Number(outstandingRes.rows[0].cnt);

  const { rows: rawTodayJobs } = await db.execute({
    sql: `SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
          FROM jobs j
          LEFT JOIN contacts c ON j.contact_id = c.id
          LEFT JOIN properties p ON j.property_id = p.id
          LEFT JOIN services s ON j.service_id = s.id
          WHERE j.scheduled_date = ? ORDER BY j.start_time`,
    args: [today],
  });

  const todayJobs: JobWithRefs[] = await Promise.all(
    rawTodayJobs.map(async (job) => {
      const { rows: crew } = await db.execute({
        sql: 'SELECT cm.* FROM crew_members cm JOIN job_crew jc ON jc.crew_member_id = cm.id WHERE jc.job_id = ?',
        args: [job.id as string],
      });
      return {
        ...(job as unknown as JobWithRefs),
        scheduled_time: (job.start_time as string | null) ?? undefined,
        crew: crew as unknown as CrewMember[],
      };
    }),
  );

  const { rows: rawUpcoming } = await db.execute({
    sql: `SELECT j.*, c.name AS contact_name, p.address AS property_address, s.name AS service_name
          FROM jobs j
          LEFT JOIN contacts c ON j.contact_id = c.id
          LEFT JOIN properties p ON j.property_id = p.id
          LEFT JOIN services s ON j.service_id = s.id
          WHERE j.scheduled_date > ? ORDER BY j.scheduled_date, j.start_time LIMIT 5`,
    args: [today],
  });

  const upcomingJobs: JobWithRefs[] = rawUpcoming.map(job => ({
    ...(job as unknown as JobWithRefs),
    scheduled_time: (job.start_time as string | null) ?? undefined,
  }));

  const { rows: recent_notes } = await db.execute(
    `SELECT n.*, c.name AS contact_name, d.title AS deal_title
     FROM notes n
     LEFT JOIN contacts c ON n.contact_id = c.id
     LEFT JOIN deals d ON n.deal_id = d.id
     ORDER BY n.created_at DESC LIMIT 8`
  );

  return {
    contact_count,
    active_jobs,
    jobs_today_count,
    completed_this_week,
    week_revenue,
    month_revenue,
    outstanding_invoices_amount,
    outstanding_invoices_count,
    todayJobs,
    upcomingJobs,
    recent_notes: recent_notes as unknown as NoteWithRefs[],
  };
}

export default async function DashboardPage() {
  const {
    contact_count,
    active_jobs,
    jobs_today_count,
    week_revenue,
    month_revenue,
    outstanding_invoices_amount,
    outstanding_invoices_count,
    todayJobs,
    upcomingJobs,
    recent_notes,
  } = await getDashboardData();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Today's Jobs"
          value={jobs_today_count}
          color={jobs_today_count > 0 ? 'text-blue-600' : 'text-gray-900'}
        />
        <StatCard
          label="Active Jobs"
          value={active_jobs}
          color={active_jobs > 0 ? 'text-indigo-600' : 'text-gray-900'}
        />
        <StatCard
          label="Week Revenue"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(week_revenue)}
          color="text-green-700"
        />
        <StatCard
          label="Month Revenue"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(month_revenue)}
          color="text-green-700"
        />
        <StatCard
          label="Outstanding"
          value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(outstanding_invoices_amount)}
          sub={outstanding_invoices_count > 0 ? `${outstanding_invoices_count} invoice${outstanding_invoices_count !== 1 ? 's' : ''}` : undefined}
          color={outstanding_invoices_amount > 0 ? 'text-orange-600' : 'text-gray-400'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Today&apos;s Schedule</h2>
            <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
              View all jobs
            </Link>
          </div>
          <TodaySchedule jobs={todayJobs} />
        </div>

        <div className="lg:col-span-1">
          <RevenueCard
            weekRevenue={week_revenue}
            monthRevenue={month_revenue}
            outstandingAmount={outstanding_invoices_amount}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingJobs jobs={upcomingJobs} />

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/notes" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <RecentActivity notes={recent_notes} />
        </div>
      </div>
    </div>
  );
}
