"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { shareUrl } from "@/lib/invite";

export function useSpace() {
  const spaceData = useQuery(api.spaces.mySpace);
  const currentUser = useQuery(api.users.getCurrentUser);
  const invite = useQuery(api.invites.mine);

  return {
    isLoading: spaceData === undefined,
    status: (spaceData?.status ?? "solo") as "solo" | "paired",
    space: spaceData?.space ?? null,
    members: spaceData?.members ?? [],
    currentUser: currentUser ?? null,
    invite: invite ? { ...invite, shareUrl: shareUrl(invite.code) } : null,
  };
}
