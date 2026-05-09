import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Apple from "@auth/core/providers/apple";
import Google from "@auth/core/providers/google";

// To swap providers (e.g. migrate to Clerk): replace the providers array
// and the createOrUpdateUser callback with Clerk's Convex integration.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Apple, Google],
  callbacks: {
    async createOrUpdateUser(ctx, { existingUserId, profile }) {
      if (existingUserId) return existingUserId;
      return ctx.db.insert("users", {
        name: profile.name ?? "",
        email: profile.email ?? "",
      });
    },
  },
});
