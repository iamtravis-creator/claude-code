// Lightweight inline icon set (stroke-based, inherits currentColor).
const paths = {
  clipboard: (
    <>
      <rect x="8" y="4" width="8" height="4" rx="1" />
      <path d="M9 6H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3" />
      <path d="M9 13l2 2 4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12l8-8 9 .9.9 9-8 8z" />
      <circle cx="14.5" cy="9.5" r="1.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 7a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v2" />
      <rect x="3.5" y="7" width="17" height="12" rx="2" />
      <circle cx="16.5" cy="13" r="1.3" />
    </>
  ),
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  phone: (
    <path d="M6.5 4h3l1.2 4-2 1.4a12 12 0 0 0 5.4 5.4l1.4-2 4 1.2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z" />
  ),
  star: (
    <path d="M12 4l2.3 4.8 5.2.7-3.8 3.6.9 5.2L12 16.9 7.4 18.3l.9-5.2L4.5 9.5l5.2-.7L12 4z" />
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
}

export default function Icon({ name, className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={name === 'star' ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
