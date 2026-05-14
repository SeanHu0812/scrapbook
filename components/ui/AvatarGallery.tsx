"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Camera, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { ImageCropModal } from "./ImageCropModal";

const PRESETS = ["a01", "a02", "a03", "a04", "a05", "a06", "a07", "a08"];

type Props = {
  selectedPreset: string | null;
  onSelectPreset: (id: string) => void;
  onUpload: (storageId: string, previewUrl: string) => void;
  uploadPreviewUrl?: string | null;
};

export function AvatarGallery({ selectedPreset, onSelectPreset, onUpload, uploadPreviewUrl }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setCropUrl(blobUrl);
    // reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleCropConfirm(blob: Blob) {
    setCropUrl(null);
    const previewUrl = URL.createObjectURL(blob);
    setUploadError("");
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type || "image/jpeg" },
        body: blob,
      });
      const { storageId } = await res.json();
      onUpload(storageId, previewUrl);
    } catch {
      setUploadError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleCropCancel() {
    if (cropUrl) URL.revokeObjectURL(cropUrl);
    setCropUrl(null);
  }

  const isUploadSelected = !selectedPreset && !!uploadPreviewUrl;

  return (
    <>
      <div className="space-y-2">
        <p className="hand text-[13px] text-brown/70">Choose an avatar</p>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelectPreset(id)}
              className={`aspect-square rounded-2xl overflow-hidden border-2 transition active:scale-95 ${
                selectedPreset === id
                  ? "border-coral shadow-[0_0_0_3px_rgba(249,133,146,0.25)]"
                  : "border-border hover:border-brown/30"
              }`}
            >
              <img src={`/avatars/${id}.svg`} alt={`Avatar ${id}`} className="w-full h-full object-cover" />
            </button>
          ))}

          {/* Upload tile */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition active:scale-95 overflow-hidden ${
              isUploadSelected
                ? "border-coral shadow-[0_0_0_3px_rgba(249,133,146,0.25)]"
                : "border-border hover:border-brown/30 bg-cream"
            }`}
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-coral" />
            ) : uploadPreviewUrl ? (
              <img src={uploadPreviewUrl} alt="Your photo" className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera className="h-5 w-5 text-brown/50" />
                <span className="hand text-[10px] text-brown/50 leading-none">Upload</span>
              </>
            )}
          </button>
        </div>
        {uploadError && <p className="hand text-[12px] text-coral">{uploadError}</p>}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>

      {cropUrl && (
        <ImageCropModal
          imageUrl={cropUrl}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
