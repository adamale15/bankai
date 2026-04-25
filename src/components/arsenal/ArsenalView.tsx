"use client";

import Link from "next/link";
import { SideNav } from "@/components/shared/SideNav";
import { ELEMENT_ACCENT, ELEMENT_DESC } from "@/lib/forging/blade-map";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

const BLADE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpyyVD8KNWjkQ14Pf6uUDFcsgPTUg4N__igHLUte1RzJ8_uMTamVQhEWBdkTqpldppCJlS7_Lg1Hb4p6ZrMvoyNRi_pW0uWBKXkI-IZ5teOGKYni3KXgX0hUqBS1aieW6mghABnTQWDtIgRMxNWWhowTqLYSHUhSLcWCwdjMgLnHC_q2malugkEBKXtkNaLJPmcwXr13rUMXqZn9DDGEAVUbSedW_2u11A0zvsywgjnSWdBXo68M1m98nCAXOO6A66xSNzzUzi6DsPw";

export function ArsenalView({ zanpakuto }: { zanpakuto: ZanpakutoData }) {
  const accent = ELEMENT_ACCENT[zanpakuto.element] ?? "#a020f0";
  const elementDesc = ELEMENT_DESC[zanpakuto.element] ?? "";
  const isShikai = zanpakuto.state === "shikai" || zanpakuto.state === "bankai";
  const isBankai = zanpakuto.state === "bankai";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#131313", color: "#e5e2e1" }}>
      <SideNav active="Arsenal" />

      <main className="flex-1 md:ml-24 overflow-y-auto pt-20 md:pt-16 px-6 md:px-16 pb-24 md:pb-16 relative"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4e4355 transparent" }}
      >
        {/* Ambient gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-[600px] pointer-events-none -z-10"
          style={{ background: `linear-gradient(to bottom-left, ${accent}08, transparent)`, filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-0 w-1/3 h-[400px] pointer-events-none -z-10"
          style={{ background: "rgba(0,251,251,0.04)", filter: "blur(80px)" }} />

        {/* Header */}
        <div className="mb-12 max-w-4xl">
          <h1
            className="text-5xl md:text-7xl font-black tracking-[-0.03em] mb-3"
            style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
          >
            THE ARSENAL
          </h1>
          <p
            className="text-base max-w-xl"
            style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
          >
            Your spiritual weaponry. Unlock deeper stages through genuine resonance with your spirit.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 w-full max-w-7xl mx-auto">

          {/* ── Card 1: Sealed Form (always unlocked) ── */}
          <div
            className="group relative flex flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1"
            style={{ background: "#1c1b1b", height: 580, borderBottom: `2px solid #a020f0` }}
          >
            {/* Image area */}
            <div className="relative w-full h-[360px] overflow-hidden" style={{ background: "#0e0e0e" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zanpakuto.inner_world_image_url ?? BLADE_IMAGE}
                alt="Sealed form"
                className="w-full h-full object-cover transition-all duration-700 grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100"
                style={{ mixBlendMode: "luminosity", opacity: 0.85 }}
              />
              {/* Japanese character overlay */}
              <div
                className="absolute top-4 left-4 text-5xl font-black select-none pointer-events-none"
                style={{
                  fontFamily: "var(--font-headline)",
                  color: "rgba(255,255,255,0.08)",
                  writingMode: "vertical-rl",
                  letterSpacing: "-0.05em",
                }}
              >
                封
              </div>
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, #1c1b1b 0%, transparent 50%)" }}
              />
            </div>

            {/* Content */}
            <div className="p-7 flex flex-col flex-1 justify-between" style={{ background: "#0e0e0e" }}>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h2
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                  >
                    Sealed Form
                  </h2>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a020f0" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="0" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  {zanpakuto.sealed_name}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
                >
                  {elementDesc}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}>
                  Blade: {zanpakuto.blade_type}
                </div>
                <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}>
                  Guard: {zanpakuto.guard_desc.split(" ").slice(0, 4).join(" ")}…
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 2: Shikai ── */}
          <div
            className="group relative flex flex-col overflow-hidden"
            style={{
              background: "#1c1b1b",
              height: 580,
              border: "1px solid rgba(78,67,85,0.15)",
            }}
          >
            {/* Locked overlay */}
            {!isShikai && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center"
                style={{ background: "rgba(14,14,14,0.85)", backdropFilter: "blur(6px)" }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4e4355" strokeWidth="1.5" className="mb-4">
                  <rect x="3" y="11" width="18" height="11" rx="0" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3
                  className="text-xl font-bold tracking-tight mb-2"
                  style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                >
                  Shikai
                </h3>
                <p
                  className="text-xs uppercase tracking-widest px-4 py-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#a020f0",
                    background: "rgba(160,32,240,0.08)",
                  }}
                >
                  Awaiting Resonance
                </p>
                <Link
                  href="/app/sanctum/commune"
                  className="mt-5 text-xs uppercase tracking-widest transition-colors hover:text-[#a020f0]"
                  style={{ fontFamily: "var(--font-body)", color: "#4e4355", textDecoration: "none" }}
                >
                  Commune with your spirit →
                </Link>
              </div>
            )}

            {/* Image area */}
            <div
              className="relative w-full h-[360px] overflow-hidden"
              style={{ background: "#0e0e0e", filter: isShikai ? "none" : "blur(4px)" }}
            >
              <div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at center, ${accent}22 0%, #0e0e0e 70%)` }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center text-8xl font-black"
                style={{ fontFamily: "var(--font-headline)", color: `${accent}15` }}
              >
                初
              </div>
            </div>

            {/* Content */}
            <div
              className="p-7 flex flex-col flex-1 justify-between"
              style={{
                background: "#0e0e0e",
                opacity: isShikai ? 1 : 0.3,
              }}
            >
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight mb-1"
                  style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                >
                  Shikai
                </h2>
                {isShikai && zanpakuto.true_name ? (
                  <>
                    <p
                      className="text-xs uppercase tracking-widest mb-3"
                      style={{ fontFamily: "var(--font-body)", color: accent }}
                    >
                      {zanpakuto.true_name}
                    </p>
                    {zanpakuto.release_command && (
                      <p
                        className="text-sm italic"
                        style={{ fontFamily: "var(--font-headline)", color: "#9a8ca0" }}
                      >
                        &ldquo;{zanpakuto.release_command}&rdquo;
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <div className="h-2 w-24 mb-2" style={{ background: "#2a2a2a" }} />
                    <div className="h-2 w-16" style={{ background: "#2a2a2a" }} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Card 3: Bankai ── */}
          <div
            className="group relative flex flex-col overflow-hidden"
            style={{
              background: "#0e0e0e",
              height: 580,
              border: "1px solid rgba(78,67,85,0.1)",
            }}
          >
            {/* Heavy locked overlay */}
            {!isBankai && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center"
                style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(8px)" }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#353534" strokeWidth="1" className="mb-5">
                  <rect x="3" y="11" width="18" height="11" rx="0" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  <circle cx="12" cy="16" r="1" fill="#353534" />
                </svg>
                <h3
                  className="text-2xl font-black tracking-tighter mb-3"
                  style={{ fontFamily: "var(--font-headline)", color: "rgba(229,226,225,0.5)" }}
                >
                  Bankai
                </h3>
                <p
                  className="text-xs uppercase tracking-[0.3em] px-5 py-3"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#9a8ca0",
                    border: "1px solid rgba(78,67,85,0.2)",
                  }}
                >
                  Spiritual Pressure Insufficient
                </p>
              </div>
            )}

            {/* Void image area */}
            <div className="relative w-full h-[360px]" style={{ background: "#050505" }}>
              <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse at center, rgba(160,32,240,0.04) 0%, #050505 70%)" }}
              />
            </div>

            {/* Obscured content */}
            <div className="p-7 flex flex-col flex-1 justify-between" style={{ opacity: 0.1 }}>
              <div>
                <div className="h-7 w-40 mb-3" style={{ background: "#2a2a2a" }} />
                <div className="h-2 w-full mb-2" style={{ background: "#2a2a2a" }} />
                <div className="h-2 w-3/4" style={{ background: "#2a2a2a" }} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
