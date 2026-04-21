import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeVector } from "@/lib/forging/vector";
import { mapBlade, isCanonical } from "@/lib/forging/blade-map";
import canonicalList from "../../../../data/canonical-zanpakuto.json";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

type GeneratedIdentity = {
  sealed_name: string;
  true_name: string;
  inner_world_desc: string;
  spirit_persona: {
    tone: string;
    archetype: string;
    speech_style: string;
    core_trait: string;
    quote: string;
  };
};

async function callGemini(prompt: string): Promise<GeneratedIdentity | null> {
  try {
    const result = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const raw = result.text ?? "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as GeneratedIdentity;
  } catch {
    return null;
  }
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Idempotency: return existing zanpakuto if already forged
  const { data: existing } = await admin
    .from("zanpakuto")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existing) return NextResponse.json({ zanpakuto: existing });

  // Fetch soul reading vector
  const { data: reading } = await admin
    .from("soul_readings")
    .select("vector, answers")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!reading) {
    return NextResponse.json({ error: "Soul reading not found" }, { status: 404 });
  }

  const vector = reading.vector
    ? reading.vector as ReturnType<typeof computeVector>
    : computeVector(reading.answers as { questionId: string; optionId: string }[]);

  const bladeMeta = mapBlade(vector);

  const prompt = `You are the Zanpakuto spirit-naming oracle in the Bleach universe.

Soul Reaper personality vector (normalized 0–1):
- conviction: ${vector.conviction.toFixed(2)}
- mercy: ${vector.mercy.toFixed(2)}
- ambition: ${vector.ambition.toFixed(2)}
- introspection: ${vector.introspection.toFixed(2)}
- aggression: ${vector.aggression.toFixed(2)}
- loyalty: ${vector.loyalty.toFixed(2)}
- curiosity: ${vector.curiosity.toFixed(2)}
- dominant element: ${vector.element}
- blade type: ${bladeMeta.displayName}

Generate a unique Zanpakuto identity following these rules:
1. sealed_name: a short poetic title for the unreleased blade (2–4 English words, evocative, mysterious — not the spirit's true name)
2. true_name: the spirit's actual name (2–3 words, Japanese-influenced or nature-based fusion — this is revealed only at Shikai)
3. inner_world_desc: 2 poetic sentences describing the spirit's inner world — the landscape the Soul Reaper enters during meditation
4. spirit_persona: the spirit's personality expressed through 5 fields

Do NOT use any of these canonical names for true_name: ${(canonicalList as string[]).slice(0, 30).join(", ")}, and others.

Respond with ONLY valid JSON — no markdown, no explanation:
{
  "sealed_name": "...",
  "true_name": "...",
  "inner_world_desc": "...",
  "spirit_persona": {
    "tone": "2–3 word tone description",
    "archetype": "The [Archetype Name]",
    "speech_style": "brief description of how the spirit speaks",
    "core_trait": "single defining trait",
    "quote": "one short, striking line the spirit might say"
  }
}`;

  let generated: GeneratedIdentity | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await callGemini(prompt);
    if (!result) continue;
    if (!isCanonical(result.true_name, canonicalList as string[])) {
      generated = result;
      break;
    }
  }

  if (!generated) {
    return NextResponse.json({ error: "Spirit refused to manifest" }, { status: 500 });
  }

  const row = {
    user_id: user.id,
    sealed_name: generated.sealed_name,
    true_name: generated.true_name,
    blade_type: bladeMeta.bladeType,
    guard_desc: bladeMeta.guardDesc,
    hilt_color: bladeMeta.hiltColor,
    element: vector.element,
    inner_world_desc: generated.inner_world_desc,
    spirit_persona: generated.spirit_persona,
    state: "sealed",
  };

  const { data: inserted, error } = await admin
    .from("zanpakuto")
    .insert(row)
    .select()
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Inscription failed" }, { status: 500 });
  }

  return NextResponse.json({ zanpakuto: inserted });
}
