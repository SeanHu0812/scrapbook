import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

// Idempotent — safe to call on every authenticated mount.
// createOrUpdateUser in auth.ts normally handles creation; this is a
// safety valve for sessions that predate the callback.
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const existing = await ctx.db.get(userId);
    if (existing) return;
    await ctx.db.patch(userId, { name: "", email: "" });
  },
});
