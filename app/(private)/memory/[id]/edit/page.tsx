"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Loader2, Calendar as CalIcon, Pencil, Camera, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Card } from "@/components/ui/Card";
import { Tape } from "@/components/ui/Tape";
import { LocationSearch } from "@/components/ui/LocationSearch";
import { Sun } from "@/components/decorations";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
function weekdayOf(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "long" });
}
function formatDisplayDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[m - 1]} ${d}, ${iso.slice(0, 4)}`;
}

type NewPhoto = { storageId: Id<"_storage">; previewUrl: string };

export default function EditMemoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const memoryId = id as Id<"memories">;

  const memory = useQuery(api.memories.get, { id: memoryId });
  const updateMemory = useMutation(api.memories.update);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const addPhotos = useMutation(api.memories.addPhotos);
  const removePhoto = useMutation(api.memories.removePhoto);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(todayIso());
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (memory && !loaded) {
      setTitle(memory.title);
      setBody(memory.body);
      setDate(memory.date);
      setLocation(memory.location ?? "");
      setLoaded(true);
    }
  }, [memory, loaded]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const existingCount = (memory?.photos.length ?? 0) + newPhotos.length;
    const files = Array.from(e.target.files ?? []).slice(0, Math.max(0, 6 - existingCount));
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const previewUrl = URL.createObjectURL(file);
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await res.json();
        setNewPhotos((cur) => [...cur, { storageId, previewUrl }]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave() {
    const resolvedTitle = title.trim() || body.trim().split("\n")[0].slice(0, 40) || formatDisplayDate(date);
    if (!resolvedTitle) { setError("Add a title or description."); return; }
    setError("");
    setSaving(true);
    try {
      await updateMemory({
        id: memoryId,
        title: resolvedTitle,
        caption: body.trim().slice(0, 80),
        body: body.trim(),
        date,
        weekday: weekdayOf(date),
        location: location.trim() || undefined,
      });
      if (newPhotos.length > 0) {
        await addPhotos({ id: memoryId, photoStorageIds: newPhotos.map((p) => p.storageId) });
      }
      router.replace(`/memory/${memoryId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  }

  if (memory === undefined) {
    return (
      <PhoneFrame>
        <div className="mt-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-coral" />
        </div>
      </PhoneFrame>
    );
  }

  if (memory === null) {
    return (
      <PhoneFrame>
        <div className="mt-20 text-center">
          <p className="hand text-[14px] text-brown/60">Memory not found.</p>
        </div>
      </PhoneFrame>
    );
  }

  const totalPhotos = memory.photos.length + newPhotos.length;
  const canAddMore = totalPhotos < 6;

  return (
    <PhoneFrame>
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          aria-label="Cancel"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
        >
          <span className="text-xl leading-none">✕</span>
        </button>
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">Edit memory</h1>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          className="flex items-center gap-1.5 rounded-full bg-pink px-5 py-2 text-[14px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(244,125,142,0.7)] disabled:opacity-60"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Update
        </button>
      </div>

      {/* Date */}
      <div className="mt-3 flex items-center justify-between text-[14px]">
        <label className="relative flex items-center gap-2 text-ink cursor-pointer">
          <CalIcon className="h-4 w-4 text-coral" />
          <span className="font-semibold">{formatDisplayDate(date)}</span>
          <Pencil className="h-3 w-3 text-coral/50" />
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="absolute inset-0 opacity-0 w-full cursor-pointer"
          />
        </label>
        <div className="flex items-center gap-1 text-brown">
          {weekdayOf(date)}
          <Sun className="h-4 w-4" />
        </div>
      </div>

      {/* Photos */}
      <div className="mt-5">
        <p className="hand text-[14px] font-semibold text-brown mb-3">Photos</p>
        <div className="flex flex-wrap gap-3">
          {/* Existing photos */}
          {memory.photos.map((p, i) => (
            <div key={p.storageId} className="relative">
              <Tape
                className="-top-2 left-3"
                color={i % 2 === 0 ? "yellow" : "pink"}
                rotate={i % 2 === 0 ? -8 : 6}
              />
              <div
                className="h-28 w-24 overflow-hidden rounded-xl border-[4px] border-white shadow-md"
                style={{ transform: `rotate(${i % 2 === 0 ? -2 : 3}deg)` }}
              >
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </div>
              <button
                onClick={() => removePhoto({ memoryId, storageId: p.storageId })}
                className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}

          {/* Newly uploaded (not yet saved) */}
          {newPhotos.map((p, i) => {
            const idx = memory.photos.length + i;
            return (
              <div key={p.storageId} className="relative">
                <Tape
                  className="-top-2 left-3"
                  color={idx % 2 === 0 ? "yellow" : "pink"}
                  rotate={idx % 2 === 0 ? -8 : 6}
                />
                <div
                  className="h-28 w-24 overflow-hidden rounded-xl border-[4px] border-white shadow-md ring-2 ring-coral/40"
                  style={{ transform: `rotate(${idx % 2 === 0 ? -2 : 3}deg)` }}
                >
                  <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <button
                  onClick={() => setNewPhotos((cur) => cur.filter((x) => x.storageId !== p.storageId))}
                  className="absolute -right-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-coral text-white shadow"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}

          {/* Add more button */}
          {canAddMore && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-3 flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brown/40 text-brown/60 hover:border-coral hover:text-coral transition disabled:opacity-50"
            >
              {uploading
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : <><Camera className="h-5 w-5 mb-1" /><span className="text-[11px]">Add photo</span></>
              }
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mt-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title…"
          maxLength={60}
          className="w-full bg-transparent hand text-[17px] font-semibold text-ink placeholder:text-brown/40 focus:outline-none"
        />
      </div>

      {/* Body */}
      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <p className="hand text-[18px] font-semibold">How was our day?</p>
        </div>
        <Card tint="white" className="p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-brown/50 focus:outline-none"
            placeholder="Write what happened… (optional)"
          />
        </Card>
      </div>

      {error && <p className="mt-2 hand text-[13px] text-coral">{error}</p>}

      {/* Location */}
      <div className="mt-5">
        <p className="hand text-[14px] font-semibold text-brown mb-2">Location</p>
        <LocationSearch value={location} onChange={setLocation} />
      </div>

      <div className="pb-8" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handlePhotoSelect}
      />
    </PhoneFrame>
  );
}
