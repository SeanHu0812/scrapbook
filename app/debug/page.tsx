"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DebugPage() {
  const hello = useQuery(api._smoke.hello);
  return (
    <main style={{ padding: 32, fontFamily: "monospace" }}>
      <h1>Convex smoke test</h1>
      <p>{hello ?? "Loading…"}</p>
    </main>
  );
}
