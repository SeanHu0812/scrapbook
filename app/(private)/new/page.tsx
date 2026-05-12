"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { Loader2, Calendar as CalIcon, Pencil, Mic, Square, MapPin, X } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Card } from "@/components/ui/Card";
import { LocationSearch } from "@/components/ui/LocationSearch";
import { PhotoStack, type StackPhoto } from "@/components/ui/PhotoStack";
import { Sun } from "@/components/decorations";

const SCENES = ["coffee","couple","sunset","flowers","airplane","river"] as const;

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
function formatDuration(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

type UploadedPhoto = { storageId: Id<"_storage">; previewUrl: string };

export default function NewMemoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createMemory = useMutation(api.memories.create);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [body, setBody] = useState("");
  const [title, setTitle] = useState(searchParams.get("prefillTitle") ?? "");
  const [date, setDate] = useState(searchParams.get("prefillDate") || todayIso());
  const [location, setLocation] = useState("");

  // Photos — unlimited
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploadingPhoto(true);
    setError("");
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
        setPhotos((cur) => [...cur, { storageId, previewUrl }]);
      }
    } catch {
      setError("Photo upload failed. Try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removePhoto(storageId: string) {
    setPhotos((cur) => cur.filter((p) => p.storageId !== storageId));
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
        setAudioBlob(blob);
        setAudioPreviewUrl(URL.createObjectURL(blob));
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => {
          if (s >= 59) { stopRecording(); return 60; }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError("Microphone access denied.");
    }
  }

  const stopRecording = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setRecording(false);
  }, []);

  function discardAudio() {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setRecordingSeconds(0);
  }

  async function handleSave() {
    const resolvedTitle =
      title.trim() ||
      body.trim().split("\n")[0].slice(0, 40) ||
      formatDisplayDate(date);
    if (!resolvedTitle) { setError("Add a title or description."); return; }
    setError("");
    setSaving(true);
    try {
      let audioStorageId: Id<"_storage"> | undefined;
      if (audioBlob) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": audioBlob.type || "audio/webm" },
          body: audioBlob,
        });
        const { storageId } = await res.json();
        audioStorageId = storageId;
      }
      const scene = photos.length > 0 ? "photo" : SCENES[Math.floor(Math.random() * SCENES.length)];
      const id = await createMemory({
        title: resolvedTitle,
        body: body.trim(),
        date,
        weekday: weekdayOf(date),
        scene,
        location: location.trim() || undefined,
        photoStorageIds: photos.map((p) => p.storageId),
        audioStorageId,
      });
      router.replace(`/memory/${id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSaving(false);
    }
  }

  const stackPhotos: StackPhoto[] = photos.map((p) => ({
    key: p.storageId,
    src: p.previewUrl,
    storageId: p.storageId,
  }));

  return (
    <PhoneFrame>
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 hover:bg-white/60"
        >
          <span className="text-xl leading-none">✕</span>
        </button>
        <h1 className="hand text-[18px] font-semibold tracking-wide text-ink">New memory</h1>
        <button
          onClick={handleSave}
          disabled={saving || uploadingPhoto || recording}
          className="flex items-center gap-1.5 rounded-full bg-pink px-5 py-2 text-[14px] font-semibold text-white shadow-[0_6px_14px_-6px_rgba(244,125,142,0.7)] disabled:opacity-60"
        >
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Save
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

      {/* Title */}
      <div className="mt-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give this memory a title…"
          maxLength={60}
          className="w-full bg-transparent hand text-[17px] font-semibold text-ink placeholder:text-brown/40 focus:outline-none"
        />
      </div>

      {/* Body */}
      <div className="mt-3">
        <Card tint="white" className="p-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-brown/50 focus:outline-none"
            placeholder="How was our day? (optional)"
          />
        </Card>
      </div>

      {error && <p className="mt-2 hand text-[13px] text-coral">{error}</p>}

      {/* ── Photo section ── */}
      <div className="mt-6">
        <p className="hand text-[14px] font-semibold text-brown mb-4">Photos</p>
        <PhotoStack
          photos={stackPhotos}
          onAdd={() => fileInputRef.current?.click()}
          onRemove={removePhoto}
          uploading={uploadingPhoto}
        />
      </div>

      {/* ── Voice section ── */}
      <div className="mt-6">
        <p className="hand text-[14px] font-semibold text-brown mb-3">Voice memo</p>
        {audioPreviewUrl ? (
          <div className="rounded-2xl border border-border bg-white p-4 flex flex-col gap-3">
            <audio src={audioPreviewUrl} controls className="w-full h-8" style={{ colorScheme: "light" }} />
            <button
              onClick={discardAudio}
              className="flex items-center gap-1.5 text-[12px] text-brown/60 hover:text-coral transition self-start"
            >
              <X className="h-3.5 w-3.5" /> Discard recording
            </button>
          </div>
        ) : recording ? (
          <div className="flex items-center justify-between rounded-2xl border-2 border-coral bg-pink-soft px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-coral animate-pulse" />
              <span className="hand text-[15px] font-semibold text-coral">{formatDuration(recordingSeconds)}</span>
            </div>
            <button
              onClick={stopRecording}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white shadow-md"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-brown/40 px-5 py-4 text-brown/60 hover:border-coral hover:text-coral transition"
          >
            <Mic className="h-5 w-5 shrink-0" />
            <span className="hand text-[14px] font-semibold">Tap to record (up to 60s)</span>
          </button>
        )}
      </div>

      {/* ── Location section ── */}
      <div className="mt-6">
        <p className="hand text-[14px] font-semibold text-brown mb-3">Location</p>
        {location ? (
          <div className="flex items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-[14px]">
            <span className="flex items-center gap-2 font-semibold text-ink">
              <MapPin className="h-4 w-4 text-coral shrink-0" />
              {location}
            </span>
            <button onClick={() => setLocation("")} className="text-brown/50 hover:text-coral ml-2 shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <LocationSearch value={location} onChange={setLocation} />
        )}
      </div>

      <div className="pb-10" />

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
