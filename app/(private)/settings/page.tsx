"use client";

import React, { useState } from "react";
import { ChevronRight, Bell, Globe, Palette, Bug, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { useSpace } from "@/lib/useSpace";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";

function formatSettingsDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { space, members, currentUser } = useSpace();
  const updateStartDate = useMutation(api.spaces.updateStartDate);

  const [signingOut, setSigningOut] = useState(false);

  const partner = members.find((m) => m.userId !== currentUser?._id);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } finally {
      setSigningOut(false);
    }
  }

  async function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!value) return;
    await updateStartDate({ startDate: value });
  }

  return (
    <PhoneFrame>
      <BackHeader title="Settings" fallbackHref="/profile" />

      <div className="space-y-6 pb-10">
        {/* ACCOUNT */}
        <section>
          <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">Account</h2>
          <Card tint="white" className="divide-y divide-border">
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[14px] text-ink">Email</span>
              <span className="rounded-full bg-cream px-3 py-1 text-[12px] text-brown/70 border border-border max-w-[55%] truncate">
                {currentUser?.email ?? "—"}
              </span>
            </div>
          </Card>
        </section>

        {/* YOUR RELATIONSHIP */}
        <section>
          <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">
            Your relationship
          </h2>
          <Card tint="white" className="divide-y divide-border">
            {/* Anniversary */}
            <label className="relative flex items-center justify-between px-4 py-3.5 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CalendarDays className="h-4 w-4 text-coral shrink-0" />
                <span className="text-[14px] text-ink">Anniversary</span>
              </div>
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-brown/80">
                {space?.startDate ? formatSettingsDate(space.startDate) : (
                  <span className="text-coral">Set date</span>
                )}
                <ChevronRight className="h-3.5 w-3.5 text-brown/40" />
              </span>
              <input
                type="date"
                defaultValue={space?.startDate ?? ""}
                max={new Date().toISOString().slice(0, 10)}
                onChange={handleStartDateChange}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </label>

            {/* Partner */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[14px] text-ink">Partner</span>
              {partner ? (
                <span className="text-[13px] text-brown/80">{partner.name}</span>
              ) : (
                <a
                  href="/onboarding/invite"
                  className="text-[13px] text-coral underline"
                >
                  Invite your partner
                </a>
              )}
            </div>
          </Card>
        </section>

        {/* PREFERENCES */}
        <section>
          <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">
            Preferences
          </h2>
          <Card tint="white" className="divide-y divide-border">
            {/* Notifications — stub */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-b-0">
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-brown/60" />
                <span className="text-[14px] text-ink">Notifications</span>
              </div>
              {/* stub toggle */}
              <div className="relative h-6 w-10 rounded-full bg-border cursor-not-allowed opacity-60">
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
              </div>
            </div>

            {/* Appearance — stub */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border last:border-b-0">
              <div className="flex items-center gap-2.5">
                <Palette className="h-4 w-4 text-brown/60" />
                <span className="text-[14px] text-ink">Appearance</span>
              </div>
              <div className="flex items-center gap-1 text-brown/60">
                <span className="text-[13px]">System</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Language — stub */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-brown/60" />
                <span className="text-[14px] text-ink">Language</span>
              </div>
              <div className="flex items-center gap-1 text-brown/60">
                <span className="text-[13px]">English</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Card>
        </section>

        {/* SUPPORT */}
        <section>
          <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">Support</h2>
          <Card tint="white" className="divide-y divide-border">
            <a
              href="mailto:support@scrapbookapp.co"
              className="flex items-center justify-between px-4 py-3.5"
            >
              <div className="flex items-center gap-2.5">
                <Bug className="h-4 w-4 text-brown/60" />
                <span className="text-[14px] text-ink">Report a bug</span>
              </div>
              <ChevronRight className="h-4 w-4 text-brown/60" />
            </a>
          </Card>
        </section>

        {/* Sign out */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="text-[14px] font-semibold text-red-500 disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
