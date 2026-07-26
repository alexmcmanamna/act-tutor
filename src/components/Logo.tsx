/** Placeholder mascot logo — a simple owl reading a book, in the app's indigo accent. Swap for a final brand asset later. */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="ACT Tutor logo">
      <circle cx="24" cy="24" r="24" fill="#4f46e5" />
      <ellipse cx="24" cy="21" rx="11" ry="10" fill="#eef2ff" />
      <circle cx="19" cy="20" r="3.4" fill="#4f46e5" />
      <circle cx="29" cy="20" r="3.4" fill="#4f46e5" />
      <circle cx="19" cy="20" r="1.3" fill="#eef2ff" />
      <circle cx="29" cy="20" r="1.3" fill="#eef2ff" />
      <path d="M22 25 L24 27.5 L26 25" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13 34c0-3 5-4 11-4s11 1 11 4v2H13v-2z" fill="#eef2ff" />
      <rect x="15" y="33" width="18" height="3" rx="1.5" fill="#4f46e5" />
    </svg>
  );
}
