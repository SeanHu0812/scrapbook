import { ReactNode } from "react";
import { Tape } from "./Tape";

type Props = {
  children: ReactNode;
  caption?: string;
  rotate?: number;
  className?: string;
  withTape?: boolean;
  tapeColor?: "yellow" | "pink" | "blue" | "green";
};

export function Polaroid({
  children,
  caption,
  rotate = -2,
  className = "",
  withTape = true,
  tapeColor = "yellow",
}: Props) {
  return (
    <div
      className={`relative inline-block bg-white p-2.5 pb-6 shadow-[0_10px_30px_-15px_rgba(108,90,78,0.45)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {withTape && (
        <Tape
          className="-top-2 left-1/2 -translate-x-1/2"
          color={tapeColor}
          rotate={-6}
        />
      )}
      <div className="overflow-hidden rounded-sm bg-blue-soft">{children}</div>
      {caption && (
        <p className="handwrite mt-2 text-center text-[18px] leading-tight text-brown">
          {caption}
        </p>
      )}
    </div>
  );
}
