const colors: Record<string, string> = {
  // Contact status
  lead: 'bg-blue-100 text-blue-700',
  prospect: 'bg-yellow-100 text-yellow-700',
  customer: 'bg-green-100 text-green-700',
  churned: 'bg-gray-100 text-gray-600',
  // Deal stage
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-orange-100 text-orange-700',
  negotiation: 'bg-yellow-100 text-yellow-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
  // Task status
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
  // Task priority
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
  // Note type
  note: 'bg-gray-100 text-gray-600',
  call: 'bg-blue-100 text-blue-700',
  email: 'bg-purple-100 text-purple-700',
  meeting: 'bg-green-100 text-green-700',
};

const labels: Record<string, string> = {
  in_progress: 'In Progress',
};

interface BadgeProps {
  value: string;
  className?: string;
}

export default function Badge({ value, className = '' }: BadgeProps) {
  const color = colors[value] ?? 'bg-gray-100 text-gray-600';
  const label = labels[value] ?? value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color} ${className}`}>
      {label}
    </span>
  );
}
