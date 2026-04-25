import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { SanctumDashboard } from "@/components/sanctum/SanctumDashboard";
import { computeVector } from "@/lib/forging/vector";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

export const dynamic = "force-dynamic";

export default async function SanctumPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();

  const { data: zanpakuto } = await admin
    .from("zanpakuto")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!zanpakuto) redirect("/app/forge");

  const { data: reading } = await admin
    .from("soul_readings")
    .select("vector, answers")
    .eq("user_id", user.id)
    .single();

  if (!reading) redirect("/app/quiz");

  const vector = reading.vector
    ? reading.vector as ReturnType<typeof computeVector>
    : computeVector(reading.answers as { questionId: string; optionId: string }[]);

  const { data: conv } = await admin
    .from("conversations")
    .select("message_count")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <SanctumDashboard
      zanpakuto={zanpakuto as ZanpakutoData}
      vector={vector}
      messageCount={conv?.message_count ?? 0}
      isShikai={zanpakuto.state === "shikai" || zanpakuto.state === "bankai"}
    />
  );
}
