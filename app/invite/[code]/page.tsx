"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "@/convex/_generated/api";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Card } from "@/components/ui/Card";
import { Sparkle } from "@/components/decorations";

export default function InvitePage() {
  const params = useParams<{ code: string }>();
  const code = params.code?.toUpperCase() ?? "";
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const invite = useQuery(api.invites.getByCode, { code });
  const acceptInvite = useMutation(api.invites.accept);
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  async function handleAccept() {
    setError("");
    setAccepting(true);
    try {
      await acceptInvite({ code });
      // Route based on whether profile is complete
      if (currentUser && currentUser.name) {
        router.push("/home");
      } else {
        router.push("/onboarding/profile?from=invite");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setAccepting(false);
    }
  }

  // Loading
  if (invite === undefined || authLoading) {
    return (
      <PhoneFrame>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-6 w-6 animate-spin text-coral/60" />
        </div>
      </PhoneFrame>
    );
  }

  // Error states
  if (
    invite.status === "not_found" ||
    invite.status === "expired" ||
    invite.status === "used"
  ) {
    const messages = {
      not_found: { title: "link not found 🔍", body: "This invite link doesn't exist. Double-check the URL." },
      expired: { title: "link expired ⏰", body: "This invite has expired. Ask your partner to send a new one." },
      used: { title: "already accepted 🌸", body: "This invite has already been used." },
    };
    const { title, body } = messages[invite.status];
    return (
      <PhoneFrame>
        <div className="mt-16 text-center px-4">
          <p className="handwrite text-[30px] text-coral mb-2">{title}</p>
          <p className="hand text-[14px] text-brown/60 mb-8">{body}</p>
          <Link
            href="/home"
            className="inline-block rounded-2xl bg-coral px-6 py-3 hand text-[15px] font-semibold text-white"
          >
            Go to home
          </Link>
        </div>
      </PhoneFrame>
    );
  }

  // Valid invite
  const { inviterName, avatarPreset, avatarUrl } = invite;

  return (
    <PhoneFrame>
      {/* Header */}
      <div className="relative mt-8 mb-6 text-center">
        <div className="absolute top-0 right-4 opacity-60">
          <Sparkle className="h-7 w-7" />
        </div>
        <p className="handwrite text-[28px] text-coral leading-tight">you're invited</p>
        <p className="handwrite text-[28px] text-coral leading-tight">to a space 💌</p>
      </div>

      {/* Inviter card */}
      <Card tint="pink" className="px-5 py-6 mb-4 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md bg-pink-soft flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt={inviterName} className="w-full h-full object-cover" />
            ) : avatarPreset ? (
              <img
                src={`/avatars/${avatarPreset}.png`}
                alt={inviterName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="handwrite text-[32px] text-coral">
                {inviterName?.[0]?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
        </div>
        <p className="handwrite text-[22px] text-ink mb-1">{inviterName || "someone"}</p>
        <p className="hand text-[13px] text-brown/60">wants you in their scrapbook space</p>
      </Card>

      {error && (
        <p className="hand text-[13px] text-coral text-center mb-3">{error}</p>
      )}

      {isAuthenticated ? (
        // Authenticated — show accept button
        <>
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 hand text-[15px] font-semibold text-white shadow-sm disabled:opacity-60 transition active:scale-[0.98] mb-3"
          >
            {accepting && <Loader2 className="h-4 w-4 animate-spin" />}
            Accept & join their space
          </button>
          <button
            onClick={() => router.push("/home")}
            className="w-full hand text-[13px] text-brown/50 text-center py-2"
          >
            Maybe later
          </button>
        </>
      ) : (
        // Unauthenticated — offer sign up / sign in
        <>
          <Link
            href={`/sign-up?next=/invite/${code}`}
            className="w-full flex items-center justify-center rounded-2xl bg-coral py-3 hand text-[15px] font-semibold text-white shadow-sm transition active:scale-[0.98] mb-3"
          >
            Sign up to join
          </Link>
          <Link
            href={`/sign-in?next=/invite/${code}`}
            className="w-full flex items-center justify-center rounded-2xl border border-border bg-white py-3 hand text-[14px] font-semibold text-ink shadow-sm transition active:scale-[0.98]"
          >
            I already have an account
          </Link>
        </>
      )}
    </PhoneFrame>
  );
}
