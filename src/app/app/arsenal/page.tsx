import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ArsenalView } from "@/components/arsenal/ArsenalView";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

export const dynamic = "force-dynamic";

export default async function ArsenalPage() {
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

  return <ArsenalView zanpakuto={zanpakuto as ZanpakutoData} />;
}
