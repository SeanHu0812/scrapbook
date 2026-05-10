"use client";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

export default function AuthInit() {
  const { isAuthenticated } = useConvexAuth();
  const ensureProfile = useMutation(api.users.ensureProfile);
  useEffect(() => {
    if (isAuthenticated) ensureProfile().catch(console.error);
  }, [isAuthenticated, ensureProfile]);
  return null;
}
