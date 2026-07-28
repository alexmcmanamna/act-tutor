/**
 * Mr. Kim's consistent illustrated avatar: fair-skinned, circular glasses,
 * middle-part hairstyle. Pure inline SVG (no image asset) so it's crisp at
 * any size and themeable via currentColor for the shirt accent.
 */
export function MrKimAvatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Mr. Kim"
      className={`flex-shrink-0 rounded-full ${className}`}
    >
      <circle cx="32" cy="32" r="32" fill="#EEF2FF" />
      {/* shirt */}
      <path d="M10 62c2-10 10-16 22-16s20 6 22 16" fill="#4F46E5" />
      {/* neck */}
      <rect x="27" y="40" width="10" height="8" rx="3" fill="#F3C9A0" />
      {/* head */}
      <ellipse cx="32" cy="30" rx="16" ry="17" fill="#F3C9A0" />
      {/* ears */}
      <circle cx="16.5" cy="31" r="2.6" fill="#F3C9A0" />
      <circle cx="47.5" cy="31" r="2.6" fill="#F3C9A0" />
      {/* hair — middle part */}
      <path
        d="M32 12c-9.5 0-16.5 6.6-16.5 15.5 0 3 .5 5.6 1.3 7.7.4-3.6 1.4-7 3.4-9.4 1.7 2 4.4 3.2 7.3 3.2.5-2.6 2-4.8 4.5-4.8s4 2.2 4.5 4.8c2.9 0 5.6-1.2 7.3-3.2 2 2.4 3 5.8 3.4 9.4.8-2.1 1.3-4.7 1.3-7.7C48.5 18.6 41.5 12 32 12Z"
        fill="#2B2622"
      />
      {/* glasses */}
      <circle cx="24.5" cy="30.5" r="6" fill="none" stroke="#2B2622" strokeWidth="2" />
      <circle cx="39.5" cy="30.5" r="6" fill="none" stroke="#2B2622" strokeWidth="2" />
      <path d="M30.5 30.5h3" stroke="#2B2622" strokeWidth="2" />
      <path d="M18.5 29.5l-3-.5" stroke="#2B2622" strokeWidth="2" strokeLinecap="round" />
      <path d="M45.5 29.5l3-.5" stroke="#2B2622" strokeWidth="2" strokeLinecap="round" />
      {/* smile */}
      <path d="M27 39c1.6 1.6 3.3 2.4 5 2.4s3.4-.8 5-2.4" stroke="#8A5A3A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
