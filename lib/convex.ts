/*
 * Central Convex client + auth facade.
 *
 * Clerk swap path: replace the @convex-dev/auth imports below with
 * Clerk equivalents — useConvexAuth → @clerk/nextjs useAuth,
 * useAuthActions → useSignIn / useSignOut from @clerk/nextjs.
 * Re-export the same { useAuth } shape and no UI file needs to change.
 */
"use client";

import { ConvexReactClient, useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  return { isLoading, isAuthenticated, signIn, signOut };
}
