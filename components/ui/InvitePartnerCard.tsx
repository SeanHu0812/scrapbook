"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Share2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { shareText } from "@/lib/invite";

type Props = {
  code: string;
  shareUrl: string;
};

export function InvitePartnerCard({ code, shareUrl: url }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: "Join my scrapbook", text: shareText(code), url }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  return (
    <Card tint="pink" className="px-4 py-4 mb-4">
      <p className="handwrite text-[20px] text-coral mb-2">Invite your partner 💌</p>
      <span className="inline-block font-mono text-[15px] tracking-[0.15em] bg-white/70 border border-pink/30 rounded-lg px-3 py-1 text-ink mb-3">
        {code}
      </span>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white py-2 hand text-[13px] font-semibold text-ink transition active:scale-[0.98]"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-brown/60" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-coral py-2 hand text-[13px] font-semibold text-white transition active:scale-[0.98]"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </button>
        <Link
          href="/onboarding/invite"
          className="flex items-center justify-center rounded-xl border border-border bg-white px-3 py-2 hand text-[13px] text-brown/70 transition active:scale-[0.98]"
        >
          Manage →
        </Link>
      </div>
    </Card>
  );
}
