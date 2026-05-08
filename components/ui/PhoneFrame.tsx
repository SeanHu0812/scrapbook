import { ReactNode } from "react";
import { StatusBar } from "./StatusBar";

type Props = {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
};

export function PhoneFrame({ children, withNav = false, className = "" }: Props) {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[440px] bg-cream paper-grain shadow-[0_30px_80px_-30px_rgba(108,90,78,0.3)] sm:my-6 sm:min-h-[860px] sm:rounded-[44px] sm:overflow-hidden sm:border sm:border-border">
      <StatusBar />
      <div
        className={`relative px-5 pt-1 ${withNav ? "pb-28" : "pb-8"} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
