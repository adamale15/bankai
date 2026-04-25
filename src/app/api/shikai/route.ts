import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { judgeConversation } from "@/lib/llm/judge";

// GET: check shikai eligibility
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  const { data: zanpakuto } = await admin
    .from("zanpakuto")
    .select("id, state, spirit_persona, element, message_count")
    .eq("user_id", user.id)
    .single();

  if (!zanpakuto) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (zanpakuto.state !== "sealed") {
    return NextResponse.json({ eligible: true, alreadyUnlocked: true });
  }

  const { data: conv } = await admin
    .from("conversations")
    .select("id, message_count")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  const count = conv?.message_count ?? 0;

  // Minimum 8 meaningful exchanges (16 messages) before judging
  if (count < 16) {
    return NextResponse.json({ eligible: false, messageCount: count, required: 16 });
  }

  const { data: messages } = await admin
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conv!.id)
    .order("created_at", { ascending: true })
    .limit(40);

  const persona = zanpakuto.spirit_persona as { archetype: string };
  const judgeResult = await judgeConversation(
    messages ?? [],
    persona.archetype,
    zanpakuto.element
  );

  if (!judgeResult) {
    return NextResponse.json({ eligible: false, error: "Judge unavailable" });
  }

  const eligible = judgeResult.overall >= 7;

  return NextResponse.json({ eligible, judgeResult, messageCount: count });
}

// POST: unlock shikai with release command
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { releaseCommand } = await req.json() as { releaseCommand: string };

  if (!releaseCommand?.trim()) {
    return NextResponse.json({ error: "Release command required" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: zanpakuto } = await admin
    .from("zanpakuto")
    .select("id, state, spirit_persona, element, true_name")
    .eq("user_id", user.id)
    .single();

  if (!zanpakuto) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (zanpakuto.state !== "sealed") {
    return NextResponse.json({ error: "Already unlocked" }, { status: 400 });
  }

  const { data: conv } = await admin
    .from("conversations")
    .select("id, message_count")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  const count = conv?.message_count ?? 0;
  if (count < 16) {
    return NextResponse.json({ error: "Insufficient resonance" }, { status: 403 });
  }

  const { data: messages } = await admin
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conv!.id)
    .order("created_at", { ascending: true })
    .limit(40);

  const persona = zanpakuto.spirit_persona as { archetype: string };
  const judgeResult = await judgeConversation(
    messages ?? [],
    persona.archetype,
    zanpakuto.element
  );

  if (!judgeResult || judgeResult.overall < 7) {
    return NextResponse.json({
      error: "The spirit does not yet recognize you",
      judgeResult,
    }, { status: 403 });
  }

  const { error } = await admin
    .from("zanpakuto")
    .update({
      state: "shikai",
      release_command: releaseCommand.trim(),
      shikai_unlocked_at: new Date().toISOString(),
    })
    .eq("id", zanpakuto.id);

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  return NextResponse.json({ ok: true, trueName: zanpakuto.true_name });
}
