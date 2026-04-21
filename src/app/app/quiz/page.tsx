import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuizClient } from "@/components/quiz/QuizClient";

export default async function QuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: record } = await supabase
    .from("soul_readings")
    .select("retries_used")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (record && record.retries_used >= 1) redirect("/app");

  return <QuizClient />;
}
