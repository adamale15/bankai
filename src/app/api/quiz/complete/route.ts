import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeVector } from "@/lib/forging/vector";
import { QUESTIONS } from "@/lib/quiz/questions";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { answers } = body as { answers: { questionId: string; optionId: string }[] };

  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("soul_readings")
    .select("id, retries_used")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (existing && existing.retries_used >= 1) {
    return NextResponse.json({ error: "Soul reading is sealed" }, { status: 403 });
  }

  const vector = computeVector(answers);

  if (existing) {
    await admin
      .from("soul_readings")
      .update({
        answers,
        vector,
        retries_used: 1,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  } else {
    await admin.from("soul_readings").insert({
      user_id: user.id,
      answers,
      vector,
    });
  }

  return NextResponse.json({ ok: true });
}
