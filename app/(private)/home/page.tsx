"use client";

import Link from "next/link";
import { Bell, ChevronDown, ChevronRight, ListChecks } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { InvitePartnerCard } from "@/components/ui/InvitePartnerCard";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Sun, Sparkle, HeartTiny } from "@/components/decorations";
import { Tape } from "@/components/ui/Tape";
import { useSpace } from "@/lib/useSpace";
import { memories, todos, dailyQuestions } from "@/lib/data";

export default function HomePage() {
  const { status, space, members, invite } = useSpace();
  const upcomingTodos = todos.filter((t) => !t.done).slice(0, 2);
  const featuredQuestion = dailyQuestions[0];
  const isSolo = status === "solo";

  return (
    <PhoneFrame withNav>
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <button className="flex items-center gap-1.5 text-[20px] font-semibold tracking-wide">
          <span className="hand">{space?.name ?? "our little space"}</span>
          <ChevronDown className="h-4 w-4 text-brown" />
        </button>
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/80"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-coral" />
        </button>
      </header>

      {/* Avatars */}
      <div className="mt-3 flex items-center justify-center gap-3">
        {members.length > 0 ? (
          <>
            <div className="flex flex-col items-center gap-1.5">
              <UserAvatar
                name={members[0].name}
                avatarPreset={members[0].avatarPreset}
                avatarUrl={members[0].avatarUrl}
                size={64}
              />
              <span className="text-[14px] text-brown">{members[0].name}</span>
            </div>

            <svg width="22" height="20" viewBox="0 0 24 24" className="text-coral mb-5">
              <path d="M12 21s-7-4.4-7-10.2C5 7.6 7.4 5.2 10.4 5.2c1.6 0 2.8.7 3.6 1.7C14.8 5.9 16 5.2 17.6 5.2 20.6 5.2 23 7.6 23 10.8 23 16.6 16 21 12 21z" fill="currentColor" />
            </svg>

            {members.length > 1 ? (
              <div className="flex flex-col items-center gap-1.5">
                <UserAvatar
                  name={members[1].name}
                  avatarPreset={members[1].avatarPreset}
                  avatarUrl={members[1].avatarUrl}
                  size={64}
                />
                <span className="text-[14px] text-brown">{members[1].name}</span>
              </div>
            ) : (
              <Link href="/onboarding/invite" className="flex flex-col items-center gap-1.5">
                <div
                  className="flex items-center justify-center rounded-full border-2 border-dashed border-brown/30 text-brown/40 hover:border-coral hover:text-coral transition"
                  style={{ width: 64, height: 64 }}
                >
                  <span className="text-[26px] leading-none">+</span>
                </div>
                <span className="text-[13px] text-brown/40">add partner</span>
              </Link>
            )}
          </>
        ) : (
          <div className="h-16 w-16 rounded-full bg-border animate-pulse" />
        )}
      </div>

      {/* Invite card — solo only */}
      {isSolo && invite && (
        <div className="mt-5">
          <InvitePartnerCard code={invite.code} shareUrl={invite.shareUrl} />
        </div>
      )}

      {/* Daily question */}
      <Link href="/daily-question" className={isSolo ? "mt-3 block" : "mt-5 block"}>
        <Card tint="blue" className="overflow-hidden p-4">
          <p className="text-[13px] font-semibold text-brown/80">Daily question</p>
          <p className="mt-1 hand text-[20px] leading-snug text-ink">
            {featuredQuestion.prompt} <span className="text-coral">😊</span>
          </p>
          <div className="mt-3 flex justify-end">
            <span className="rounded-full bg-white px-5 py-1.5 text-[14px] font-semibold text-ink shadow-sm border border-border">
              Answer
            </span>
          </div>
          <Sparkle className="absolute -right-1 -top-1 h-6 w-6" />
        </Card>
      </Link>

      {/* Shared todo card */}
      <Link href="/todos" className="mt-3 block">
        <Card tint="green" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-brown/80">
                {isSolo ? "My little list" : "Our little list"}
              </p>
              <p className="hand text-[18px] text-ink">
                {upcomingTodos.length} things to do
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-coral border border-border">
              <ListChecks className="h-5 w-5" />
            </div>
          </div>
          <ul className="mt-3 space-y-1.5">
            {upcomingTodos.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-1.5 text-[14px]"
              >
                <span className="h-4 w-4 rounded-full border-2 border-brown/50" />
                <span className="flex-1 text-ink">{t.title}</span>
                <span className="text-[12px] text-brown/70">{t.due ?? ""}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-end gap-1 text-[13px] font-semibold text-coral">
            Open list <ChevronRight className="h-4 w-4" />
          </div>
        </Card>
      </Link>

      {/* Memory timeline */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="hand text-[18px] font-semibold tracking-wide">
            Memory timeline
          </h2>
          <Link
            href="/new"
            aria-label="New memory"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-pink text-white shadow-[0_6px_14px_-6px_rgba(244,125,142,0.7)]"
          >
            <span className="text-xl leading-none">+</span>
          </Link>
        </div>

        <div className="mt-3 space-y-4">
          {memories.slice(0, 2).map((m) => (
            <Link key={m.id} href={`/memory/${m.id}`} className="block">
              <Card tint="white" className="relative overflow-hidden p-3">
                <Tape className="-top-2 left-6" color="yellow" rotate={-10} />
                <div className="flex items-center justify-between text-[13px] text-brown/80">
                  <span className="font-semibold text-ink">{formatDate(m.date)}</span>
                  <span className="flex items-center gap-1">
                    {m.weekday}
                    <Sun className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <PhotoPlaceholder scene={m.photos[0]} className="h-20 w-20 shrink-0" />
                  <PhotoPlaceholder scene={m.photos[1] ?? "couple"} className="h-20 w-20 shrink-0" />
                  <div className="ml-1 flex-1">
                    <div className="rounded-md bg-white px-2 py-1 text-[12px] leading-snug text-brown shadow-sm border border-border -rotate-3">
                      {m.caption}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-brown/70">
                      <HeartTiny className="h-3 w-3" />
                      <span>{m.likes}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </PhoneFrame>
  );
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[m - 1]} ${d}, ${iso.slice(0, 4)}`;
}
