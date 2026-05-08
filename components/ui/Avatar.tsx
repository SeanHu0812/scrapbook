type Props = {
  name: string;
  variant?: "mia" | "jake";
  size?: number;
  className?: string;
};

export function Avatar({ name, variant = "mia", size = 64, className = "" }: Props) {
  const isMia = variant === "mia";
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_4px_10px_-4px_rgba(108,90,78,0.4)] ${className}`}
      style={{ width: size, height: size, background: isMia ? "#FCE4E7" : "#E5F2FB" }}
      aria-label={name}
    >
      {isMia ? <MiaSvg /> : <JakeSvg />}
    </div>
  );
}

function MiaSvg() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <rect width="64" height="64" fill="#FCE4E7" />
      {/* hair back */}
      <path d="M14 36c0-12 8-22 18-22s18 10 18 22v8H14z" fill="#6C4A3A" />
      {/* face */}
      <ellipse cx="32" cy="34" rx="14" ry="15" fill="#F4D7C4" />
      {/* hair front */}
      <path
        d="M16 30c2-9 8-15 16-15s14 6 16 15c-3-3-7-4-10-4-2 3-7 5-12 4-3 0-7 0-10 0z"
        fill="#6C4A3A"
      />
      {/* bun */}
      <circle cx="32" cy="11" r="6" fill="#6C4A3A" />
      {/* cheeks */}
      <circle cx="22" cy="38" r="3" fill="#F8B4B9" opacity="0.7" />
      <circle cx="42" cy="38" r="3" fill="#F8B4B9" opacity="0.7" />
      {/* eyes */}
      <path
        d="M24 33c1.5 1.5 3 1.5 4 0M36 33c1.5 1.5 3 1.5 4 0"
        stroke="#2F2A28"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* smile */}
      <path
        d="M28 42c1.5 1.5 3 2 4 2s2.5-.5 4-2"
        stroke="#2F2A28"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function JakeSvg() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full">
      <rect width="64" height="64" fill="#E5F2FB" />
      {/* face */}
      <ellipse cx="32" cy="34" rx="14" ry="15" fill="#F4D7C4" />
      {/* hair */}
      <path
        d="M16 26c2-8 8-13 16-13s14 5 16 13c-3-2-6-3-9-3-2 2-6 3-10 3s-7-1-10-1c-1 0-2 0-3 1z"
        fill="#3A2A22"
      />
      {/* cheeks */}
      <circle cx="22" cy="38" r="3" fill="#F8B4B9" opacity="0.6" />
      <circle cx="42" cy="38" r="3" fill="#F8B4B9" opacity="0.6" />
      {/* eyes */}
      <path
        d="M24 33c1.5 1.5 3 1.5 4 0M36 33c1.5 1.5 3 1.5 4 0"
        stroke="#2F2A28"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* smile */}
      <path
        d="M27 42c1.6 2 3.4 2.6 5 2.6s3.4-.6 5-2.6"
        stroke="#2F2A28"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* hoodie collar */}
      <path d="M14 56c4-6 10-9 18-9s14 3 18 9v8H14z" fill="#7DA8C7" />
    </svg>
  );
}

export function CoupleAvatars({ size = 60 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Avatar variant="mia" size={size} name="mia" />
      <svg width="22" height="20" viewBox="0 0 24 24" className="text-coral">
        <path
          d="M12 21s-7-4.4-7-10.2C5 7.6 7.4 5.2 10.4 5.2c1.6 0 2.8.7 3.6 1.7C14.8 5.9 16 5.2 17.6 5.2 20.6 5.2 23 7.6 23 10.8 23 16.6 16 21 12 21z"
          fill="currentColor"
        />
      </svg>
      <Avatar variant="jake" size={size} name="jake" />
    </div>
  );
}
