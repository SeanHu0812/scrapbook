"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useConvexAuth } from "convex/react";
import { Loader2, Copy, Check, Share2, MessageCircle, Mail } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Card } from "@/components/ui/Card";
import { Cloud, Sparkle } from "@/components/decorations";
import { shareUrl, shareText } from "@/lib/invite";

export default function OnboardingInvitePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/sign-up");
  }, [isLoading, isAuthenticated, router]);

  const createInvite = useMutation(api.invites.create);

  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    createInvite()
      .then(({ code, expiresAt }) => {
        setCode(code);
        setExpiresAt(expiresAt);
      })
      .catch(console.error)
      .finally(() => setCreating(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function handleCopy() {
    if (!code) return;
    await navigator.clipboard.writeText(shareUrl(code));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    if (!code) return;
    const url = shareUrl(code);
    const text = shareText(code);
    if (navigator.share) {
      await navigator.share({ title: "Join my scrapbook", text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const url = code ? shareUrl(code) : "";
  const expiresDays = expiresAt
    ? Math.ceil((expiresAt - Date.now()) / (1000 * 60 * 60 * 24))
    : 7;

  return (
    <PhoneFrame>
      {/* Header */}
      <div className="relative mt-6 mb-5 text-center">
        <div className="absolute top-0 left-3 opacity-50">
          <Cloud className="h-10 w-10" />
        </div>
        <div className="absolute top-1 right-3 opacity-60">
          <Sparkle className="h-6 w-6" />
        </div>
        <p className="handwrite text-[28px] text-coral leading-tight">invite your</p>
        <p className="handwrite text-[28px] text-coral leading-tight">person 💌</p>
        <p className="mt-1 hand text-[13px] text-brown/60">
          share the link — they join your space
        </p>
      </div>

      {/* Code card */}
      <Card tint="pink" className="px-5 py-5 mb-3">
        {creating || !code ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-coral/60" />
          </div>
        ) : (
          <>
            <p className="hand text-[12px] text-brown/50 text-center mb-2 uppercase tracking-widest">
              your invite code
            </p>
            {/* Big code display */}
            <div className="flex justify-center gap-1.5 mb-3">
              {code.split("").map((char, i) => (
                <div
                  key={i}
                  className="w-10 h-12 flex items-center justify-center rounded-xl bg-white/70 border border-pink/30 handwrite text-[26px] text-ink shadow-sm"
                >
                  {char}
                </div>
              ))}
            </div>
            <p className="hand text-[11px] text-brown/40 text-center">
              expires in {expiresDays} day{expiresDays !== 1 ? "s" : ""}
            </p>
          </>
        )}
      </Card>

      {/* Copy + Share */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleCopy}
          disabled={!code}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border bg-white py-3 hand text-[14px] font-semibold text-ink shadow-sm disabled:opacity-40 transition active:scale-[0.98]"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-brown/60" />
          )}
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          onClick={handleShare}
          disabled={!code}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 hand text-[14px] font-semibold text-white shadow-sm disabled:opacity-40 transition active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {/* Quick-share row */}
      {code && (
        <div className="flex justify-center gap-4 mb-5">
          <a
            href={`sms:?&body=${encodeURIComponent(shareText(code))}`}
            className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition"
          >
            <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="hand text-[11px] text-brown/60">iMessage</span>
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText(code))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.523 5.845L.057 23.535a.5.5 0 0 0 .608.608l5.69-1.466A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.51-5.17-1.402l-.371-.22-3.374.869.888-3.287-.242-.389A9.96 9.96 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
            </div>
            <span className="hand text-[11px] text-brown/60">WhatsApp</span>
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("join my scrapbook 🌸")}&body=${encodeURIComponent(shareText(code))}`}
            className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition"
          >
            <div className="w-11 h-11 rounded-full bg-coral flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="hand text-[11px] text-brown/60">Email</span>
          </a>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => router.push("/home")}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 hand text-[15px] font-semibold text-white shadow-sm transition active:scale-[0.98] mb-3"
      >
        Continue to home →
      </button>
      <button
        onClick={() => router.push("/home")}
        className="w-full hand text-[13px] text-brown/50 text-center py-2"
      >
        Skip for now
      </button>
    </PhoneFrame>
  );
}
