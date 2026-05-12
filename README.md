# Scrapbook

A couples memory app built with Next.js 15, Convex, and `@convex-dev/auth`.

## Getting started

```bash
npm install
npx convex dev    # starts the Convex dev server + pushes schema
npm run dev       # starts the Next.js dev server
```

## Dev seeding

Populate your space with reference data (4 memories, 6 todos, 5 answered daily questions, reactions, and comments) to match the original design prototype:

1. Set the env var in your Convex dashboard (or `.env.local` for the Convex dev server):
   ```
   CONVEX_ALLOW_SEED=1
   ```

2. Run the seed:
   ```bash
   npx convex run dev:seed
   ```

3. To wipe all space-scoped data and start fresh:
   ```bash
   npx convex run dev:clear
   ```

Both functions are no-ops unless `CONVEX_ALLOW_SEED=1` is set, so they are safe to deploy to production.
