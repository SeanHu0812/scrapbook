"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title?: string;
  variant?: "back" | "close";
  trailing?: ReactNode;
  fallbackHref?: string;
};

export function BackHeader({
  title,
  variant = "back",
  trailing,
  fallbackHref = "/home",
}: Props) {
  const router = useRouter();
  const Icon = variant === "close" ? X : ChevronLeft;

  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push(fallbackHref);
          }
        }}
        aria-label="Go back"
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
      >
        <Icon className="h-6 w-6" strokeWidth={2} />
      </button>
      {title && (
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">
          {title}
        </h1>
      )}
      <div className="flex h-9 w-9 items-center justify-center text-ink/80">
        {trailing ?? <span className="block h-1 w-1" />}
      </div>
    </div>
  );
}

export function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[14px] font-semibold text-pink hover:opacity-80"
    >
      {children}
    </Link>
  );
}
