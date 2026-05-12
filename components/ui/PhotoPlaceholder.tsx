type Scene = "coffee" | "couple" | "sunset" | "flowers" | "airplane" | "river";

const palettes: Record<Scene, [string, string]> = {
  coffee: ["#F4D7C4", "#C9A88A"],
  couple: ["#FCE4E7", "#CFE9FA"],
  sunset: ["#FFD479", "#F98592"],
  flowers: ["#F8B4B9", "#CFE8C9"],
  airplane: ["#CFE9FA", "#FFEAB6"],
  river: ["#CFE8C9", "#CFE9FA"],
};

type Props = {
  scene?: Scene;
  className?: string;
  rounded?: string;
};

export function PhotoPlaceholder({
  scene = "couple",
  className = "",
  rounded = "rounded-md",
}: Props) {
  const safeScene: Scene = scene in palettes ? (scene as Scene) : "couple";
  const [a, b] = palettes[safeScene];

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)` }}
    >
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {scene === "coffee" && <CoffeeArt />}
        {scene === "couple" && <CoupleArt />}
        {scene === "sunset" && <SunsetArt />}
        {scene === "flowers" && <FlowersArt />}
        {scene === "airplane" && <AirplaneArt />}
        {scene === "river" && <RiverArt />}
      </svg>
    </div>
  );
}

function CoupleArt() {
  return (
    <g>
      {/* mia */}
      <ellipse cx="80" cy="120" rx="36" ry="40" fill="#F4D7C4" />
      <path d="M44 110c2-26 16-42 36-42s34 16 36 42c-6-6-14-8-20-8-4 6-14 10-22 8-12-2-22-2-30 0z" fill="#6C4A3A" />
      <circle cx="80" cy="74" r="10" fill="#6C4A3A" />
      <circle cx="68" cy="124" r="4" fill="#F8B4B9" opacity="0.7" />
      <circle cx="92" cy="124" r="4" fill="#F8B4B9" opacity="0.7" />
      <path d="M70 117c2 2 4 2 5 0M89 117c2 2 4 2 5 0" stroke="#2F2A28" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M74 134c2 2 4 3 6 3s4-1 6-3" stroke="#2F2A28" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* hoodie pink */}
      <path d="M40 200v-30c0-12 16-22 40-22s40 10 40 22v30z" fill="#F4A6AE" />

      {/* jake */}
      <ellipse cx="140" cy="118" rx="32" ry="36" fill="#F4D7C4" />
      <path d="M108 110c2-22 14-36 32-36s30 14 32 36c-5-4-12-6-18-6-3 4-12 6-20 6s-15-2-20-2-5 1-6 2z" fill="#3A2A22" />
      <circle cx="130" cy="122" r="3" fill="#F8B4B9" opacity="0.6" />
      <circle cx="150" cy="122" r="3" fill="#F8B4B9" opacity="0.6" />
      <path d="M130 116c1.5 1.5 3 1.5 4 0M146 116c1.5 1.5 3 1.5 4 0" stroke="#2F2A28" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M134 132c2 2 4 3 6 3s4-1 6-3" stroke="#2F2A28" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* hoodie blue */}
      <path d="M100 200v-28c0-12 14-22 40-22s40 10 40 22v28z" fill="#7DA8C7" />
    </g>
  );
}

function CoffeeArt() {
  return (
    <g>
      {/* table */}
      <rect x="0" y="120" width="200" height="80" fill="#C9A88A" opacity="0.5" />
      {/* two glasses */}
      <g>
        <path d="M65 70h30l-3 60a8 8 0 01-8 8h-8a8 8 0 01-8-8z" fill="#fff" stroke="#6C5A4E" strokeWidth="2" />
        <rect x="68" y="75" width="24" height="30" fill="#C9A88A" />
        <rect x="68" y="105" width="24" height="20" fill="#fff" />
      </g>
      <g>
        <path d="M105 70h30l-3 60a8 8 0 01-8 8h-8a8 8 0 01-8-8z" fill="#fff" stroke="#6C5A4E" strokeWidth="2" />
        <rect x="108" y="75" width="24" height="30" fill="#C9A88A" />
        <rect x="108" y="105" width="24" height="20" fill="#fff" />
      </g>
      {/* leaf */}
      <path d="M40 80c10-20 30-30 60-25" stroke="#6FA86C" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="78" rx="6" ry="3" fill="#A8D29E" transform="rotate(-30 38 78)" />
      {/* heart */}
      <path d="M155 80c-3-4-9-3-9 2 0 5 9 10 9 10s9-5 9-10c0-5-6-6-9-2z" fill="#F98592" />
    </g>
  );
}

function SunsetArt() {
  return (
    <g>
      <rect width="200" height="200" fill="url(#sunsetSky)" />
      <defs>
        <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD479" />
          <stop offset="60%" stopColor="#F8B4B9" />
          <stop offset="100%" stopColor="#7DA8C7" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="120" r="34" fill="#FFB36A" opacity="0.95" />
      <rect x="0" y="140" width="200" height="60" fill="#3A6080" opacity="0.55" />
      {/* couple silhouette */}
      <path
        d="M70 170c0-10 6-18 14-18s14 8 14 18M102 170c0-10 6-18 14-18s14 8 14 18"
        fill="#2F2A28"
        opacity="0.85"
      />
      <circle cx="84" cy="148" r="6" fill="#2F2A28" opacity="0.85" />
      <circle cx="116" cy="148" r="6" fill="#2F2A28" opacity="0.85" />
      {/* birds */}
      <path d="M30 50q5-4 10 0M50 40q5-4 10 0M150 60q5-4 10 0" stroke="#2F2A28" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function FlowersArt() {
  return (
    <g>
      <rect width="200" height="200" fill="#FCE4E7" />
      {[
        [50, 80],
        [100, 60],
        [150, 90],
        [70, 130],
        [130, 140],
      ].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <circle cx="0" cy="-12" r="9" fill="#F8B4B9" />
          <circle cx="-12" cy="0" r="9" fill="#F8B4B9" />
          <circle cx="12" cy="0" r="9" fill="#F8B4B9" />
          <circle cx="0" cy="12" r="9" fill="#F8B4B9" />
          <circle cx="0" cy="0" r="6" fill="#FFD479" />
        </g>
      ))}
      <path d="M0 180c30-10 60-10 100 0s70 0 100-10v30H0z" fill="#A8D29E" />
    </g>
  );
}

function AirplaneArt() {
  return (
    <g>
      <rect width="200" height="200" fill="url(#skyGrad)" />
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#CFE9FA" />
          <stop offset="100%" stopColor="#FFEAB6" />
        </linearGradient>
      </defs>
      {/* clouds */}
      <ellipse cx="50" cy="60" rx="22" ry="10" fill="#fff" opacity="0.85" />
      <ellipse cx="160" cy="100" rx="26" ry="11" fill="#fff" opacity="0.85" />
      {/* plane */}
      <g transform="translate(80 90) rotate(-10)">
        <path d="M0 0l60 -8-10 16-50 4z" fill="#fff" stroke="#2F2A28" strokeWidth="1.5" />
        <path d="M20 0l8-14h6l-4 14M20 12l8 14h6l-4-14" fill="#fff" stroke="#2F2A28" strokeWidth="1.5" />
      </g>
      {/* trail */}
      <path d="M40 110c40 0 80-20 130-22" stroke="#fff" strokeWidth="3" strokeDasharray="4 6" fill="none" />
    </g>
  );
}

function RiverArt() {
  return (
    <g>
      <rect width="200" height="200" fill="#CFE9FA" />
      <rect y="100" width="200" height="60" fill="#7DA8C7" opacity="0.5" />
      <rect y="160" width="200" height="40" fill="#CFE8C9" />
      <circle cx="160" cy="60" r="20" fill="#FFD479" />
      <path d="M0 100q50-30 100 0t100 0" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
    </g>
  );
}
