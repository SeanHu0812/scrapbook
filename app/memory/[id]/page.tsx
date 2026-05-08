import { notFound } from "next/navigation";
import { Heart, MessageCircle, Share2, Play, MoreHorizontal } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Polaroid } from "@/components/ui/Polaroid";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Sun } from "@/components/decorations";
import { getMemory, memories } from "@/lib/data";

export function generateStaticParams() {
  return memories.map((m) => ({ id: m.id }));
}

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memory = getMemory(id);
  if (!memory) notFound();

  return (
    <PhoneFrame>
      <BackHeader
        trailing={
          <button aria-label="More" className="text-ink/80">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        }
      />

      <div className="mt-1 flex items-center justify-between text-[14px]">
        <span className="font-semibold text-ink">{formatDate(memory.date)}</span>
        <span className="flex items-center gap-1 text-brown">
          {memory.weekday}
          <Sun className="h-4 w-4" />
        </span>
      </div>

      {/* Polaroid */}
      <div className="mt-5 flex justify-center">
        <Polaroid rotate={-2} tapeColor="yellow">
          <PhotoPlaceholder
            scene={memory.scene}
            className="h-60 w-64"
          />
        </Polaroid>
      </div>

      <h2 className="mt-6 hand text-[22px] font-semibold text-ink">
        {memory.title}{" "}
        <span className="inline-block align-baseline">🌿</span>
      </h2>

      <p className="mt-2 hand text-[16px] leading-relaxed text-ink/90 whitespace-pre-line">
        {memory.body}
      </p>

      {/* Voice player */}
      <div className="mt-4 flex items-center gap-3 rounded-full bg-pink-soft px-3 py-2">
        <button
          aria-label="Play"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white shadow-sm"
        >
          <Play className="h-4 w-4" fill="currentColor" />
        </button>
        <span className="text-[13px] font-semibold text-ink">
          0:{memory.audioSeconds.toString().padStart(2, "0")}
        </span>
        <Waveform />
      </div>

      {/* Stickers */}
      <div className="mt-4 flex items-center gap-2 text-2xl">
        {memory.stickers?.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>

      {/* Stats row */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-[14px] text-brown">
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1.5">
            <Heart className="h-5 w-5 text-coral" fill="currentColor" />
            <span className="font-semibold text-ink">{memory.likes}</span>
          </button>
          <button className="flex items-center gap-1.5">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-ink">{memory.comments}</span>
          </button>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </PhoneFrame>
  );
}

function Waveform() {
  // Random-ish but stable bar heights
  const heights = [
    8, 14, 6, 18, 10, 20, 12, 16, 8, 22, 14, 10, 6, 18, 12, 16, 8, 14, 20, 10,
    16, 12, 8, 14, 18, 10, 6, 16, 12, 20, 8, 14,
  ];
  return (
    <div className="flex flex-1 items-center gap-[2px]">
      {heights.map((h, i) => (
        <span
          key={i}
          className="block w-[2px] rounded-full bg-coral/70"
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const year = iso.slice(0, 4);
  return `${months[m - 1]} ${d}, ${year}`;
}
