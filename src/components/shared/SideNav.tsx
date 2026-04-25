"use client";

import Link from "next/link";

export type NavSection = "Soul" | "Forge" | "Arsenal" | "Sanctum";

const NAV: { label: NavSection; href: string; icon: React.ReactNode }[] = [
  {
    label: "Soul", href: "/app/quiz",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7c-2.5 2-2.5 8 0 10M12 7c2.5 2 2.5 8 0 10M7 12h10" />
      </svg>
    ),
  },
  {
    label: "Forge", href: "/app/forge",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
      </svg>
    ),
  },
  {
    label: "Arsenal", href: "/app/arsenal",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.5 2.5l7 7-14 14-7-7 14-14zM2 22l4-4M8 5l3 3M13 10l3 3" />
      </svg>
    ),
  },
  {
    label: "Sanctum", href: "/app/sanctum",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 22V10l9-7 9 7v12M9 22v-6h6v6" />
      </svg>
    ),
  },
];

export function SideNav({ active }: { active: NavSection }) {
  return (
    <>
      {/* ── Desktop sidebar ── */}
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

        <div className="flex-1 flex flex-col gap-6 justify-center items-center w-full">
          {NAV.map((item) => {
            const isActive = item.label === active;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1.5 w-16 py-3 transition-all duration-300"
                style={{
                  background: isActive ? "#a020f0" : "transparent",
                  color: isActive ? "#000" : "rgba(255,255,255,0.35)",
                  textDecoration: "none",
                  boxShadow: isActive ? "0 0 20px rgba(160,32,240,0.4)" : "none",
                }}
              >
                {item.icon}
                <span
                  className="uppercase text-[9px] tracking-widest"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div
          className="mt-auto uppercase text-[9px] tracking-widest transition-colors hover:text-[#a020f0] cursor-default"
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(255,255,255,0.3)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          RELEASE SHIKAI
        </div>
      </nav>

      {/* ── Mobile top bar ── */}
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
        <nav className="flex gap-4">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                color: item.label === active ? "#a020f0" : "rgba(255,255,255,0.4)",
                textDecoration: "none",
              }}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
