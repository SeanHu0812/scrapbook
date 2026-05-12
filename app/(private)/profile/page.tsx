"use client";

import Link from "next/link";
import { Settings, ChevronRight, MapPin, Music2 } from "lucide-react";
import { useSpace } from "@/lib/useSpace";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { HeartTiny } from "@/components/decorations";
import { stats, favorites } from "@/lib/data";

export default function ProfilePage() {
  const { status, members } = useSpace();
  const isSolo = status === "solo";
  const nameDisplay =
    members.length >= 2
      ? `${members[0].name} & ${members[1].name}`
      : members[0]?.name ?? "";

  return (
    <PhoneFrame withNav>
      <div className="flex items-center justify-between py-2">
        <span className="h-9 w-9" />
        <h1 className="hand text-[18px] font-semibold tracking-wide">Profile</h1>
        <button
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Couple card */}
      <Card tint="white" className="mt-3 px-5 py-6 text-center">
        <div className="flex justify-center items-center gap-3">
          {members[0] && (
            <UserAvatar
              name={members[0].name}
              avatarPreset={members[0].avatarPreset}
              avatarUrl={members[0].avatarUrl}
              size={68}
            />
          )}
          {members.length >= 2 && (
            <>
              <svg width="22" height="20" viewBox="0 0 24 24" className="text-coral">
                <path d="M12 21s-7-4.4-7-10.2C5 7.6 7.4 5.2 10.4 5.2c1.6 0 2.8.7 3.6 1.7C14.8 5.9 16 5.2 17.6 5.2 20.6 5.2 23 7.6 23 10.8 23 16.6 16 21 12 21z" fill="currentColor" />
              </svg>
              <UserAvatar
                name={members[1].name}
                avatarPreset={members[1].avatarPreset}
                avatarUrl={members[1].avatarUrl}
                size={68}
              />
            </>
          )}
          {members.length === 0 && (
            <div className="h-[68px] w-[68px] rounded-full bg-border animate-pulse" />
          )}
        </div>
        <p className="mt-3 hand text-[20px] font-semibold text-ink">{nameDisplay}</p>
        {isSolo ? (
          <p className="mt-1 text-[13px] text-brown/60">
            it&apos;s just you for now —{" "}
            <Link href="/onboarding/invite" className="text-coral underline">
              invite your partner
            </Link>
          </p>
        ) : (
          <p className="mt-1 text-[13px] text-brown">
            paired space{" "}
            <HeartTiny className="inline h-3.5 w-3.5 align-baseline" />
          </p>
        )}
      </Card>

      {/* Stats */}
      <section className="mt-5">
        <h2 className="hand text-[15px] font-semibold text-brown/80">
          Our little stats
        </h2>
        <Card tint="white" className="mt-2 grid grid-cols-3 divide-x divide-border p-3 text-center">
          <Stat tint="bg-pink-soft" emoji="🎀" value={stats.memories} label="Memories" />
          <Stat tint="bg-blue-soft" emoji="🖼️" value={stats.photos} label="Photos" />
          <Stat tint="bg-yellow-soft" emoji="🎙️" value={stats.voiceNotes} label="Voice notes" />
        </Card>
      </section>

      {/* Favorites */}
      <section className="mt-5">
        <h2 className="hand text-[15px] font-semibold text-brown/80">
          Our favorites
        </h2>
        <Card tint="white" className="mt-2 divide-y divide-border">
          <FavoriteRow
            leading={
              <PhotoPlaceholder
                scene="couple"
                className="h-10 w-10 rounded-xl"
              />
            }
            title="Favorite memory"
            sub={favorites.memoryDateLabel}
            href={`/memory/${favorites.memoryId}`}
          />
          <FavoriteRow
            leading={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-soft text-coral">
                <Music2 className="h-5 w-5" />
              </div>
            }
            title="Song of us 🎵"
            sub={`${favorites.song.title} – ${favorites.song.artist}`}
          />
          <FavoriteRow
            leading={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-coral">
                <MapPin className="h-5 w-5" />
              </div>
            }
            title="Places we love"
            sub={`${favorites.placesCount} places`}
          />
        </Card>
      </section>

      <BottomNav />
    </PhoneFrame>
  );
}

function Stat({
  tint,
  emoji,
  value,
  label,
}: {
  tint: string;
  emoji: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-1">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${tint}`}
      >
        {emoji}
      </span>
      <span className="hand text-[20px] font-semibold leading-none text-ink">
        {value}
      </span>
      <span className="text-[12px] text-brown/80">{label}</span>
    </div>
  );
}

function FavoriteRow({
  leading,
  title,
  sub,
  href,
}: {
  leading: React.ReactNode;
  title: string;
  sub: string;
  href?: string;
}) {
  const Inner = (
    <div className="flex items-center gap-3 px-3 py-3">
      {leading}
      <div className="flex-1">
        <p className="hand text-[15px] font-semibold text-ink leading-tight">
          {title}
        </p>
        <p className="text-[12px] text-brown/80">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-brown/70" />
    </div>
  );
  return href ? <Link href={href}>{Inner}</Link> : <div>{Inner}</div>;
}
