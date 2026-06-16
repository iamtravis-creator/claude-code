interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  color?: string;
}

export default function StatCard({ label, value, sub, color = 'text-gray-900' }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
