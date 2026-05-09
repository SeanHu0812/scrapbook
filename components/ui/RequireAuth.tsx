"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user !== undefined && user !== null && user.name === "" && pathname !== "/onboarding/profile") {
      router.replace("/onboarding/profile");
    }
  }, [isLoading, isAuthenticated, user, pathname, router]);

  const profileIncomplete = user !== undefined && user !== null && user.name === "";

  if (isLoading || !isAuthenticated || user === undefined || profileIncomplete) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream">
      <p className="hand text-[14px] text-brown/60 animate-pulse">loading…</p>
    </div>
  );
}
