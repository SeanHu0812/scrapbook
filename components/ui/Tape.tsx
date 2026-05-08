type Props = {
  className?: string;
  color?: "yellow" | "pink" | "blue" | "green";
  rotate?: number;
};

const tints: Record<NonNullable<Props["color"]>, string> = {
  yellow: "bg-yellow/70",
  pink: "bg-pink-soft/85",
  blue: "bg-blue/75",
  green: "bg-green/70",
};

export function Tape({ className = "", color = "yellow", rotate = -8 }: Props) {
  return (
    <span
      aria-hidden
      className={`absolute h-4 w-12 ${tints[color]} ${className}`}
      style={{
        transform: `rotate(${rotate}deg)`,
        boxShadow: "inset 0 0 0 1px rgba(108,90,78,0.08)",
        backgroundImage:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0 4px, transparent 4px 8px)",
      }}
    />
  );
}
