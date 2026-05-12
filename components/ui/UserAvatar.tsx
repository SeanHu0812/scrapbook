type Props = {
  name: string;
  avatarPreset?: string | null;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
};

const TINTS = ["#FCE4E7", "#E5F2FB", "#FFF3D1", "#E2F0DD"];

export function UserAvatar({ name, avatarPreset, avatarUrl, size = 64, className = "" }: Props) {
  const bg = TINTS[(name.charCodeAt(0) ?? 0) % TINTS.length];
  const src = avatarUrl ?? (avatarPreset ? `/avatars/${avatarPreset}.png` : null);

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border-2 border-white shadow-[0_4px_10px_-4px_rgba(108,90,78,0.4)] ${className}`}
      style={{ width: size, height: size, background: bg }}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center handwrite text-coral"
          style={{ fontSize: size * 0.42 }}
        >
          {name?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </div>
  );
}
