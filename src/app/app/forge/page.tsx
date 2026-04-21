import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ForgeClient } from "@/components/forge/ForgeClient";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

export default async function ForgePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const admin = createAdminClient();

  // Require completed soul reading before forging
  const { data: reading } = await admin
    .from("soul_readings")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!reading) redirect("/app/quiz");

  // Pass existing zanpakuto if already forged (ForgeClient skips API call)
  const { data: existing } = await admin
    .from("zanpakuto")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  return <ForgeClient initial={(existing as ZanpakutoData) ?? null} />;
}
