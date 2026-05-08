import Link from "next/link";
import { Settings, ChevronRight, MapPin, Music2 } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { CoupleAvatars } from "@/components/ui/Avatar";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { HeartTiny } from "@/components/decorations";
import { couple, stats, favorites } from "@/lib/data";

export default function ProfilePage() {
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
        <CoupleAvatars size={68} />
        <p className="mt-3 hand text-[20px] font-semibold text-ink">
          {couple.names.mia} & {couple.names.jake}
        </p>
        <p className="mt-1 text-[13px] text-brown">
          Together for {couple.daysTogether} days{" "}
          <HeartTiny className="inline h-3.5 w-3.5 align-baseline" />
        </p>
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
