import Link from 'next/link';
import { getDb } from '@/lib/db';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Badge from '@/components/ui/Badge';
import { NoteWithRefs, TaskWithRefs } from '@/lib/types';

function getDashboardData() {
  const db = getDb();

  const contact_count = (db.prepare("SELECT COUNT(*) as c FROM contacts").get() as { c: number }).c;
  const open_deal_count = (db.prepare("SELECT COUNT(*) as c FROM deals WHERE stage NOT IN ('won','lost')").get() as { c: number }).c;

  const today = new Date().toISOString().split('T')[0];
  const tasks_due_today = (db.prepare("SELECT COUNT(*) as c FROM tasks WHERE due_date = ? AND status NOT IN ('done','cancelled')").get(today) as { c: number }).c;

  const month_start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const won_this_month = (db.prepare("SELECT COUNT(*) as c FROM deals WHERE stage = 'won' AND updated_at >= ?").get(month_start) as { c: number }).c;

  const week_later = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const upcoming_tasks = db.prepare(`
    SELECT t.*, c.name as contact_name, d.title as deal_title
    FROM tasks t
    LEFT JOIN contacts c ON t.contact_id = c.id
    LEFT JOIN deals d ON t.deal_id = d.id
    WHERE t.status NOT IN ('done','cancelled') AND t.due_date IS NOT NULL AND t.due_date <= ?
    ORDER BY t.due_date ASC
    LIMIT 10
  `).all(week_later) as TaskWithRefs[];

  const recent_notes = db.prepare(`
    SELECT n.*, c.name as contact_name, d.title as deal_title
    FROM notes n
    LEFT JOIN contacts c ON n.contact_id = c.id
    LEFT JOIN deals d ON n.deal_id = d.id
    ORDER BY n.created_at DESC
    LIMIT 10
  `).all() as NoteWithRefs[];

  return { contact_count, open_deal_count, tasks_due_today, won_this_month, upcoming_tasks, recent_notes };
}

function isOverdue(due_date: string) {
  return new Date(due_date) < new Date(new Date().toDateString());
}

export default function DashboardPage() {
  const { contact_count, open_deal_count, tasks_due_today, won_this_month, upcoming_tasks, recent_notes } = getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Contacts" value={contact_count} />
        <StatCard label="Open Deals" value={open_deal_count} color="text-blue-600" />
        <StatCard
          label="Tasks Due Today"
          value={tasks_due_today}
          color={tasks_due_today > 0 ? 'text-orange-600' : 'text-gray-900'}
        />
        <StatCard label="Won This Month" value={won_this_month} color="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Upcoming Tasks</h2>
            <Link href="/tasks" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          {upcoming_tasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming tasks this week</p>
          ) : (
            <div className="space-y-2">
              {upcoming_tasks.map(t => (
                <div key={t.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                    {t.contact_name && (
                      <Link href={`/contacts/${t.contact_id}`} className="text-xs text-blue-600 hover:underline">{t.contact_name}</Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge value={t.priority} />
                    <span className={`text-xs ${t.due_date && isOverdue(t.due_date) ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                      {t.due_date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/notes" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <RecentActivity notes={recent_notes} />
        </div>
      </div>
    </div>
  );
}
