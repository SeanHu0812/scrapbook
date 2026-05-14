<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

---

# Scrapbook — Project Guide

A private shared memory app for couples. Cozy hand-drawn scrapbook aesthetic.
Two users share one "space" where they create memories, react, comment, manage todos, and answer daily questions together.

## Tech stack

| Layer | Web (current) | Mobile (target) |
|---|---|---|
| Framework | Next.js 15 App Router | Expo + Expo Router |
| Backend | Convex (shared — no changes needed) | Same Convex project |
| Auth | `@convex-dev/auth` | Same package |
| Styling | Tailwind CSS v4 (inline) | NativeWind v4 or StyleSheet |
| Fonts | Patrick Hand, Caveat, Gaegu (Google Fonts) | `expo-font` + same fonts |
| Icons | `lucide-react` | `lucide-react-native` |

## Repo structure

```
app/                     # Next.js pages
  (auth)/                # sign-in, sign-up
  (private)/             # all authenticated screens
    home/                # memory feed
    new/                 # create memory
    memory/[id]/         # memory detail + comments
    memory/[id]/edit/    # edit memory
    journal/             # daily question + answer
    calendar/            # memories by date
    todos/               # shared todo list
    profile/             # user profile + favorites
    settings/            # app settings
  onboarding/            # profile setup, invite partner
  invite/[code]/         # partner invite accept

components/
  ui/                    # all shared UI components
  decorations/           # SVG illustration components

convex/                  # backend — DO NOT change for RN rebuild
  schema.ts              # source of truth for all data shapes
  memories.ts / users.ts / spaces.ts / etc.
```

## Key rules when editing Convex code

- Always read `convex/_generated/ai/guidelines.md` first
- Use `requireMembership()` / `requireMemoryAccess()` helpers in `memories.ts` — don't repeat auth boilerplate
- `caption` on memories is auto-derived from `body` — never set it manually
- `scene` on memories is `"photo"` when photos exist, otherwise a random preset string
- Avatar: `avatarPreset` XOR `avatarStorageId` — only one should be set

## React Native transition notes

See `DESIGN.md` for the full design system to replicate.
See `SCREENS.md` for a screen-by-screen porting guide.
See `BACKEND.md` for all Convex queries/mutations with their signatures.

**Convex works identically in RN** — same `useQuery`, `useMutation`, same `api.*` calls.
The only setup difference is using `ConvexProvider` in `_layout.tsx` instead of the Next.js wrapper.
