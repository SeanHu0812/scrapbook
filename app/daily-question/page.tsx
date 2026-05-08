"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";
import { Sun, Sparkle, HeartTiny, Cloud } from "@/components/decorations";
import { dailyQuestions, dailyQuestionHistory } from "@/lib/data";

const tintMap = {
  pink: "pink",
  yellow: "yellow",
  blue: "blue",
  green: "green",
} as const;

export default function DailyQuestionPage() {
  const [tab, setTab] = useState<"new" | "history">("new");
  const list = tab === "new" ? dailyQuestions : dailyQuestionHistory;

  return (
    <PhoneFrame>
      <BackHeader title="Daily question" />

      <div className="relative mt-4 flex flex-col items-center text-center">
        <Sun className="h-16 w-16" />
        <Sparkle className="absolute right-12 top-2 h-5 w-5" />
        <p className="hand mt-2 max-w-[260px] text-[16px] text-brown">
          Answer a question together
          <br />
          every day and discover
          <br />
          more about each other.{" "}
          <HeartTiny className="inline h-4 w-4 align-baseline" />
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 grid grid-cols-2 border-b border-border text-center">
        <button
          onClick={() => setTab("new")}
          className={`pb-2 text-[15px] font-semibold ${
            tab === "new"
              ? "border-b-2 border-coral text-coral"
              : "text-brown/70"
          }`}
        >
          New
        </button>
        <button
          onClick={() => setTab("history")}
          className={`pb-2 text-[15px] font-semibold ${
            tab === "history"
              ? "border-b-2 border-coral text-coral"
              : "text-brown/70"
          }`}
        >
          History
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {list.map((q) => (
          <Card
            key={q.id}
            tint={tintMap[q.tint]}
            className="flex items-start justify-between gap-3 p-4"
          >
            <p className="hand text-[17px] leading-snug text-ink">
              {q.prompt} <span>{q.emoji}</span>
            </p>
            {"answeredOn" in q && q.answeredOn ? (
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-brown border border-border">
                {q.answeredOn}
              </span>
            ) : (
              <span className="shrink-0 self-end">
                <CharacterChip variant={q.id === "q1" ? "couple" : q.id === "q2" ? "earth" : "cloud"} />
              </span>
            )}
          </Card>
        ))}
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-border bg-white py-3 text-[15px] font-semibold text-ink shadow-sm">
        <Shuffle className="h-4 w-4" />
        Shuffle a question
      </button>

      <Cloud className="mx-auto mt-6 h-6 w-12 opacity-70" />
    </PhoneFrame>
  );
}

function CharacterChip({
  variant,
}: {
  variant: "couple" | "earth" | "cloud";
}) {
  if (variant === "couple") {
    return (
      <span className="inline-flex h-7 w-12 items-center justify-center rounded-full bg-white text-[14px]">
        👫
      </span>
    );
  }
  if (variant === "earth") {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[16px]">
        🌍
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[16px]">
      ☁️
    </span>
  );
}
