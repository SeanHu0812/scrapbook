"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import type { Id } from "@/convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Card } from "@/components/ui/Card";
import { AvatarGallery } from "@/components/ui/AvatarGallery";
import { Sparkle, Heart } from "@/components/decorations";

export default function OnboardingProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromInvite = searchParams.get("from") === "invite";

  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [avatarPreset, setAvatarPreset] = useState<string>("a01");
  const [avatarStorageId, setAvatarStorageId] = useState<string | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSelectPreset(id: string) {
    setAvatarPreset(id);
    setAvatarStorageId(null);
    setUploadPreviewUrl(null);
  }

  function handleUpload(storageId: string, previewUrl: string) {
    setAvatarStorageId(storageId);
    setAvatarPreset("");
    setUploadPreviewUrl(previewUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Please enter your name."); return; }
    if (trimmed.length > 24) { setError("Name must be 24 characters or less."); return; }
    setError("");
    setLoading(true);
    try {
      await updateProfile({
        name: trimmed,
        avatarPreset: avatarStorageId ? undefined : avatarPreset,
        avatarStorageId: avatarStorageId ? (avatarStorageId as Id<"_storage">) : undefined,
      });
      router.push(isFromInvite ? "/home" : "/onboarding/invite");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PhoneFrame>
      {/* Header */}
      <div className="relative mt-6 mb-5 text-center">
        <div className="absolute top-0 right-4 opacity-60">
          <Sparkle className="h-7 w-7" />
        </div>
        <p className="handwrite text-[28px] text-coral leading-tight">your space,</p>
        <p className="handwrite text-[28px] text-coral leading-tight">your face 🌸</p>
        <p className="mt-1 hand text-[13px] text-brown/60">set up how you appear to your partner</p>
      </div>

      <Card tint="white" className="px-5 py-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <AvatarGallery
            selectedPreset={avatarStorageId ? null : avatarPreset}
            onSelectPreset={handleSelectPreset}
            onUpload={handleUpload}
            uploadPreviewUrl={uploadPreviewUrl}
          />

          <div>
            <label className="block hand text-[13px] text-brown/80 mb-1">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. mia"
              maxLength={24}
              autoComplete="nickname"
              className="w-full rounded-2xl border border-border bg-cream px-4 py-3 text-[15px] text-ink placeholder:text-brown/40 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition"
            />
            <p className="mt-1 hand text-[11px] text-brown/50 text-right">{name.length}/24</p>
          </div>

          {error && <p className="hand text-[13px] text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 hand text-[15px] font-semibold text-white shadow-sm disabled:opacity-60 transition active:scale-[0.98]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
            {isFromInvite ? "Save & go home" : "Continue"}
          </button>
        </form>
      </Card>
    </PhoneFrame>
  );
}
