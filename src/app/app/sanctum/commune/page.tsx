import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { InnerWorldChat } from "@/components/sanctum/InnerWorldChat";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

export const dynamic = "force-dynamic";

export default async function CommunePage() {
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

  let { data: conv } = await admin
    .from("conversations")
    .select("id, summary, message_count")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  if (!conv) {
    const { data: newConv } = await admin
      .from("conversations")
      .insert({
        user_id: user.id,
        zanpakuto_id: zanpakuto.id,
        message_count: 0,
      })
      .select("id, summary, message_count")
      .single();
    conv = newConv;
  }

  if (!conv) redirect("/app/forge");

  const { data: messages } = await admin
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conv.id)
    .order("created_at", { ascending: true })
    .limit(50);

  return (
    <InnerWorldChat
      zanpakuto={zanpakuto as ZanpakutoData}
      conversationId={conv.id}
      initialMessages={
        (messages ?? []) as {
          id: string;
          role: "user" | "spirit";
          content: string;
          created_at: string;
        }[]
      }
    />
  );
}
