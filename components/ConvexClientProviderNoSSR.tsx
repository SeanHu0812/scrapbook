"use client";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";

// ssr: false must live inside a client component — layout.tsx is a server component.
const Inner = dynamic(
  () => import("./ConvexClientProvider").then((m) => m.ConvexClientProvider),
  { ssr: false },
);

export function ConvexClientProviderNoSSR({ children }: { children: ReactNode }) {
  return <Inner>{children}</Inner>;
}
