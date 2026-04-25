"use client";

import { useState } from "react";

export function ShareButton({ accent = "#a020f0" }: { accent?: string }) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle");

  async function handleShare() {
    setState("loading");
    try {
      const res = await fetch("/api/share", { method: "POST" });
      if (!res.ok) throw new Error();
      const { slug } = await res.json() as { slug: string };
      const url = `${window.location.origin}/z/${slug}`;
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  const label =
    state === "loading" ? "Generating…" :
    state === "copied"  ? "Link copied!" :
    state === "error"   ? "Failed" :
    "Share card";

  return (
    <button
      onClick={handleShare}
      disabled={state === "loading"}
      className="flex items-center gap-2 text-xs uppercase tracking-widest transition-colors hover:brightness-110 disabled:opacity-40"
      style={{
        fontFamily: "var(--font-body)",
        color: state === "copied" ? accent : "#9a8ca0",
        padding: "8px 0",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
      </svg>
      {label}
    </button>
  );
}
