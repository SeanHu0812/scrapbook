import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership) return [];
    const rows = await ctx.db
      .query("memories")
      .withIndex("by_space_date", (q) => q.eq("spaceId", membership.spaceId))
      .order("desc")
      .take(100);
    return Promise.all(
      rows.map(async (m) => {
        const firstAsset = await ctx.db
          .query("mediaAssets")
          .withIndex("by_memory", (q) => q.eq("memoryId", m._id))
          .first();
        const firstPhotoUrl = firstAsset
          ? await ctx.storage.getUrl(firstAsset.storageId)
          : null;
        return { ...m, firstPhotoUrl };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("memories") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const memory = await ctx.db.get(id);
    if (!memory) return null;
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership || membership.spaceId !== memory.spaceId) return null;

    // Fetch uploaded photos for this memory
    const assets = await ctx.db
      .query("mediaAssets")
      .withIndex("by_memory", (q) => q.eq("memoryId", id))
      .take(10);
    type PhotoEntry = { url: string; storageId: (typeof assets)[number]["storageId"] };
    const photoEntries: PhotoEntry[] = [];
    for (const a of assets.filter((a) => a.kind === "photo")) {
      const url = await ctx.storage.getUrl(a.storageId);
      if (url) photoEntries.push({ url, storageId: a.storageId });
    }

    const audioUrl = memory.audioStorageId
      ? await ctx.storage.getUrl(memory.audioStorageId)
      : null;

    return {
      ...memory,
      photoUrls: photoEntries.map((e) => e.url),
      photos: photoEntries,
      audioUrl,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    caption: v.string(),
    body: v.string(),
    date: v.string(),
    weekday: v.string(),
    weather: v.union(v.literal("sunny"), v.literal("cloudy"), v.literal("rainy")),
    location: v.optional(v.string()),
    stickers: v.optional(v.array(v.string())),
    scene: v.string(),
    photoStorageIds: v.optional(v.array(v.id("_storage"))),
    audioStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { photoStorageIds, audioStorageId, ...args }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership) throw new Error("No space found");

    const memoryId = await ctx.db.insert("memories", {
      ...args,
      spaceId: membership.spaceId,
      authorId: userId,
      ...(audioStorageId ? { audioStorageId } : {}),
    });

    for (const storageId of photoStorageIds ?? []) {
      await ctx.db.insert("mediaAssets", {
        storageId,
        uploadedBy: userId,
        spaceId: membership.spaceId,
        kind: "photo",
        memoryId,
      });
    }

    return memoryId;
  },
});

export const addPhotos = mutation({
  args: {
    id: v.id("memories"),
    photoStorageIds: v.array(v.id("_storage")),
  },
  handler: async (ctx, { id, photoStorageIds }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const memory = await ctx.db.get(id);
    if (!memory) throw new Error("Not found");
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership || membership.spaceId !== memory.spaceId) throw new Error("Forbidden");
    for (const storageId of photoStorageIds) {
      await ctx.db.insert("mediaAssets", {
        storageId,
        uploadedBy: userId,
        spaceId: memory.spaceId,
        kind: "photo",
        memoryId: id,
      });
    }
    if (memory.scene === "photo" || photoStorageIds.length > 0) {
      await ctx.db.patch(id, { scene: "photo" });
    }
  },
});

export const removePhoto = mutation({
  args: { memoryId: v.id("memories"), storageId: v.id("_storage") },
  handler: async (ctx, { memoryId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const memory = await ctx.db.get(memoryId);
    if (!memory) throw new Error("Not found");
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership || membership.spaceId !== memory.spaceId) throw new Error("Forbidden");
    const asset = await ctx.db
      .query("mediaAssets")
      .withIndex("by_memory", (q) => q.eq("memoryId", memoryId))
      .filter((q) => q.eq(q.field("storageId"), storageId))
      .first();
    if (asset) await ctx.db.delete(asset._id);
    const remaining = await ctx.db
      .query("mediaAssets")
      .withIndex("by_memory", (q) => q.eq("memoryId", memoryId))
      .collect();
    if (remaining.length === 0) {
      const scenes = ["coffee","couple","sunset","flowers","airplane","river"];
      await ctx.db.patch(memoryId, { scene: scenes[Math.floor(Math.random() * scenes.length)] });
    }
  },
});

export const update = mutation({
  args: {
    id: v.id("memories"),
    title: v.optional(v.string()),
    caption: v.optional(v.string()),
    body: v.optional(v.string()),
    date: v.optional(v.string()),
    weekday: v.optional(v.string()),
    weather: v.optional(v.union(v.literal("sunny"), v.literal("cloudy"), v.literal("rainy"))),
    location: v.optional(v.string()),
    stickers: v.optional(v.array(v.string())),
    scene: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const memory = await ctx.db.get(id);
    if (!memory) throw new Error("Not found");
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership || membership.spaceId !== memory.spaceId)
      throw new Error("Forbidden");
    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const memory = await ctx.db.get(id);
    if (!memory) return;
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership || membership.spaceId !== memory.spaceId)
      throw new Error("Forbidden");
    await ctx.db.delete(id);
  },
});
