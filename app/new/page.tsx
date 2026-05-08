"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar as CalIcon,
  Pencil,
  Camera,
  StickyNote,
  Smile,
  Mic,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Tape } from "@/components/ui/Tape";
import { Sun } from "@/components/decorations";

type Tab = "photo" | "note" | "sticker" | "voice" | "location";

const tabs: { id: Tab; label: string; Icon: typeof Camera }[] = [
  { id: "photo", label: "Photo", Icon: Camera },
  { id: "note", label: "Note", Icon: StickyNote },
  { id: "sticker", label: "Sticker", Icon: Smile },
  { id: "voice", label: "Voice", Icon: Mic },
  { id: "location", label: "Place", Icon: MapPin },
];

export default function NewMemoryPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("photo");
  const [body, setBody] = useState(
    "It was such a cozy day!\nWe went to our favorite cafe,\ntook a walk by the river and\nwatched the sunset together. ❤"
  );

  return (
    <PhoneFrame>
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
        >
          <span className="text-xl leading-none">✕</span>
        </button>
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">
          New memory
        </h1>
        <button
          onClick={() => router.push("/home")}
          className="rounded-full bg-pink px-5 py-2 text-[14px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(244,125,142,0.7)]"
        >
          Save
        </button>
      </div>

      {/* Date */}
      <div className="mt-3 flex items-center justify-between text-[14px]">
        <div className="flex items-center gap-2 text-ink">
          <CalIcon className="h-4 w-4 text-coral" />
          <span className="font-semibold">May 18, 2024</span>
        </div>
        <div className="flex items-center gap-1 text-brown">
          Saturday
          <Sun className="h-4 w-4" />
        </div>
      </div>

      {/* Prompt */}
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <p className="hand text-[18px] font-semibold">How was our day?</p>
          <Pencil className="h-4 w-4 text-coral" />
        </div>
        <Card tint="white" className="mt-2 p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-brown/50 focus:outline-none"
            placeholder="Write what happened..."
          />
        </Card>
      </div>

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-5 gap-2">
        {tabs.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-[11px] font-semibold transition ${
                active
                  ? "border-coral bg-pink-soft text-coral shadow-sm"
                  : "border-border bg-white text-brown"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Preview area */}
      <div className="mt-5">
        {tab === "photo" && <PhotoPreview />}
        {tab === "note" && <NotePreview />}
        {tab === "sticker" && <StickerPreview />}
        {tab === "voice" && <VoicePreview />}
        {tab === "location" && <LocationPreview />}
      </div>

      {/* Location footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-[14px]">
        <div className="flex items-center gap-2 text-brown">
          <MapPin className="h-4 w-4 text-coral" />
          Add a location
        </div>
        <span className="flex items-center gap-1 font-semibold text-ink">
          Riverside Cafe <ChevronRight className="h-4 w-4 text-brown" />
        </span>
      </div>
    </PhoneFrame>
  );
}

function PhotoPreview() {
  return (
    <div className="relative flex items-start gap-3 px-1">
      <div className="relative">
        <Tape className="-top-2 left-6" color="yellow" rotate={-10} />
        <PhotoPlaceholder
          scene="coffee"
          className="h-32 w-32 rotate-[-3deg] border-[6px] border-white shadow-[0_8px_18px_-10px_rgba(108,90,78,0.4)]"
        />
      </div>
      <div className="relative -ml-3 mt-4">
        <Tape className="-top-2 left-6" color="pink" rotate={6} />
        <PhotoPlaceholder
          scene="couple"
          className="h-32 w-32 rotate-[4deg] border-[6px] border-white shadow-[0_8px_18px_-10px_rgba(108,90,78,0.4)]"
        />
      </div>
      <div className="ml-2 mt-3 flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brown/40 text-center text-[12px] text-brown">
        + Add
      </div>

      {/* good day note */}
      <div className="absolute -bottom-2 left-6 -rotate-6 rounded-md bg-white px-3 py-2 shadow-md border border-border">
        <p className="handwrite text-[18px] leading-tight text-ink">
          good
          <br />
          day <span className="text-coral">☺</span>
        </p>
      </div>
    </div>
  );
}

function NotePreview() {
  return (
    <Card tint="yellow" className="p-4">
      <p className="hand text-[15px] leading-relaxed text-ink">
        Notes appear like little sticky notes inside your memory. Try this:
        what made you laugh today?
      </p>
    </Card>
  );
}

function StickerPreview() {
  const stickers = ["🌷", "🌼", "💗", "✨", "☁️", "🌿", "🍰", "✈️", "📚", "🌙"];
  return (
    <Card tint="white" className="p-4">
      <p className="hand text-[14px] font-semibold text-brown">Tap a sticker</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {stickers.map((s) => (
          <button
            key={s}
            className="flex h-12 items-center justify-center rounded-2xl border border-border bg-pink-soft text-2xl transition hover:scale-105"
          >
            {s}
          </button>
        ))}
      </div>
    </Card>
  );
}

function VoicePreview() {
  return (
    <Card tint="pink" className="p-4">
      <div className="flex items-center gap-3">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white shadow-md">
          <Mic className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="hand text-[15px] text-ink">Tap to record</p>
          <p className="text-[12px] text-brown/80">Up to 60 seconds</p>
        </div>
        <span className="text-[13px] font-semibold text-coral">0:00</span>
      </div>
    </Card>
  );
}

function LocationPreview() {
  return (
    <Card tint="blue" className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-coral border border-border">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="hand text-[15px] text-ink">Riverside Cafe</p>
          <p className="text-[12px] text-brown/80">12 Linden Way · 0.4 mi</p>
        </div>
        <button className="text-[13px] font-semibold text-coral">Change</button>
      </div>
    </Card>
  );
}
