"use client";

import Link from "next/link";
import React, { useState, useRef } from "react";
import {
  Settings,
  ChevronRight,
  MapPin,
  Music2,
  Camera,
  X,
  Search,
  Loader2,
  CalendarDays,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useSpace } from "@/lib/useSpace";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AvatarGallery } from "@/components/ui/AvatarGallery";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { HeartTiny } from "@/components/decorations";

// ── Types ──────────────────────────────────────────────────────────────────────

type SheetType =
  | "profile"
  | "fav-memory"
  | "fav-photos"
  | "fav-song"
  | "fav-places"
  | "fav-movie"
  | "fav-activities"
  | "anniversary"
  | null;

// ── Helpers ────────────────────────────────────────────────────────────────────

function daysTogether(startDate: string | null | undefined): number | null {
  if (!startDate) return null;
  const [y, m, d] = startDate.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86400000) + 1);
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[m - 1]} ${d}, ${iso.slice(0, 4)}`;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { status, space, members, currentUser } = useSpace();
  const stats = useQuery(api.spaces.stats) ?? { memoriesCount: 0, photosCount: 0, voiceNotesCount: 0 };
  const favorites = useQuery(api.favorites.get);
  const memories = useQuery(api.memories.list) ?? [];
  const upsertFavorites = useMutation(api.favorites.upsert);
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateStartDate = useMutation(api.spaces.updateStartDate);

  const [sheet, setSheet] = useState<SheetType>(null);
  const [photoLightboxIndex, setPhotoLightboxIndex] = useState<number | null>(null);

  const isSolo = status === "solo";
  const nameDisplay =
    members.length >= 2
      ? `${members[0].name} & ${members[1].name}`
      : members[0]?.name ?? "";

  const days = daysTogether(space?.startDate);
  // Resolve current user's avatar URL from the already-fetched members list
  const myMember = members.find((m) => m.userId === currentUser?._id);

  const closeSheet = () => setSheet(null);

  return (
    <PhoneFrame withNav>
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <span className="h-9 w-9" />
        <h1 className="hand text-[18px] font-semibold tracking-wide">Profile</h1>
        <Link
          href="/settings"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80"
        >
          <Settings className="h-5 w-5" />
        </Link>
      </div>

      {/* Day counter card */}
      <Card tint="white" className="mt-3 px-5 py-6 text-center">
        <div className="flex justify-center items-center gap-3">
          {members[0] && (
            <UserAvatar
              name={members[0].name}
              avatarPreset={members[0].avatarPreset}
              avatarUrl={members[0].avatarUrl}
              size={68}
            />
          )}
          {members.length >= 2 ? (
            <>
              <HeartTiny className="h-5 w-5 text-coral" />
              <UserAvatar
                name={members[1].name}
                avatarPreset={members[1].avatarPreset}
                avatarUrl={members[1].avatarUrl}
                size={68}
              />
            </>
          ) : null}
          {members.length === 0 && (
            <div className="h-[68px] w-[68px] rounded-full bg-border animate-pulse" />
          )}
        </div>
        <p className="mt-3 hand text-[20px] font-semibold text-ink">{nameDisplay}</p>

        {days !== null ? (
          <>
            <p className="hand text-[52px] font-bold text-coral leading-none mt-2">
              Day {days}
            </p>
            <button
              onClick={() => setSheet("anniversary")}
              className="hand text-[14px] text-brown/70 mt-1 hover:text-coral transition"
            >
              since {formatDate(space!.startDate!)} ✏️
            </button>
          </>
        ) : (
          <button
            onClick={() => setSheet("anniversary")}
            className="mt-2 text-[13px] text-coral underline"
          >
            Set your anniversary →
          </button>
        )}

        {isSolo && (
          <p className="mt-2 text-[13px] text-brown/60">
            it&apos;s just you for now —{" "}
            <Link href="/onboarding/invite" className="text-coral underline">
              invite your partner
            </Link>
          </p>
        )}
      </Card>

      {/* Edit profile row */}
      <button
        onClick={() => setSheet("profile")}
        className="mt-4 w-full flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_12px_-4px_rgba(108,90,78,0.12)] active:scale-[0.99]"
      >
        {currentUser && (
          <UserAvatar
            name={currentUser.name}
            avatarPreset={currentUser.avatarPreset}
            avatarUrl={myMember?.avatarUrl ?? undefined}
            size={44}
          />
        )}
        <div className="flex-1 text-left">
          <p className="hand text-[15px] font-semibold text-ink leading-tight">
            {currentUser?.name ?? ""}
            {currentUser?.nickname ? (
              <span className="text-brown/60 font-normal"> ({currentUser.nickname})</span>
            ) : null}
          </p>
          <p className="text-[12px] text-brown/60">Your profile</p>
        </div>
        <span className="rounded-full bg-pink/10 px-3 py-1 text-[12px] font-semibold text-coral">
          Edit →
        </span>
      </button>

      {/* Stats */}
      <section className="mt-5">
        <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">
          Our little stats
        </h2>
        <Card tint="white" className="grid grid-cols-3 divide-x divide-border p-3 text-center">
          <Stat tint="bg-pink-soft" emoji="🎀" value={stats.memoriesCount} label="Memories" />
          <Stat tint="bg-blue-soft" emoji="🖼️" value={stats.photosCount} label="Photos" />
          <Stat tint="bg-yellow-soft" emoji="🎙️" value={stats.voiceNotesCount} label="Voice notes" />
        </Card>
      </section>

      {/* Favorite photos strip */}
      {favorites?.photoUrls && favorites.photoUrls.length > 0 && (
        <div className="mt-4 flex gap-2">
          {favorites.photoUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setPhotoLightboxIndex(i)}
              className="flex-1 aspect-square overflow-hidden rounded-2xl shadow-md border-2 border-white active:scale-95 transition"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Simple photo lightbox */}
      {photoLightboxIndex !== null && favorites?.photoUrls && (
        <FavPhotosLightbox
          photos={favorites.photoUrls}
          initialIndex={photoLightboxIndex}
          onClose={() => setPhotoLightboxIndex(null)}
        />
      )}

      {/* Favorites */}
      <section className="mt-5">
        <h2 className="hand text-[15px] font-semibold text-brown/80 mb-2">
          Our favorites
        </h2>
        <Card tint="white" className="divide-y divide-border">
          {/* Favorite memory */}
          <FavoriteRow
            leading={
              favorites?.memoryScene ? (
                <PhotoPlaceholder
                  scene={favorites.memoryScene as any}
                  className="h-10 w-10 rounded-xl"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-soft text-[20px]">
                  💝
                </span>
              )
            }
            title="Favorite memory 💝"
            sub={favorites?.memoryTitle
              ? `${favorites.memoryTitle}${favorites.memoryDate ? " · " + formatDate(favorites.memoryDate) : ""}`
              : "Not set yet"}
            onClick={() => setSheet("fav-memory")}
          />

          {/* Favorite photos */}
          <FavoriteRow
            leading={
              favorites?.photoUrls?.length ? (
                <div className="flex gap-0.5">
                  {favorites.photoUrls.slice(0, 2).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ))}
                </div>
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-soft text-[20px]">
                  📸
                </span>
              )
            }
            title="Favorite photos 📸"
            sub={
              favorites?.photoUrls?.length
                ? `${favorites.photoUrls.length} photo${favorites.photoUrls.length !== 1 ? "s" : ""} saved`
                : "Add up to 3 photos"
            }
            onClick={() => setSheet("fav-photos")}
          />

          {/* Song of us */}
          <FavoriteRow
            leading={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-soft text-coral">
                <Music2 className="h-5 w-5" />
              </div>
            }
            title="Song of us 🎵"
            sub={
              favorites?.songName
                ? `${favorites.songArtist ? favorites.songArtist + " – " : ""}${favorites.songName}`
                : "Search a song"
            }
            onClick={() => setSheet("fav-song")}
          />

          {/* Places we love */}
          <FavoriteRow
            leading={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-soft text-coral">
                <MapPin className="h-5 w-5" />
              </div>
            }
            title="Places we love 📍"
            sub={favorites?.places ?? "Add your favorite spots"}
            onClick={() => setSheet("fav-places")}
          />

          {/* Our movie */}
          <FavoriteRow
            leading={
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-soft text-[20px]">
                🎬
              </span>
            }
            title="Our movie 🎬"
            sub={favorites?.movie ?? "What's your go-to film?"}
            onClick={() => setSheet("fav-movie")}
          />

          {/* Our activities */}
          <FavoriteRow
            leading={
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-soft text-[20px]">
                🎪
              </span>
            }
            title="Our activities 🎪"
            sub={favorites?.activities ?? "What do you love doing together?"}
            onClick={() => setSheet("fav-activities")}
          />
        </Card>
      </section>

      <div className="h-6" />
      <BottomNav />

      {/* ── Sheets ─────────────────────────────────────────────────────────── */}

      {sheet !== null && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeSheet}
        />
      )}

      {/* Anniversary sheet */}
      {sheet === "anniversary" && (
        <AnniversarySheet
          currentDate={space?.startDate ?? null}
          onSave={async (date) => {
            await updateStartDate({ startDate: date });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}

      {/* Edit profile sheet */}
      {sheet === "profile" && currentUser && (
        <EditProfileSheet
          currentUser={currentUser}
          currentAvatarUrl={myMember?.avatarUrl ?? null}
          onClose={closeSheet}
          updateProfile={updateProfile}
          generateUploadUrl={generateUploadUrl}
        />
      )}

      {/* Fav memory sheet */}
      {sheet === "fav-memory" && (
        <FavMemorySheet
          memories={memories}
          selectedId={favorites?.memoryId ?? null}
          onSelect={async (id) => {
            await upsertFavorites({ memoryId: id as Id<"memories"> });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}

      {/* Fav photos sheet */}
      {sheet === "fav-photos" && (
        <FavPhotosSheet
          currentPhotoIds={(favorites?.photoStorageIds ?? []) as string[]}
          currentPhotoUrls={favorites?.photoUrls ?? []}
          onDone={async (ids) => {
            await upsertFavorites({ photoStorageIds: ids as any });
            closeSheet();
          }}
          generateUploadUrl={generateUploadUrl}
          onClose={closeSheet}
        />
      )}

      {/* Song sheet */}
      {sheet === "fav-song" && (
        <SongSheet
          currentSongName={favorites?.songName ?? null}
          currentArtist={favorites?.songArtist ?? null}
          onSelect={async (track) => {
            await upsertFavorites({
              songName: track.name,
              songArtist: track.artist,
              spotifyTrackId: track.id,
            });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}

      {/* Text sheets */}
      {sheet === "fav-places" && (
        <TextSheet
          title="Places we love 📍"
          placeholder="Coffee shop on 5th, that park by the river…"
          initialValue={favorites?.places ?? ""}
          onSave={async (v) => {
            await upsertFavorites({ places: v });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}
      {sheet === "fav-movie" && (
        <TextSheet
          title="Our movie 🎬"
          placeholder="What's your go-to film?"
          initialValue={favorites?.movie ?? ""}
          onSave={async (v) => {
            await upsertFavorites({ movie: v });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}
      {sheet === "fav-activities" && (
        <TextSheet
          title="Our activities 🎪"
          placeholder="Hiking, baking, game nights…"
          initialValue={favorites?.activities ?? ""}
          onSave={async (v) => {
            await upsertFavorites({ activities: v });
            closeSheet();
          }}
          onClose={closeSheet}
        />
      )}
    </PhoneFrame>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Stat({
  tint,
  emoji,
  value,
  label,
}: {
  tint: string;
  emoji: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 py-1">
      <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${tint}`}>
        {emoji}
      </span>
      <span className="hand text-[20px] font-semibold leading-none text-ink">{value}</span>
      <span className="text-[12px] text-brown/80">{label}</span>
    </div>
  );
}

function FavoriteRow({
  leading,
  title,
  sub,
  onClick,
}: {
  leading: React.ReactNode;
  title: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 text-left active:bg-cream/60"
    >
      {leading}
      <div className="flex-1 min-w-0">
        <p className="hand text-[15px] font-semibold text-ink leading-tight">{title}</p>
        <p className="text-[12px] text-brown/80 truncate">{sub}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-brown/70" />
    </button>
  );
}

// ── Sheets ─────────────────────────────────────────────────────────────────────

function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 rounded-t-3xl bg-cream px-5 pb-10 pt-5 shadow-[0_-8px_40px_-8px_rgba(108,90,78,0.2)]">
      <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="hand text-[17px] font-semibold text-ink">{title}</h3>
        <button onClick={onClose} className="text-brown/60 hover:text-ink">
          <X className="h-5 w-5" />
        </button>
      </div>
      {children}
    </div>
  );
}

function EditProfileSheet({
  currentUser,
  currentAvatarUrl,
  onClose,
  updateProfile,
  generateUploadUrl,
}: {
  currentUser: {
    name: string;
    avatarPreset?: string | null;
    avatarStorageId?: string | null;
    nickname?: string | null;
    birthday?: string | null;
  };
  currentAvatarUrl?: string | null;
  onClose: () => void;
  updateProfile: ReturnType<typeof useMutation<typeof api.users.updateProfile>>;
  generateUploadUrl: ReturnType<typeof useMutation<typeof api.users.generateUploadUrl>>;
}) {
  const [name, setName] = useState(currentUser.name);
  const [nickname, setNickname] = useState(currentUser.nickname ?? "");
  const [birthday, setBirthday] = useState(currentUser.birthday ?? "");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    currentUser.avatarPreset ?? null
  );
  const [uploadStorageId, setUploadStorageId] = useState<string | null>(
    currentUser.avatarStorageId ?? null
  );
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(
    currentAvatarUrl ?? null,
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatarPreset: selectedPreset ?? undefined,
        avatarStorageId: (!selectedPreset && uploadStorageId ? uploadStorageId : undefined) as any,
        nickname: nickname.trim() || undefined,
        birthday: birthday || undefined,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet title="Edit profile" onClose={onClose}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <AvatarGallery
          selectedPreset={selectedPreset}
          onSelectPreset={(id) => {
            setSelectedPreset(id);
            setUploadStorageId(null);
            setUploadPreviewUrl(null);
          }}
          onUpload={(storageId, previewUrl) => {
            setUploadStorageId(storageId);
            setUploadPreviewUrl(previewUrl);
            setSelectedPreset(null);
          }}
          uploadPreviewUrl={uploadPreviewUrl}
        />

        <div className="space-y-3">
          <div>
            <label className="hand text-[13px] text-brown/70 block mb-1">Name</label>
            <input
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-[15px] text-ink outline-none focus:border-coral"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="hand text-[13px] text-brown/70 block mb-1">Nickname</label>
            <input
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-[15px] text-ink outline-none focus:border-coral"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Sunshine"
            />
          </div>
          <div>
            <label className="hand text-[13px] text-brown/70 block mb-1">Birthday</label>
            <input
              type="date"
              className="w-full rounded-xl border border-border bg-white px-3 py-2 text-[15px] text-ink outline-none focus:border-coral"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full rounded-xl bg-coral py-3 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </BottomSheet>
  );
}

type MemoryItem = {
  _id: string;
  title: string;
  date: string;
  scene: string;
  firstPhotoUrl?: string | null;
};

function FavMemorySheet({
  memories,
  selectedId,
  onSelect,
  onClose,
}: {
  memories: MemoryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <BottomSheet title="Favorite memory 💝" onClose={onClose}>
      <div className="max-h-[60vh] overflow-y-auto space-y-2">
        {memories.length === 0 ? (
          <p className="text-center text-[14px] text-brown/60 py-6">No memories yet</p>
        ) : (
          memories.map((m) => (
            <button
              key={m._id}
              onClick={() => onSelect(m._id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                selectedId === m._id
                  ? "bg-coral/10 ring-1 ring-coral"
                  : "bg-white hover:bg-cream"
              }`}
            >
              {m.firstPhotoUrl ? (
                <img
                  src={m.firstPhotoUrl}
                  alt=""
                  className="h-10 w-10 rounded-xl object-cover shrink-0"
                />
              ) : (
                <PhotoPlaceholder
                  scene={m.scene as any}
                  className="h-10 w-10 rounded-xl shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="hand text-[14px] font-semibold text-ink truncate">{m.title}</p>
                <p className="text-[12px] text-brown/70">{formatDate(m.date)}</p>
              </div>
              {selectedId === m._id && (
                <span className="text-coral text-[12px] font-semibold">Selected</span>
              )}
            </button>
          ))
        )}
      </div>
    </BottomSheet>
  );
}

function FavPhotosSheet({
  currentPhotoIds,
  currentPhotoUrls,
  onDone,
  generateUploadUrl,
  onClose,
}: {
  currentPhotoIds: string[];
  currentPhotoUrls: string[];
  onDone: (ids: string[]) => void;
  generateUploadUrl: () => Promise<string>;
  onClose: () => void;
}) {
  const [photoIds, setPhotoIds] = useState<string[]>(currentPhotoIds);
  const [photoUrls, setPhotoUrls] = useState<string[]>(currentPhotoUrls);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || photoIds.length >= 3) return;
    const preview = URL.createObjectURL(file);
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      setPhotoIds((prev) => [...prev, storageId]);
      setPhotoUrls((prev) => [...prev, preview]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(idx: number) {
    setPhotoIds((prev) => prev.filter((_, i) => i !== idx));
    setPhotoUrls((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <BottomSheet title="Favorite photos 📸" onClose={onClose}>
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {photoUrls.map((url, i) => (
            <div key={i} className="relative h-20 w-20">
              <img src={url} alt="" className="h-full w-full rounded-xl object-cover" />
              <button
                onClick={() => remove(i)}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-coral text-white flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photoIds.length < 3 && (
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 bg-cream"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-coral" />
              ) : (
                <>
                  <Camera className="h-5 w-5 text-brown/50" />
                  <span className="hand text-[10px] text-brown/50">Add</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-[12px] text-brown/60">{photoIds.length}/3 photos added</p>
        <button
          onClick={() => onDone(photoIds)}
          className="w-full rounded-xl bg-coral py-3 text-[15px] font-semibold text-white"
        >
          Done
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </BottomSheet>
  );
}

type SpotifyTrack = {
  id: string;
  name: string;
  artist: string;
  albumArt: string | null;
  previewUrl: string | null;
};

function SongSheet({
  currentSongName,
  currentArtist,
  onSelect,
  onClose,
}: {
  currentSongName: string | null;
  currentArtist: string | null;
  onSelect: (track: SpotifyTrack) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (data.error === "not_configured") {
        setNotConfigured(true);
        setResults([]);
      } else {
        setNotConfigured(false);
        setResults(data.tracks ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <BottomSheet title="Song of us 🎵" onClose={onClose}>
      <div className="space-y-3">
        {currentSongName && (
          <div className="rounded-xl bg-white px-3 py-2.5 flex items-center gap-2">
            <Music2 className="h-4 w-4 text-coral shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="hand text-[13px] font-semibold text-ink truncate">{currentSongName}</p>
              {currentArtist && (
                <p className="text-[12px] text-brown/70 truncate">{currentArtist}</p>
              )}
            </div>
            <span className="text-[11px] text-coral font-semibold">Current</span>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown/50" />
          <input
            className="w-full rounded-xl border border-border bg-white pl-9 pr-3 py-2.5 text-[14px] text-ink outline-none focus:border-coral"
            placeholder="Search a song…"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {notConfigured && (
          <p className="text-[13px] text-brown/60 text-center py-2">
            Spotify search not configured — add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET env vars.
          </p>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-coral" />
          </div>
        )}

        <div className="max-h-[40vh] overflow-y-auto space-y-1">
          {results.map((track) => (
            <button
              key={track.id}
              onClick={() => onSelect(track)}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white text-left"
            >
              {track.albumArt ? (
                <img src={track.albumArt} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-border shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="hand text-[14px] font-semibold text-ink truncate">{track.name}</p>
                <p className="text-[12px] text-brown/70 truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
}

function TextSheet({
  title,
  placeholder,
  initialValue,
  onSave,
  onClose,
}: {
  title: string;
  placeholder: string;
  initialValue: string;
  onSave: (value: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(value.trim());
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet title={title} onClose={onClose}>
      <div className="space-y-3">
        <textarea
          className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-[14px] text-ink outline-none focus:border-coral resize-none"
          rows={4}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-xl bg-coral py-3 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </BottomSheet>
  );
}

function AnniversarySheet({
  currentDate,
  onSave,
  onClose,
}: {
  currentDate: string | null;
  onSave: (date: string) => Promise<void>;
  onClose: () => void;
}) {
  const [date, setDate] = useState(currentDate ?? "");
  const [saving, setSaving] = useState(false);

  function formatDisplay(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    const months = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December",
    ];
    return `${months[m - 1]} ${d}, ${y}`;
  }

  async function handleSave() {
    if (!date) return;
    setSaving(true);
    try {
      await onSave(date);
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheet title="Your anniversary 💕" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-[13px] text-brown/70">
          Set the day you started dating — we'll count every day together.
        </p>

        {/* Stylized date row */}
        <div className="flex items-center gap-3 rounded-2xl bg-white border border-border px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-soft text-coral shrink-0">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-brown/60 uppercase tracking-wide mb-0.5">
              Anniversary date
            </p>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              className="hand text-[16px] font-semibold text-ink bg-transparent outline-none w-full cursor-pointer"
            />
          </div>
          {date && (
            <span className="text-[12px] font-semibold text-coral shrink-0">
              Day {Math.max(0, Math.floor((Date.now() - new Date(date + "T00:00:00").getTime()) / 86400000) + 1)}
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !date}
          className="w-full rounded-xl bg-coral py-3 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save anniversary"}
        </button>
      </div>
    </BottomSheet>
  );
}

function FavPhotosLightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);

  function prev() { setIndex((i) => (i - 1 + photos.length) % photos.length); }
  function next() { setIndex((i) => (i + 1) % photos.length); }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white z-10"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Counter */}
      {photos.length > 1 && (
        <p className="absolute top-5 left-1/2 -translate-x-1/2 text-[13px] text-white/60">
          {index + 1} / {photos.length}
        </p>
      )}

      {/* Image */}
      <img
        src={photos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] max-w-full object-contain rounded-xl"
      />

      {/* Prev / next */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
          >
            ›
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIndex(i); }}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
