import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function generateSlug(sealedName: string): string {
  const base = sealedName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${base}-${rand}`;
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: zanpakuto } = await admin
    .from("zanpakuto")
    .select("id, sealed_name")
    .eq("user_id", user.id)
    .single();

  if (!zanpakuto) return NextResponse.json({ error: "No zanpakuto found" }, { status: 404 });

  // Return existing share card if one exists
  const { data: existing } = await admin
    .from("share_cards")
    .select("slug")
    .eq("zanpakuto_id", zanpakuto.id)
    .limit(1)
    .single();

  if (existing) return NextResponse.json({ slug: existing.slug });

  const slug = generateSlug(zanpakuto.sealed_name);

  const { error } = await admin.from("share_cards").insert({
    zanpakuto_id: zanpakuto.id,
    state: "generated",
    image_url: `/api/og?slug=${slug}`,
    slug,
  });

  if (error) return NextResponse.json({ error: "Failed to create share card" }, { status: 500 });

  return NextResponse.json({ slug });
}
