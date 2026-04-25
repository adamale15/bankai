"use client";

import Link from "next/link";
import { SideNav } from "@/components/shared/SideNav";
import { ShareButton } from "@/components/shared/ShareButton";
import { ELEMENT_ACCENT } from "@/lib/forging/blade-map";
import { computeReiatsu } from "@/lib/forging/blade-map";
import type { ZanpakutoData } from "@/lib/forging/blade-map";
import type { PersonalityVector } from "@/lib/forging/vector";

const TRAIT_LABELS: { key: keyof Omit<PersonalityVector, "element" | "elementScores">; label: string }[] = [
  { key: "conviction",    label: "Conviction"    },
  { key: "mercy",        label: "Mercy"          },
  { key: "ambition",     label: "Ambition"       },
  { key: "introspection",label: "Introspection"  },
  { key: "aggression",   label: "Aggression"     },
  { key: "loyalty",      label: "Loyalty"        },
  { key: "curiosity",    label: "Curiosity"      },
];

// Radar chart: 7 traits as polygon points on a 120×120 canvas
function SoulRadar({ vector }: { vector: PersonalityVector }) {
  const cx = 120, cy = 120, r = 90;
  const n = TRAIT_LABELS.length;

  function point(i: number, radius: number): [number, number] {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  }

  const outerPoints = Array.from({ length: n }, (_, i) => point(i, r));
  const dataPoints  = TRAIT_LABELS.map(({ key }, i) => point(i, r * (vector[key] as number)));

  const dataPoly = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[260px]">
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={outerPoints.map((_, i) => point(i, r * scale).join(",")).join(" ")}
          fill="none"
          stroke="rgba(78,67,85,0.3)"
          strokeWidth="0.5"
        />
      ))}
      {/* Spokes */}
      {outerPoints.map(([x, y], i) => (
        <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(78,67,85,0.25)" strokeWidth="0.5" />
      ))}
      {/* Data polygon */}
      <polygon
        points={dataPoly}
        fill="rgba(160,32,240,0.15)"
        stroke="#a020f0"
        strokeWidth="1.5"
      />
      {/* Data dots */}
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#a020f0" />
      ))}
      {/* Labels */}
      {outerPoints.map(([x, y], i) => {
        const dx = x - cx, dy = y - cy;
        const len = Math.sqrt(dx * dx + dy * dy);
        const lx = cx + (dx / len) * (r + 14);
        const ly = cy + (dy / len) * (r + 14);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fill="#9a8ca0"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="0.08em"
          >
            {TRAIT_LABELS[i].label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}

function StatBar({ label, value, accent }: { label: string; value: number; accent: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}>
          {label}
        </span>
        <span className="text-[10px]" style={{ fontFamily: "var(--font-body)", color: accent }}>
          {pct}%
        </span>
      </div>
      <div className="h-px w-full" style={{ background: "#2a2a2a" }}>
        <div
          className="h-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: accent }}
        />
      </div>
    </div>
  );
}

export function SanctumDashboard({
  zanpakuto,
  vector,
  messageCount,
  isShikai,
}: {
  zanpakuto: ZanpakutoData;
  vector: PersonalityVector;
  messageCount: number;
  isShikai: boolean;
}) {
  const accent = ELEMENT_ACCENT[zanpakuto.element] ?? "#a020f0";
  const reiatsu = computeReiatsu(zanpakuto.id, zanpakuto.element);
  const spiritName = zanpakuto.true_name ?? zanpakuto.sealed_name;
  const stateLabel = zanpakuto.state === "shikai" ? "SHIKAI" : zanpakuto.state === "bankai" ? "BANKAI" : "SEALED";

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#131313", color: "#e5e2e1" }}>
      <SideNav active="Sanctum" />

      <main
        className="flex-1 md:ml-24 overflow-y-auto pt-20 md:pt-0"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#4e4355 transparent" }}
      >
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-1/2 h-1/2 blur-[120px]"
            style={{ background: "rgba(160,32,240,0.05)", borderRadius: "50%" }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-3/4 h-3/4 blur-[150px]"
            style={{ background: `${accent}0a`, borderRadius: "50%" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">

          {/* ── Profile Header ── */}
          <header className="flex flex-col md:flex-row justify-between items-end mb-12 pb-8 relative">
            <div className="absolute bottom-0 left-0 w-full h-px opacity-20" style={{ background: "#4e4355" }} />

            <div className="flex items-end gap-6 z-10 w-full md:w-auto">
              {/* Avatar placeholder */}
              <div
                className="w-28 h-28 md:w-36 md:h-36 shrink-0 relative overflow-hidden"
                style={{
                  background: "#1c1b1b",
                  borderBottom: `2px solid #a020f0`,
                }}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl font-black"
                  style={{ fontFamily: "var(--font-headline)", color: "rgba(160,32,240,0.15)" }}
                >
                  霊
                </div>
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, #131313 0%, transparent 60%)" }}
                />
              </div>

              <div className="flex-grow">
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  Soul Reaper · {zanpakuto.blade_type}
                </p>
                <h1
                  className="text-4xl md:text-6xl font-black leading-none mb-2 tracking-tight"
                  style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                >
                  {spiritName.toUpperCase()}
                </h1>
                <p
                  className="text-base italic tracking-wide"
                  style={{ fontFamily: "var(--font-headline)", color: "#a020f0" }}
                >
                  {zanpakuto.sealed_name} wielder
                </p>
              </div>
            </div>

            {/* Reiatsu counter + share */}
            <div
              className="mt-6 md:mt-0 flex flex-col items-end z-10 p-6 min-w-[200px] relative gap-3"
              style={{ background: "#0e0e0e" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 20px rgba(160,32,240,0.05)" }} />
              <div className="relative z-10 flex flex-col items-end gap-3">
                <div>
                  <span
                    className="text-[10px] uppercase tracking-widest block mb-1"
                    style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                  >
                    Reiatsu Density
                  </span>
                  <div
                    className="text-3xl font-bold tracking-tighter"
                    style={{ fontFamily: "var(--font-body)", color: accent }}
                  >
                    {reiatsu.toLocaleString()} SP
                  </div>
                </div>
                <ShareButton accent={accent} />
              </div>
            </div>
          </header>

          {/* ── Bento Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Soul Map */}
            <section
              className="lg:col-span-8 p-8 relative flex flex-col"
              style={{ background: "#1c1b1b", minHeight: 480 }}
            >
              <h2
                className="text-xl font-bold tracking-tighter mb-6 flex items-center gap-3"
                style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
              >
                <span className="w-8 h-[2px] inline-block" style={{ background: "#a020f0" }} />
                SOUL MAP
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-10 flex-1">
                {/* Radar */}
                <div className="flex items-center justify-center flex-shrink-0">
                  <SoulRadar vector={vector} />
                </div>

                {/* Bars */}
                <div className="flex-1 flex flex-col gap-4 w-full">
                  {TRAIT_LABELS.map(({ key, label }) => (
                    <StatBar
                      key={key}
                      label={label}
                      value={vector[key] as number}
                      accent="#a020f0"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Spirit Whispers / Spirit Info */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <div
                className="p-6 flex-1 relative overflow-hidden flex flex-col"
                style={{ background: "#2a2a2a" }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2
                    className="text-base font-bold tracking-tight uppercase"
                    style={{ fontFamily: "var(--font-headline)", color: "#fff" }}
                  >
                    Spirit Identity
                  </h2>
                  <div
                    className="w-2 h-2 animate-pulse"
                    style={{ background: accent, borderRadius: "50%", boxShadow: `0 0 8px ${accent}` }}
                  />
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  {[
                    { label: "Archetype",   value: zanpakuto.spirit_persona.archetype  },
                    { label: "Element",     value: zanpakuto.element.charAt(0).toUpperCase() + zanpakuto.element.slice(1) },
                    { label: "Tone",        value: zanpakuto.spirit_persona.tone       },
                    { label: "Core Trait",  value: zanpakuto.spirit_persona.core_trait },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-body)", color: "#e5e2e1" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  {/* Spirit quote */}
                  <div
                    className="mt-2 p-4"
                    style={{ borderLeft: `2px solid ${accent}55`, background: `${accent}08` }}
                  >
                    <p
                      className="text-xs italic leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                    >
                      &ldquo;{zanpakuto.spirit_persona.quote}&rdquo;
                    </p>
                  </div>
                </div>

                <Link
                  href="/app/sanctum/commune"
                  className="mt-4 w-full py-3 text-xs uppercase tracking-widest text-center transition-colors hover:border-[#a020f0] hover:text-[#a020f0]"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "#9a8ca0",
                    border: "1px solid rgba(78,67,85,0.3)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  Enter Communion
                </Link>
              </div>
            </section>

            {/* Bottom stats row */}
            <section className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Zanpakuto state */}
              <div
                className="p-6 group transition-colors"
                style={{
                  background: "#0e0e0e",
                  borderBottom: `1px solid rgba(78,67,85,0.2)`,
                }}
              >
                <div
                  className="text-[10px] tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  Zanpakuto State
                </div>
                <div
                  className="text-3xl font-bold mb-3"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: stateLabel === "SEALED" ? "#e5e2e1" : stateLabel === "SHIKAI" ? accent : "#ffb4ab",
                  }}
                >
                  {stateLabel}
                </div>
                <div className="w-full h-px" style={{ background: "#2a2a2a" }}>
                  <div
                    className="h-full"
                    style={{
                      width: stateLabel === "SEALED" ? "33%" : stateLabel === "SHIKAI" ? "66%" : "100%",
                      background: stateLabel === "SEALED" ? "#4e4355" : accent,
                      boxShadow: stateLabel !== "SEALED" ? `0 0 10px ${accent}88` : "none",
                    }}
                  />
                </div>
              </div>

              {/* Communion sessions */}
              <div
                className="p-6"
                style={{ background: "#0e0e0e", borderBottom: "1px solid rgba(78,67,85,0.2)" }}
              >
                <div
                  className="text-[10px] tracking-[0.3em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  Communion Exchanges
                </div>
                <div
                  className="text-3xl font-bold mb-3"
                  style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                >
                  {messageCount}{" "}
                  <span className="text-sm font-normal" style={{ color: "#9a8ca0", fontFamily: "var(--font-body)" }}>
                    exchanges
                  </span>
                </div>
                <div className="w-full h-px" style={{ background: "#2a2a2a" }}>
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.min(messageCount / 50 * 100, 100)}%`,
                      background: "#a020f0",
                      boxShadow: "0 0 10px rgba(160,32,240,0.5)",
                    }}
                  />
                </div>
              </div>

              {/* Shikai progress */}
              <div
                className="p-6 flex flex-col justify-between"
                style={{ background: "#0e0e0e", borderBottom: "1px solid rgba(78,67,85,0.2)" }}
              >
                <div
                  className="text-[10px] tracking-[0.3em] uppercase mb-3 flex justify-between"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  <span>Resonance</span>
                  {!isShikai && <span style={{ color: "#ffb4ab" }}>Locked</span>}
                </div>
                <div
                  className="text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: isShikai ? accent : "#4e4355",
                  }}
                >
                  {isShikai ? "ACHIEVED" : `${Math.min(messageCount, 16)} / 16`}
                </div>
                <p
                  className="text-xs mt-1 leading-tight"
                  style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
                >
                  {isShikai
                    ? "True name known. Spirit fully awakened."
                    : "Converse genuinely to unlock Shikai."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
