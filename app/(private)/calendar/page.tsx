"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Sprout } from "@/components/decorations";
import { Tape } from "@/components/ui/Tape";

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selected, setSelected] = useState(today.getDate());

  const memories = useQuery(api.memories.list) ?? [];

  // Build a map: "yyyy-mm-dd" → memory
  const memoryByDate = new Map(memories.map((m) => [m.date, m]));

  const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(selected).padStart(2, "0")}`;
  const selectedMemory = memoryByDate.get(selectedDate) ?? null;

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(1);
  }

  const totalDays = daysInMonth(year, month);
  const startPad = firstDayOfWeek(year, month);

  return (
    <PhoneFrame withNav>
      {/* Top bar */}
      <div className="flex items-center justify-between py-2">
        <button aria-label="Back" className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">Calendar</h1>
        <div className="h-9 w-9" />
      </div>

      {/* Month switcher */}
      <div className="relative mt-4 flex items-center justify-center gap-6">
        <button aria-label="Previous month" onClick={prevMonth} className="text-brown">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h2 className="handwrite text-[28px] text-ink">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button aria-label="Next month" onClick={nextMonth} className="text-brown">
          <ChevronRight className="h-5 w-5" />
        </button>
        <Sprout className="absolute right-0 top-1 h-9 w-9" />
      </div>

      {/* Day-of-week header */}
      <div className="mt-4 grid grid-cols-7 gap-y-2 px-1 text-center text-[12px] font-semibold text-brown/70">
        {["S","M","T","W","T","F","S"].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      {/* Days */}
      <div className="mt-2 grid grid-cols-7 gap-y-3 px-1 text-center text-[14px]">
        {Array.from({ length: startPad }).map((_, i) => <span key={`pad-${i}`} />)}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasMemory = memoryByDate.has(dateStr);
          const isSelected = day === selected;
          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className="relative mx-auto flex h-9 w-9 flex-col items-center justify-center"
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[14px] ${
                isSelected
                  ? "bg-pink text-white font-semibold shadow-[0_4px_12px_-4px_rgba(244,125,142,0.7)]"
                  : "text-ink"
              }`}>
                {day}
              </span>
              {hasMemory && !isSelected && (
                <span className="absolute bottom-0 h-1 w-1 rounded-full bg-coral" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day preview */}
      <Card tint="white" className="relative mt-6 p-3">
        <Tape className="-top-2 left-6" color="yellow" rotate={-8} />
        <div className="flex items-center justify-between">
          <span className="hand text-[15px] font-semibold text-ink">
            {MONTH_NAMES[month]} {selected}, {year}
          </span>
          <Link
            href={`/new?prefillDate=${selectedDate}`}
            aria-label="Add memory for this day"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-pink text-white shadow-[0_4px_10px_-4px_rgba(244,125,142,0.7)]"
          >
            <span className="text-lg leading-none">+</span>
          </Link>
        </div>
        {selectedMemory ? (
          <div className="mt-3 flex gap-2">
            {selectedMemory.firstPhotoUrl ? (
              <img
                src={selectedMemory.firstPhotoUrl}
                alt=""
                className="h-20 flex-1 rounded-xl object-cover border-[5px] border-white shadow-sm"
              />
            ) : (
              <PhotoPlaceholder
                scene={selectedMemory.scene as any}
                className="h-20 flex-1 border-[5px] border-white shadow-sm"
              />
            )}
          </div>
        ) : (
          <p className="mt-3 hand text-[14px] text-brown/70">
            No memory on this day yet — tap + to add one.
          </p>
        )}
      </Card>

      {selectedMemory && (
        <Link
          href={`/memory/${selectedMemory._id}`}
          className="mt-4 block w-full rounded-full bg-pink py-3 text-center text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(244,125,142,0.7)]"
        >
          View memory
        </Link>
      )}

      <BottomNav />
    </PhoneFrame>
  );
}
