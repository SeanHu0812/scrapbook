"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Download, Share2, Send, Loader2, Check } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export type LightboxPhoto = {
  url: string;
  storageId: string;
};

type Props = {
  photos: LightboxPhoto[];
  initialIndex?: number;
  onClose: () => void;
  memoryId: Id<"memories">;
};

export function PhotoLightbox({ photos, initialIndex = 0, onClose, memoryId }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [showComment, setShowComment] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [justSent, setJustSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const currentPhoto = photos[index];
  const storageId = currentPhoto?.storageId as Id<"_storage">;

  const liked = useQuery(api.reactions.likedPhoto, { memoryId, storageId });
  const toggleLike = useMutation(api.reactions.togglePhoto);
  const addComment = useMutation(api.comments.add);

  function prev() { setIndex((i) => (i > 0 ? i - 1 : photos.length - 1)); }
  function next() { setIndex((i) => (i < photos.length - 1 ? i + 1 : 0)); }

  useEffect(() => {
    setShowComment(false);
    setDraft("");
    setJustSent(false);
  }, [index]);

  useEffect(() => {
    if (showComment) {
      const t = setTimeout(() => commentInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [showComment]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (showComment) setShowComment(false);
        else onClose();
      }
      if (!showComment && e.key === "ArrowLeft") prev();
      if (!showComment && e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  async function handleLike() {
    await toggleLike({ memoryId, storageId });
  }

  async function handleSendComment() {
    if (!draft.trim()) return;
    setSending(true);
    try {
      await addComment({ memoryId, body: draft.trim(), photoStorageId: storageId });
      setDraft("");
      setJustSent(true);
      setTimeout(() => {
        setJustSent(false);
        setShowComment(false);
      }, 1400);
    } finally {
      setSending(false);
    }
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch(currentPhoto.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `memory-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  async function handleShare() {
    setSharing(true);
    try {
      if (typeof navigator.share === "function") {
        try {
          const res = await fetch(currentPhoto.url);
          const blob = await res.blob();
          const file = new File([blob], "memory.jpg", { type: blob.type });
          if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({ files: [file], title: "Memory" });
            return;
          }
        } catch { /* fall through */ }
        try {
          await navigator.share({ url: currentPhoto.url, title: "Memory" });
          return;
        } catch { /* fall through */ }
      }
      // Clipboard fallback
      await navigator.clipboard.writeText(currentPhoto.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (showComment || touchStartX.current === null) return;
        const delta = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
        touchStartX.current = null;
      }}
    >
      {/* Top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-12 pb-4 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
        >
          <X className="h-5 w-5" />
        </button>
        {photos.length > 1 && (
          <span className="rounded-full bg-black/50 px-3 py-1 text-[13px] font-semibold text-white backdrop-blur">
            {index + 1} / {photos.length}
          </span>
        )}
        {/* Heart status top-right */}
        <div className="flex h-9 w-9 items-center justify-center">
          {liked && <Heart className="h-5 w-5 fill-coral text-coral" />}
        </div>
      </div>

      {/* Image */}
      <div
        className="flex flex-1 items-center justify-center"
        onClick={() => { if (showComment) setShowComment(false); }}
      >
        <img
          key={index}
          src={currentPhoto.url}
          alt=""
          draggable={false}
          className="max-h-full max-w-full object-contain select-none"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Nav arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div
          className="absolute flex items-center gap-2"
          style={{ bottom: showComment ? 148 : 100, left: 0, right: 0, justifyContent: "center", transition: "bottom 0.2s ease" }}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-200 ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
            />
          ))}
        </div>
      )}

      {/* Bottom sheet */}
      <div className="bg-black/80 backdrop-blur-xl border-t border-white/10">
        {/* Comment composer (shown above action bar) */}
        {showComment && (
          <div className="px-4 pt-3 pb-2">
            {justSent ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <Check className="h-4 w-4 text-green-400" />
                <span className="text-[14px] font-semibold text-green-400">Added to comments</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5">
                <input
                  ref={commentInputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(); }}
                  placeholder="Comment on this photo…"
                  className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  onClick={handleSendComment}
                  disabled={sending || !draft.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink text-white disabled:opacity-40 transition"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-around px-2 py-4 pb-8">
          {/* Like */}
          <button onClick={handleLike} className="flex flex-col items-center gap-1.5 min-w-[60px]">
            <Heart
              className={`h-6 w-6 transition-all duration-150 ${liked ? "fill-coral text-coral scale-110" : "text-white"}`}
            />
            <span className="text-[11px] font-medium text-white/60">{liked ? "Liked" : "Like"}</span>
          </button>

          {/* Comment */}
          <button onClick={() => setShowComment((s) => !s)} className="flex flex-col items-center gap-1.5 min-w-[60px]">
            <MessageCircle
              className={`h-6 w-6 transition ${showComment ? "text-pink fill-pink/20" : "text-white"}`}
            />
            <span className="text-[11px] font-medium text-white/60">Comment</span>
          </button>

          {/* Download / Save */}
          <button onClick={handleDownload} disabled={downloading} className="flex flex-col items-center gap-1.5 min-w-[60px] disabled:opacity-50">
            {downloading
              ? <Loader2 className="h-6 w-6 text-white animate-spin" />
              : <Download className="h-6 w-6 text-white" />
            }
            <span className="text-[11px] font-medium text-white/60">Save</span>
          </button>

          {/* Share */}
          <button onClick={handleShare} disabled={sharing} className="flex flex-col items-center gap-1.5 min-w-[60px] disabled:opacity-50">
            {sharing ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : copied ? (
              <Check className="h-6 w-6 text-green-400" />
            ) : (
              <Share2 className="h-6 w-6 text-white" />
            )}
            <span className="text-[11px] font-medium text-white/60">{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
