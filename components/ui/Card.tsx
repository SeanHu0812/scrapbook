import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  tint?: "white" | "blue" | "yellow" | "pink" | "green";
  as?: "div" | "button" | "a";
  onClick?: () => void;
};

const tints: Record<NonNullable<Props["tint"]>, string> = {
  white: "bg-white",
  blue: "bg-blue-soft",
  yellow: "bg-yellow-soft",
  pink: "bg-pink-soft",
  green: "bg-green-soft",
};

export function Card({
  children,
  className = "",
  tint = "white",
  as = "div",
  onClick,
}: Props) {
  const Tag = as as "div";
  return (
    <Tag
      onClick={onClick}
      className={`relative rounded-3xl border border-border ${tints[tint]} shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </Tag>
  );
}
