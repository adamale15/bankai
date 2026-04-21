"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import type { ZanpakutoData } from "@/lib/forging/blade-map";
import { ELEMENT_ACCENT, ELEMENT_DESC, computeReiatsu } from "@/lib/forging/blade-map";

const KATANA_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDlNRPbZw-KmDOy5PCi34UpoMNHw7TKy2DbE-aWWDf_wvfinhWcOgliRex55LFwg3Okg5ND8KqZPbLA7PSKlaIrnwBCV2FRpmQRzJKyUGU0vtFTjWsOGRuFTcuSzwD7VkMx8Dzip5o0HxIqC3DyXmDmyewSAZxSCEw1CMqmq6GnBQRk4kuo4ouZEAW6HhdhD3ciHh77zULYHkj6qPU5GHf624HPY7uSB1E1f6Aw00pT2U9Xo0Z8WA-QIkwdCJJb8I8un8Xjm25QxzZl";

const NAV_ITEMS = [
  { label: "Soul",    icon: <SoulIcon />,    href: "/app/quiz"    },
  { label: "Forge",   icon: <ForgeIcon />,   href: "/app/forge",  active: true },
  { label: "Arsenal", icon: <ArsenalIcon />, href: "/app"         },
  { label: "Sanctum", icon: <SanctumIcon />, href: "/app/sanctum" },
];

function SoulIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7c-2.5 2-2.5 8 0 10M12 7c2.5 2 2.5 8 0 10M7 12h10"/>
    </svg>
  );
}
function ForgeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>
    </svg>
  );
}
function ArsenalIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 2.5l7 7-14 14-7-7 14-14zM2 22l4-4M8 5l3 3M13 10l3 3"/>
    </svg>
  );
}
function SanctumIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 22V10l9-7 9 7v12M9 22v-6h6v6"/>
    </svg>
  );
}

function formatReiatsu(n: number) {
  return n.toLocaleString("en-US");
}

export function ForgeReveal({ zanpakuto }: { zanpakuto: ZanpakutoData }) {
  const router = useRouter();
  const element = zanpakuto.element;
  const accent = ELEMENT_ACCENT[element] ?? "#a020f0";
  const elementDesc = ELEMENT_DESC[element] ?? "";
  const reiatsu = computeReiatsu(zanpakuto.id, element);
  const reiatsuPct = Math.round(((reiatsu - 5000) / 5000) * 100);
  const elementLabel = element.charAt(0).toUpperCase() + element.slice(1);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#131313", color: "#e5e2e1" }}
    >
      {/* ── Left sidebar ── */}
      <nav
        className="hidden md:flex fixed left-0 top-0 h-full flex-col items-center py-10 z-40 w-24"
        style={{ background: "#050505" }}
      >
        <div
          className="mb-12 font-black text-lg text-white"
          style={{
            fontFamily: "var(--font-headline)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            letterSpacing: "0.15em",
          }}
        >
          SEIREITEI
        </div>

        <div className="flex-1 flex flex-col gap-8 justify-center items-center w-full">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-1.5 p-2 w-16 transition-all duration-300"
              style={{
                background: item.active ? "#a020f0" : "transparent",
                color: item.active ? "#000" : "rgba(255,255,255,0.35)",
              }}
            >
              {item.icon}
              <span
                className="uppercase text-[9px] tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <button
          className="mt-auto uppercase text-[9px] tracking-widest transition-colors hover:text-[#a020f0]"
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(255,255,255,0.5)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          RELEASE SHIKAI
        </button>
      </nav>

      {/* ── Mobile header ── */}
      <header
        className="md:hidden fixed top-0 w-full z-40 flex justify-between items-center px-6 py-4"
        style={{ background: "#050505" }}
      >
        <div
          className="font-black text-xl tracking-tight"
          style={{ fontFamily: "var(--font-headline)", color: "#a020f0" }}
        >
          ZANPAKUTO FORGE
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 md:ml-24 relative flex items-center justify-center pt-16 md:pt-0 overflow-hidden">

        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at center, rgba(160,32,240,0.12) 0%, #0e0e0e 60%)",
          }}
          aria-hidden
        />

        {/* Paper grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">

          {/* ── Col 1-2: Vertical title ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex lg:col-span-2 justify-end items-center h-[600px]"
          >
            <h1
              className="font-black text-5xl lg:text-6xl leading-none opacity-90"
              style={{
                fontFamily: "var(--font-headline)",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "-0.02em",
                color: "#e5e2e1",
              }}
            >
              YOUR SOUL{" "}
              <span style={{ color: "#a020f0" }}>HAS TAKEN FORM</span>
            </h1>
          </motion.div>

          {/* Mobile title */}
          <div className="md:hidden text-center col-span-1">
            <h1
              className="font-black text-3xl tracking-tight uppercase leading-tight"
              style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
            >
              YOUR SOUL{" "}
              <span style={{ color: "#a020f0" }}>HAS TAKEN FORM</span>
            </h1>
          </div>

          {/* ── Col 3-9: Katana ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-7 relative flex justify-center items-center group"
          >
            {/* Ambient purple glow */}
            <div
              className="absolute pointer-events-none z-0"
              style={{
                width: "120%",
                height: "150%",
                background: "rgba(160,32,240,0.18)",
                filter: "blur(80px)",
                transform: "rotate(45deg) scaleY(2)",
                opacity: 0.5,
              }}
              aria-hidden
            />

            <div className="relative z-10 w-full" style={{ height: "clamp(300px,60vh,700px)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zanpakuto.inner_world_image_url ?? KATANA_IMAGE}
                alt={`${zanpakuto.sealed_name} — sealed form`}
                className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  filter: "drop-shadow(0 0 30px rgba(160,32,240,0.5))",
                  transform: "rotate(-20deg)",
                }}
              />
            </div>
          </motion.div>

          {/* ── Col 10-12: Data blocks ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3 flex flex-col gap-6 justify-center z-20"
          >
            {/* Sealed name */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-1"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                ——&nbsp; Sealed Form &nbsp;——
              </p>
              <h2
                className="text-2xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
              >
                {zanpakuto.sealed_name}
              </h2>
            </div>

            {/* Reiatsu density */}
            <div
              className="p-5 relative overflow-hidden"
              style={{
                background: "#2a2a2a",
                borderBottom: "2px solid #a020f0",
              }}
            >
              <div
                className="absolute top-0 right-0 p-2 font-black text-4xl leading-none opacity-10"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                零
              </div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                Reiatsu Density
              </p>
              <p
                className="text-3xl font-bold tracking-tight mb-1"
                style={{ fontFamily: "var(--font-body)", color: "#e5e2e1" }}
              >
                {formatReiatsu(reiatsu)}{" "}
                <span className="text-sm font-normal" style={{ color: "#9a8ca0" }}>SP</span>
              </p>
              <div className="w-full h-px mt-3" style={{ background: "#353534" }}>
                <div
                  className="h-full relative"
                  style={{ width: `${reiatsuPct}%`, background: "#a020f0" }}
                >
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2"
                    style={{ background: "#fff", boxShadow: "0 0 8px #a020f0" }}
                  />
                </div>
              </div>
            </div>

            {/* Element affinity */}
            <div
              className="p-5 relative"
              style={{
                background: "#2a2a2a",
                borderBottom: `2px solid ${accent}`,
              }}
            >
              <div
                className="absolute top-0 right-0 p-2 font-black text-4xl leading-none opacity-10"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                壱
              </div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                Element Affinity
              </p>
              <p
                className="text-2xl font-bold uppercase tracking-widest mb-2"
                style={{ fontFamily: "var(--font-body)", color: accent }}
              >
                {elementLabel}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                {elementDesc}
              </p>
            </div>

            {/* Spirit quote */}
            <div
              className="p-4"
              style={{ borderLeft: "2px solid rgba(160,32,240,0.3)", background: "rgba(160,32,240,0.04)" }}
            >
              <p
                className="text-xs italic leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                &ldquo;{zanpakuto.spirit_persona.quote}&rdquo;
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => router.push("/app/sanctum")}
                className="w-full py-4 px-6 font-bold text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110"
                style={{
                  fontFamily: "var(--font-body)",
                  background: "#a020f0",
                  color: "#f9e8ff",
                  boxShadow: "0 0 20px rgba(160,32,240,0.3)",
                }}
              >
                INITIATE IMPRINT
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8 2 4.5 5.5 4.5 9.5c0 3.5 2 6.5 5 8 .5.3 1 .5 1.5.5h2c.5 0 1-.2 1.5-.5 3-1.5 5-4.5 5-8C19.5 5.5 16 2 12 2z"/>
                  <path d="M9 12c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3"/>
                </svg>
              </button>

              <button
                className="w-full py-3 px-6 text-xs uppercase tracking-[0.15em] transition-colors hover:bg-[#353534]"
                style={{
                  fontFamily: "var(--font-body)",
                  background: "transparent",
                  border: "1px solid rgba(78,67,85,0.3)",
                  color: "#e5e2e1",
                }}
              >
                View Manifestation Logs
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
