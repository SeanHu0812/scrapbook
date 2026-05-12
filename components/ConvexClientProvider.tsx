"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import dynamic from "next/dynamic";
import { convex } from "@/lib/convex";

// ssr: false — useConvexAuth crashes during build-time prerendering
const AuthInit = dynamic(() => import("./AuthInit"), { ssr: false });

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConvexAuthProvider client={convex}>
      <AuthInit />
      {children}
    </ConvexAuthProvider>
  );
}
