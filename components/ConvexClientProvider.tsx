"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import dynamic from "next/dynamic";
import { convex } from "@/lib/convex";

// ssr: false — useConvexAuth crashes during build-time prerendering
const AuthInit = dynamic(() => import("./AuthInit"), { ssr: false });

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <AuthInit />
      {children}
    </ConvexAuthNextjsProvider>
  );
}
