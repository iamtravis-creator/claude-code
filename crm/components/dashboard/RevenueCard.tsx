// ── Types ─────────────────────────────────────────────────────────────────────

interface RevenueCardProps {
  weekRevenue: number;
  monthRevenue: number;
  outstandingAmount: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Icons ────────────────────────────────────────────────────────────────────

function WeekIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function MonthIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function OutstandingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

interface MetricRowProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

function MetricRow({ label, value, icon, iconBg, iconColor, valueColor }: MetricRowProps) {
  return (
    <div className="flex items-center gap-4">
      <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-lg ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={`text-xl font-bold tabular-nums ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function RevenueCard({ weekRevenue, monthRevenue, outstandingAmount }: RevenueCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Revenue</h2>

      <div className="space-y-4">
        <MetricRow
          label="This Week"
          value={formatCurrency(weekRevenue)}
          icon={<WeekIcon />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          valueColor="text-gray-900"
        />

        <div className="border-t border-gray-100" />

        <MetricRow
          label="This Month"
          value={formatCurrency(monthRevenue)}
          icon={<MonthIcon />}
          iconBg="bg-green-50"
          iconColor="text-green-600"
          valueColor="text-green-700"
        />

        <div className="border-t border-gray-100" />

        <MetricRow
          label="Outstanding"
          value={formatCurrency(outstandingAmount)}
          icon={<OutstandingIcon />}
          iconBg={outstandingAmount > 0 ? 'bg-orange-50' : 'bg-gray-50'}
          iconColor={outstandingAmount > 0 ? 'text-orange-500' : 'text-gray-400'}
          valueColor={outstandingAmount > 0 ? 'text-orange-600' : 'text-gray-400'}
        />
      </div>
    </div>
  );
}
