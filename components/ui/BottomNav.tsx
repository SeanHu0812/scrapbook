"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookHeart, Calendar, User, Plus } from "lucide-react";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/journal", label: "Journal", icon: BookHeart },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20">
      <div className="relative mx-3 mb-3 rounded-[28px] border border-border bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_-12px_rgba(108,90,78,0.35)]">
        <ul className="grid grid-cols-5 items-end px-2 pb-3 pt-3">
          {items.slice(0, 2).map((it) => (
            <NavItem key={it.href} {...it} active={pathname === it.href} />
          ))}
          <li className="flex justify-center">
            <Link
              href="/new"
              aria-label="Add memory"
              className="-mt-9 flex h-14 w-14 items-center justify-center rounded-full bg-pink text-white shadow-[0_10px_22px_-6px_rgba(244,125,142,0.65)] ring-4 ring-cream transition active:scale-95"
            >
              <Plus className="h-7 w-7" strokeWidth={2.4} />
            </Link>
          </li>
          {items.slice(2).map((it) => (
            <NavItem key={it.href} {...it} active={pathname === it.href} />
          ))}
        </ul>
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <li className="flex justify-center">
      <Link
        href={href}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] transition ${
          active ? "text-coral" : "text-brown/70"
        }`}
      >
        <Icon
          className="h-5 w-5"
          strokeWidth={active ? 2.4 : 1.8}
          fill={active ? "currentColor" : "none"}
        />
        <span>{label}</span>
      </Link>
    </li>
  );
}
