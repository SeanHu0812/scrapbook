"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  // Only redirect to /home if the user was ALREADY authenticated before visiting
  // this page. If they just signed in here, the sign-in/sign-up page handles
  // the redirect so we don't race with it.
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (isLoading || initialCheckDone) return;
    setInitialCheckDone(true);
    if (isAuthenticated) router.replace("/home");
  }, [isLoading, isAuthenticated, initialCheckDone, router]);

  if (isLoading || !initialCheckDone) return null;
  if (isAuthenticated) return null;
  return <>{children}</>;
}
