"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, Loader2, Trash2, Camera, Pencil, X, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Polaroid } from "@/components/ui/Polaroid";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { PhotoLightbox, type LightboxPhoto } from "@/components/ui/PhotoLightbox";
import { PhotoStack, type StackPhoto } from "@/components/ui/PhotoStack";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Sun } from "@/components/decorations";

export default function MemoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const memoryId = id as Id<"memories">;

  const memory = useQuery(api.memories.get, { id: memoryId });
  const reactionData = useQuery(api.reactions.countsForMemory, { memoryId });
  const comments = useQuery(api.comments.listForMemory, { memoryId });
  const currentUser = useQuery(api.users.getCurrentUser);

  const toggleHeart = useMutation(api.reactions.toggle);
  const addComment = useMutation(api.comments.add);
  const removeComment = useMutation(api.comments.remove);
  const removeMemory = useMutation(api.memories.remove);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const addPhotos = useMutation(api.memories.addPhotos);

  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const liked = reactionData?.liked ?? false;
  const commentCount = comments?.length ?? 0;

  async function submitComment() {
    if (!draft.trim()) return;
    setSending(true);
    try {
      await addComment({ memoryId, body: draft.trim() });
      setDraft("");
    } finally {
      setSending(false);
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3);
    if (!files.length) return;
    setUploading(true);
    try {
      const ids: Id<"_storage">[] = [];
      for (const file of files) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();
        ids.push(storageId);
      }
      await addPhotos({ id: memoryId, photoStorageIds: ids });
    } finally {
      setUploading(false);
      setShowOptions(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    await removeMemory({ id: memoryId });
    router.replace("/home");
  }

  if (memory === undefined) {
    return (
      <PhoneFrame>
        <BackHeader />
        <div className="mt-8 space-y-4 animate-pulse px-1">
          <div className="h-4 w-32 rounded-full bg-border" />
          <div className="flex justify-center">
            <div className="h-64 w-64 rounded-2xl bg-border" />
          </div>
          <div className="h-6 w-3/4 rounded-full bg-border" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-border" />
            <div className="h-4 w-full rounded-full bg-border" />
            <div className="h-4 w-2/3 rounded-full bg-border" />
          </div>
        </div>
      </PhoneFrame>
    );
  }

  if (memory === null) {
    return (
      <PhoneFrame>
        <BackHeader />
        <div className="mt-20 text-center">
          <p className="handwrite text-[28px] text-coral mb-2">not found 🔍</p>
          <p className="hand text-[14px] text-brown/60">This memory doesn't exist or you don't have access.</p>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <BackHeader
        trailing={
          <button
            onClick={() => setShowOptions(true)}
            aria-label="More options"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
          >
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

      {/* Photos */}
      <div className="mt-5">
        {memory.photoUrls.length > 0 ? (
          <PhotoStack
            photos={memory.photos.map((p): StackPhoto => ({ key: p.storageId, src: p.url }))}
            onTap={(i) => setLightboxIndex(i)}
          />
        ) : (
          <div className="flex justify-center">
            <Polaroid rotate={-2} tapeColor="yellow">
              <PhotoPlaceholder scene={memory.scene as any} className="h-60 w-64" />
            </Polaroid>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={memory.photos.map((p): LightboxPhoto => ({ url: p.url, storageId: p.storageId }))}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          memoryId={memoryId}
        />
      )}

      <h2 className="mt-6 hand text-[22px] font-semibold text-ink">
        {memory.title}{" "}
        <span className="inline-block align-baseline">🌿</span>
      </h2>

      {memory.body && (
        <p className="mt-2 hand text-[16px] leading-relaxed text-ink/90 whitespace-pre-line">
          {memory.body}
        </p>
      )}

      {/* Location */}
      {memory.location && (
        <p className="mt-3 hand text-[13px] text-brown/70">📍 {memory.location}</p>
      )}

      {/* Voice memo */}
      {memory.audioUrl && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3">
          <Mic className="h-4 w-4 shrink-0 text-coral" />
          <audio src={memory.audioUrl} controls className="flex-1 h-8" style={{ colorScheme: "light" }} />
        </div>
      )}

      {/* Reaction row */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleHeart({ memoryId })}
            className="flex items-center justify-center"
          >
            <Heart
              className={`h-6 w-6 transition ${liked ? "fill-coral text-coral scale-110" : "text-coral/70"}`}
            />
          </button>
          <span className="flex items-center gap-1.5 text-[14px] text-brown">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-ink">{commentCount}</span>
          </span>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full text-brown/60">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Comments section */}
      <div className="mt-4">
        <h3 className="hand text-[15px] font-semibold text-brown/80 mb-3">
          {commentCount === 0 ? "Be the first to comment" : `${commentCount} comment${commentCount === 1 ? "" : "s"}`}
        </h3>

        {comments === undefined ? (
          <div className="animate-pulse space-y-2">
            <div className="h-12 rounded-xl bg-border" />
            <div className="h-12 rounded-xl bg-border" />
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <CommentRow
                key={c._id}
                authorName={c.authorName}
                avatarPreset={c.authorAvatarPreset ?? undefined}
                avatarUrl={c.authorAvatarUrl ?? undefined}
                body={c.body}
                createdAt={c.createdAt}
                photoThumbnailUrl={c.photoThumbnailUrl ?? undefined}
                canDelete={c.authorId === currentUser?._id}
                onDelete={() => removeComment({ id: c._id })}
              />
            ))}
          </div>
        )}

        {/* Comment composer */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2.5">
          {currentUser && (
            <UserAvatar
              name={currentUser.name}
              avatarPreset={currentUser.avatarPreset ?? undefined}
              size={28}
            />
          )}
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
            placeholder="Add a comment…"
            className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-brown/50 focus:outline-none"
          />
          <button
            onClick={submitComment}
            disabled={sending || !draft.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink text-white disabled:opacity-40 transition"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* FAB — upload photo */}
      <div className="sticky bottom-4 flex justify-end mt-6">
        <button
          onClick={() => photoInputRef.current?.click()}
          disabled={uploading}
          aria-label="Add photo"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-pink text-white shadow-[0_8px_20px_-8px_rgba(244,125,142,0.8)] disabled:opacity-60 transition hover:scale-105"
        >
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
        </button>
      </div>

      <div className="pb-4" />

      {/* Hidden photo input */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* Options bottom sheet */}
      {showOptions && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => { setShowOptions(false); setConfirmDelete(false); }}
          />
          <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 rounded-t-3xl bg-cream px-5 pb-10 pt-5 shadow-[0_-8px_40px_-8px_rgba(108,90,78,0.2)]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            {confirmDelete ? (
              <div className="space-y-3 text-center">
                <p className="hand text-[16px] font-semibold text-ink">Delete this memory?</p>
                <p className="text-[13px] text-brown/70">This can't be undone.</p>
                <button
                  onClick={handleDelete}
                  className="w-full rounded-2xl bg-red-500 py-3 text-[15px] font-semibold text-white"
                >
                  Yes, delete it
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="w-full rounded-2xl bg-white border border-border py-3 text-[15px] font-semibold text-ink"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <OptionsRow
                  icon={<Pencil className="h-5 w-5 text-coral" />}
                  label="Edit memory"
                  onClick={() => {
                    setShowOptions(false);
                    router.push(`/memory/${memoryId}/edit`);
                  }}
                />
                <OptionsRow
                  icon={
                    uploading
                      ? <Loader2 className="h-5 w-5 animate-spin text-brown/60" />
                      : <Camera className="h-5 w-5 text-coral" />
                  }
                  label="Upload photos"
                  onClick={() => photoInputRef.current?.click()}
                />
                <div className="my-2 h-px bg-border" />
                <OptionsRow
                  icon={<Trash2 className="h-5 w-5 text-red-500" />}
                  label="Delete memory"
                  labelClass="text-red-500"
                  onClick={() => setConfirmDelete(true)}
                />
              </div>
            )}
          </div>
        </>
      )}
    </PhoneFrame>
  );
}

function OptionsRow({
  icon,
  label,
  labelClass = "text-ink",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  labelClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl bg-white border border-border px-4 py-3.5 text-left hover:bg-pink-soft transition"
    >
      {icon}
      <span className={`hand text-[16px] font-semibold ${labelClass}`}>{label}</span>
    </button>
  );
}

function CommentRow({
  authorName,
  avatarPreset,
  avatarUrl,
  body,
  createdAt,
  photoThumbnailUrl,
  canDelete,
  onDelete,
}: {
  authorName: string;
  avatarPreset?: string;
  avatarUrl?: string;
  body: string;
  createdAt: number;
  photoThumbnailUrl?: string;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <UserAvatar name={authorName} avatarPreset={avatarPreset} avatarUrl={avatarUrl} size={32} />
      <div className="flex-1 rounded-2xl bg-white/80 px-3 py-2 border border-border">
        {photoThumbnailUrl && (
          <div className="mb-2 flex items-center gap-2">
            <img
              src={photoThumbnailUrl}
              alt=""
              className="h-10 w-10 rounded-lg object-cover border-2 border-white shadow-sm"
            />
            <span className="text-[11px] text-brown/50 italic">on a photo</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-semibold text-brown">{authorName}</span>
          <span className="text-[11px] text-brown/50 shrink-0">{relativeTime(createdAt)}</span>
        </div>
        <p className="hand text-[14px] text-ink mt-0.5 leading-snug">{body}</p>
      </div>
      {canDelete && (
        <button onClick={onDelete} className="mt-2 text-brown/30 hover:text-red-400 transition">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[m - 1]} ${d}, ${iso.slice(0, 4)}`;
}

function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}
