import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const mySpace = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!membership) return null;

    const space = await ctx.db.get(membership.spaceId);
    if (!space) return null;

    const allMemberships = await ctx.db
      .query("memberships")
      .withIndex("by_space", (q) => q.eq("spaceId", space._id))
      .collect();

    const members = (
      await Promise.all(
        allMemberships.map(async (m) => {
          const user = await ctx.db.get(m.userId);
          if (!user) return null;
          const avatarUrl = user.avatarStorageId
            ? await ctx.storage.getUrl(user.avatarStorageId)
            : null;
          return {
            userId: m.userId,
            name: user.name,
            avatarPreset: user.avatarPreset ?? null,
            avatarUrl,
          };
        })
      )
    ).filter((m): m is NonNullable<typeof m> => m !== null);

    return { space, members, status: space.status };
  },
});

// Placeholder — finalized in M1 #11 / #13
export const stats = query({
  args: {},
  handler: async (_ctx) => {
    return { memoriesCount: 0, todosCount: 0, streak: 0 };
  },
});

// Placeholder — finalized in M1 #11
export const favorites = query({
  args: {},
  handler: async (_ctx) => {
    return [];
  },
});
