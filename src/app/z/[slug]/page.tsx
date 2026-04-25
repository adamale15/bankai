import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { ELEMENT_ACCENT, ELEMENT_DESC } from "@/lib/forging/blade-map";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

async function getZanpakutoBySlug(slug: string) {
  const admin = createAdminClient();
  const { data: card } = await admin
    .from("share_cards")
    .select("zanpakuto_id")
    .eq("slug", slug)
    .single();

  if (!card) return null;

  const { data: zanpakuto } = await admin
    .from("zanpakuto")
    .select("sealed_name, true_name, element, blade_type, guard_desc, hilt_color, spirit_persona, state, inner_world_desc, inner_world_image_url")
    .eq("id", card.zanpakuto_id)
    .single();

  return zanpakuto;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const z = await getZanpakutoBySlug(slug);
  if (!z) return { title: "Not Found" };

  const name = z.true_name ?? z.sealed_name;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://zanpakutoforge.com";

  return {
    title: `${name} — Zanpakuto Forge`,
    description: `${z.spirit_persona.archetype} · ${z.element} element. "${z.spirit_persona.quote}"`,
    openGraph: {
      title: name,
      description: z.spirit_persona.quote,
      images: [{ url: `${baseUrl}/api/og?slug=${slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: z.spirit_persona.quote,
      images: [`${baseUrl}/api/og?slug=${slug}`],
    },
  };
}

export default async function PublicZanpakutoPage({ params }: Props) {
  const { slug } = await params;
  const z = await getZanpakutoBySlug(slug);
  if (!z) notFound();

  const accent = (ELEMENT_ACCENT as Record<string, string>)[z.element] ?? "#a020f0";
  const elementDesc = (ELEMENT_DESC as Record<string, string>)[z.element] ?? "";
  const spiritName = z.true_name ?? z.sealed_name;
  const stateLabel = z.state === "shikai" ? "SHIKAI" : z.state === "bankai" ? "BANKAI" : "SEALED";

  const persona = z.spirit_persona as {
    archetype: string; tone: string; core_trait: string; quote: string; speech_style: string;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#131313", color: "#e5e2e1" }}>
      {/* Top bar */}
      <header
        className="flex justify-between items-center px-8 py-5 z-10"
        style={{ background: "#050505" }}
      >
        <div
          className="font-black text-xl tracking-tight"
          style={{ fontFamily: "var(--font-headline)", color: "#a020f0" }}
        >
          ZANPAKUTO FORGE
        </div>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-body)", color: "#9a8ca0", textDecoration: "none" }}
        >
          Discover your spirit →
        </Link>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col md:flex-row min-h-[60vh]">
        {/* Inner world image */}
        <div
          className="md:w-1/2 h-64 md:h-auto relative overflow-hidden"
          style={{ background: "#0e0e0e" }}
        >
          {z.inner_world_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={z.inner_world_image_url}
              alt="Inner world"
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(30%) contrast(110%)" }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-[200px] font-black"
              style={{ fontFamily: "var(--font-headline)", color: `${accent}10` }}
            >
              霊
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, transparent 60%, #131313 100%)" }}
          />
        </div>

        {/* Info panel */}
        <div className="md:w-1/2 flex flex-col justify-center px-10 py-14 md:py-20">
          {/* State badge */}
          <div
            className="text-xs uppercase tracking-widest mb-4 inline-block px-3 py-1 self-start"
            style={{
              fontFamily: "var(--font-body)",
              color: accent,
              border: `1px solid ${accent}55`,
              background: `${accent}0f`,
            }}
          >
            {stateLabel}
          </div>

          <h1
            className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-3"
            style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
          >
            {spiritName.toUpperCase()}
          </h1>

          <p
            className="text-base mb-8"
            style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
          >
            {z.sealed_name}
          </p>

          {/* Quote */}
          <blockquote
            className="text-lg italic leading-relaxed mb-8 pl-4"
            style={{
              fontFamily: "var(--font-headline)",
              color: "#9a8ca0",
              borderLeft: `2px solid ${accent}55`,
            }}
          >
            &ldquo;{persona.quote}&rdquo;
          </blockquote>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Archetype",  value: persona.archetype  },
              { label: "Element",    value: z.element.charAt(0).toUpperCase() + z.element.slice(1) },
              { label: "Blade",      value: z.blade_type.charAt(0).toUpperCase() + z.blade_type.slice(1) },
              { label: "Core Trait", value: persona.core_trait  },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
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
          </div>
        </div>
      </section>

      {/* Inner World section */}
      <section className="px-8 md:px-20 py-16 max-w-4xl">
        <h2
          className="text-xs uppercase tracking-widest mb-4 flex items-center gap-3"
          style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
        >
          <span className="w-8 h-px inline-block" style={{ background: "#4e4355" }} />
          Inner World
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
        >
          {z.inner_world_desc}
        </p>
      </section>

      {/* Element section */}
      <section
        className="mx-8 md:mx-20 mb-16 p-8"
        style={{ background: "#1c1b1b", borderBottom: `2px solid ${accent}` }}
      >
        <div
          className="text-xs uppercase tracking-widest mb-2"
          style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
        >
          Element · {z.element.charAt(0).toUpperCase() + z.element.slice(1)}
        </div>
        <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}>
          {elementDesc}
        </p>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center py-16 px-8 text-center gap-4">
        <p
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
        >
          ——&nbsp; Your spirit is waiting &nbsp;——
        </p>
        <h2
          className="text-3xl font-black"
          style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
        >
          Discover your Zanpakuto
        </h2>
        <Link
          href="/"
          className="mt-2 px-8 py-4 text-sm uppercase tracking-widest font-bold transition-all hover:brightness-110"
          style={{
            fontFamily: "var(--font-body)",
            background: "#a020f0",
            color: "#f9e8ff",
            textDecoration: "none",
            boxShadow: "0 0 24px rgba(160,32,240,0.3)",
          }}
        >
          Begin the Trial
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="mt-auto px-8 py-6 flex justify-between items-center text-xs uppercase tracking-widest"
        style={{ fontFamily: "var(--font-body)", color: "#4e4355", borderTop: "1px solid rgba(78,67,85,0.15)" }}
      >
        <span>Zanpakuto Forge</span>
        <span>Soul Society</span>
      </footer>
    </div>
  );
}
