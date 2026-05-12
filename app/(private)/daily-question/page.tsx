"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";
import { Sun, Sparkle, HeartTiny, Cloud } from "@/components/decorations";
import { useSpace } from "@/lib/useSpace";

type Tint = "pink" | "yellow" | "blue" | "green";

export default function DailyQuestionPage() {
  const [tab, setTab] = useState<"new" | "history">("new");
  const { status, members, currentUser } = useSpace();
  const isSolo = status === "solo";

  const ensureTriad = useMutation(api.dailyQuestions.ensureTriad);
  const triad = useQuery(api.dailyQuestions.todayTriad);
  const historyItems = useQuery(api.dailyQuestions.history, tab === "history" ? {} : "skip");

  useEffect(() => {
    ensureTriad();
  }, [ensureTriad]);

  const partnerName = isSolo
    ? null
    : members.find((m) => m.userId !== currentUser?._id)?.name ?? "your partner";

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
            tab === "new" ? "border-b-2 border-coral text-coral" : "text-brown/70"
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setTab("history")}
          className={`pb-2 text-[15px] font-semibold ${
            tab === "history" ? "border-b-2 border-coral text-coral" : "text-brown/70"
          }`}
        >
          History
        </button>
      </div>

      <div className="mt-5 space-y-4 pb-6">
        {tab === "new" ? (
          triad === undefined ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-2xl bg-border" />)}
            </div>
          ) : triad.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="hand text-[15px] text-brown/60">Loading today's questions…</p>
            </div>
          ) : (
            triad.map((q) => (
              <QuestionCard
                key={q._id}
                id={q._id}
                prompt={q.prompt}
                emoji={q.emoji}
                tint={q.tint as Tint}
                myAnswer={q.myAnswer}
                partnerAnswer={q.partnerAnswer}
                isSolo={isSolo}
                partnerName={partnerName}
              />
            ))
          )
        ) : (
          historyItems === undefined ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-border" />)}
            </div>
          ) : historyItems.length === 0 ? (
            <div className="mt-10 text-center">
              <p className="handwrite text-[26px] text-coral">no answers yet</p>
              <p className="mt-1 hand text-[14px] text-brown/60">Answer today's questions to start your history ☁️</p>
            </div>
          ) : (
            historyItems.map((item, i) => item && (
              <Card key={i} tint={item.tint as Tint} className="p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="hand text-[15px] font-semibold text-ink flex-1">{item.prompt}</p>
                </div>
                <p className="text-[11px] text-brown/60">{formatDate(item.date)}</p>
                <div className="space-y-1.5 mt-1">
                  <AnswerBubble label="you" body={item.myAnswer} />
                  {!isSolo && (
                    <AnswerBubble label={partnerName ?? "partner"} body={item.partnerAnswer} />
                  )}
                </div>
              </Card>
            ))
          )
        )}
      </div>

      <Cloud className="mx-auto mt-2 h-6 w-12 opacity-70" />
    </PhoneFrame>
  );
}

function QuestionCard({
  id,
  prompt,
  emoji,
  tint,
  myAnswer,
  partnerAnswer,
  isSolo,
  partnerName,
}: {
  id: Id<"dailyQuestions">;
  prompt: string;
  emoji: string;
  tint: Tint;
  myAnswer: string | null;
  partnerAnswer: string | null | "locked";
  isSolo: boolean;
  partnerName: string | null;
}) {
  const submitAnswer = useMutation(api.dailyQuestions.answer);
  const [draft, setDraft] = useState(myAnswer ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!myAnswer);

  async function save() {
    if (!draft.trim()) return;
    setSaving(true);
    try {
      await submitAnswer({ questionId: id, body: draft.trim() });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card tint={tint} className="p-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-2xl">{emoji}</span>
        <p className="hand text-[16px] font-semibold text-ink flex-1 leading-snug">{prompt}</p>
      </div>

      {/* My answer */}
      {saved && myAnswer !== null ? (
        <AnswerBubble label="you" body={myAnswer || draft} />
      ) : (
        <div className="space-y-2">
          <textarea
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setSaved(false); }}
            rows={2}
            placeholder="Your answer…"
            className="w-full resize-none rounded-xl bg-white/70 px-3 py-2 text-[14px] text-ink placeholder:text-brown/50 focus:outline-none border border-white/60"
          />
          <button
            onClick={save}
            disabled={saving || !draft.trim()}
            className="flex items-center gap-1.5 rounded-full bg-coral px-4 py-1.5 text-[13px] font-semibold text-white disabled:opacity-50"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save answer
          </button>
        </div>
      )}

      {/* Partner answer */}
      {!isSolo && (
        <div>
          {partnerAnswer === "locked" ? (
            <p className="hand text-[13px] text-brown/60 italic">
              Answer first to see {partnerName ?? "partner"}'s reply 🔒
            </p>
          ) : partnerAnswer ? (
            <AnswerBubble label={partnerName ?? "partner"} body={partnerAnswer} />
          ) : (
            <p className="hand text-[13px] text-brown/60 italic">
              Waiting on {partnerName ?? "partner"} to answer… ☁️
            </p>
          )}
        </div>
      )}
    </Card>
  );
}

function AnswerBubble({ label, body }: { label: string; body: string | null }) {
  if (!body) return null;
  return (
    <div className="rounded-xl bg-white/70 px-3 py-2 border border-white/60">
      <p className="text-[11px] font-semibold text-brown/70 mb-0.5">{label}</p>
      <p className="hand text-[14px] text-ink leading-snug">{body}</p>
    </div>
  );
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[m - 1]} ${d}`;
}
