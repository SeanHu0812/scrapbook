export function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-ink/80">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
          <rect x="4" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
          <rect x="8" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
          <rect x="12" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
        </svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" className="ml-0.5">
          <path d="M8 11.5a1 1 0 100-2 1 1 0 000 2z" fill="currentColor" />
          <path
            d="M2 5.5C3.6 4 5.7 3 8 3s4.4 1 6 2.5M4 8c1-.9 2.4-1.5 4-1.5S11 7.1 12 8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {/* battery */}
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" className="ml-0.5">
          <rect
            x="0.5"
            y="0.5"
            width="22"
            height="11"
            rx="3"
            stroke="currentColor"
            opacity="0.5"
          />
          <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
          <rect x="24" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
