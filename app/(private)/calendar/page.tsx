"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Sprout } from "@/components/decorations";
import { Tape } from "@/components/ui/Tape";
import { memories } from "@/lib/data";

export default function CalendarPage() {
  const [selected, setSelected] = useState(18);
  const memory = memories.find((m) => Number(m.date.split("-")[2]) === selected);

  const memoryDays = new Set(memories.map((m) => Number(m.date.split("-")[2])));

  return (
    <PhoneFrame withNav>
      {/* Top bar */}
      <div className="flex items-center justify-between py-2">
        <button
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">
          Calendar
        </h1>
        <div className="h-9 w-9" />
      </div>

      {/* Month switcher */}
      <div className="relative mt-4 flex items-center justify-center gap-6">
        <button aria-label="Previous month" className="text-brown">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="handwrite text-[28px] text-ink">May 2024</h2>
        <button aria-label="Next month" className="text-brown">
          <ChevronRight className="h-5 w-5" />
        </button>
        <Sprout className="absolute right-0 top-1 h-9 w-9" />
      </div>

      {/* Day-of-week header */}
      <div className="mt-4 grid grid-cols-7 gap-y-2 px-1 text-center text-[12px] font-semibold text-brown/70">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Days */}
      <div className="mt-2 grid grid-cols-7 gap-y-3 px-1 text-center text-[14px]">
        {/* May 2024 starts on Wednesday */}
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: 31 }).map((_, i) => {
          const day = i + 1;
          const hasMemory = memoryDays.has(day);
          const isSelected = day === selected;
          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className="relative mx-auto flex h-9 w-9 flex-col items-center justify-center"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] ${
                  isSelected
                    ? "bg-pink text-white font-semibold shadow-[0_4px_12px_-4px_rgba(244,125,142,0.7)]"
                    : "text-ink"
                }`}
              >
                {day}
              </span>
              {hasMemory && !isSelected && (
                <span className="absolute bottom-0 h-1 w-1 rounded-full bg-coral" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected memory preview */}
      <Card tint="white" className="relative mt-6 p-3">
        <Tape className="-top-2 left-6" color="yellow" rotate={-8} />
        <div className="flex items-center justify-between">
          <span className="hand text-[15px] font-semibold text-ink">
            May {selected}, 2024
          </span>
          <button className="text-brown">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        {memory ? (
          <div className="mt-3 flex gap-2">
            {memory.photos.slice(0, 3).map((scene, i) => (
              <PhotoPlaceholder
                key={i}
                scene={scene}
                className="h-20 flex-1 border-[5px] border-white shadow-sm"
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 hand text-[14px] text-brown/70">
            No memory on this day yet — tap + to add one.
          </p>
        )}
      </Card>

      {memory && (
        <Link
          href={`/memory/${memory.id}`}
          className="mt-4 block w-full rounded-full bg-pink py-3 text-center text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(244,125,142,0.7)]"
        >
          View memory
        </Link>
      )}

      <BottomNav />
    </PhoneFrame>
  );
}
