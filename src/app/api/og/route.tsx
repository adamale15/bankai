import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { ELEMENT_ACCENT } from "@/lib/forging/blade-map";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return new Response("Missing slug", { status: 400 });

  // Edge runtime cannot use the regular admin client (uses Node.js crypto)
  // Use the Supabase REST API directly
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const cardRes = await fetch(
    `${supabaseUrl}/rest/v1/share_cards?slug=eq.${encodeURIComponent(slug)}&select=zanpakuto_id`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  const cards = await cardRes.json() as { zanpakuto_id: string }[];
  if (!cards.length) return new Response("Not found", { status: 404 });

  const zanpakutoRes = await fetch(
    `${supabaseUrl}/rest/v1/zanpakuto?id=eq.${cards[0].zanpakuto_id}&select=sealed_name,true_name,element,blade_type,spirit_persona,state,inner_world_image_url`,
    { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
  );
  const zanpakutos = await zanpakutoRes.json() as {
    sealed_name: string;
    true_name: string | null;
    element: string;
    blade_type: string;
    spirit_persona: { archetype: string; quote: string };
    state: string;
    inner_world_image_url: string | null;
  }[];

  if (!zanpakutos.length) return new Response("Not found", { status: 404 });
  const z = zanpakutos[0];

  const accent: string = (ELEMENT_ACCENT as Record<string, string>)[z.element] ?? "#a020f0";
  const spiritName = z.true_name ?? z.sealed_name;
  const stateLabel = z.state === "shikai" ? "SHIKAI" : z.state === "bankai" ? "BANKAI" : "SEALED";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#131313",
          position: "relative",
          overflow: "hidden",
          fontFamily: "serif",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            filter: "blur(60px)",
          }}
        />

        {/* Left accent bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#a020f0" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", padding: "60px 70px", flex: 1 }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 13, color: "#9a8ca0", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              ZANPAKUTO FORGE
            </div>
            <div
              style={{
                fontSize: 11,
                color: accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: `1px solid ${accent}66`,
                background: `${accent}11`,
              }}
            >
              {stateLabel}
            </div>
          </div>

          {/* Spirit name */}
          <div style={{ fontSize: 72, fontWeight: 900, color: "#e5e2e1", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 12 }}>
            {spiritName.toUpperCase()}
          </div>

          {/* Sealed name */}
          <div style={{ fontSize: 18, color: "#a020f0", letterSpacing: "0.1em", marginBottom: 32 }}>
            {z.sealed_name}
          </div>

          {/* Divider */}
          <div style={{ width: 60, height: 2, background: "#a020f0", marginBottom: 32 }} />

          {/* Archetype + Element row */}
          <div style={{ display: "flex", gap: 32, marginBottom: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#9a8ca0", letterSpacing: "0.25em", textTransform: "uppercase" }}>Archetype</div>
              <div style={{ fontSize: 18, color: "#e5e2e1", fontWeight: 700 }}>{z.spirit_persona.archetype}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#9a8ca0", letterSpacing: "0.25em", textTransform: "uppercase" }}>Element</div>
              <div style={{ fontSize: 18, color: accent, fontWeight: 700, textTransform: "capitalize" }}>{z.element}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ fontSize: 10, color: "#9a8ca0", letterSpacing: "0.25em", textTransform: "uppercase" }}>Blade</div>
              <div style={{ fontSize: 18, color: "#e5e2e1", fontWeight: 700, textTransform: "capitalize" }}>{z.blade_type}</div>
            </div>
          </div>

          {/* Quote */}
          <div
            style={{
              marginTop: 32,
              padding: "16px 20px",
              borderLeft: `2px solid ${accent}55`,
              background: `${accent}08`,
              fontSize: 16,
              color: "#9a8ca0",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{z.spirit_persona.quote}&rdquo;
          </div>
        </div>

        {/* Bottom brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 70px",
            background: "#0e0e0e",
            fontSize: 11,
            color: "#4e4355",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span>zanpakutoforge.com</span>
          <span>Discover your spirit</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
