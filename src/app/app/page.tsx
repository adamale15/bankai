import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: reading } = await supabase
    .from("soul_readings")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!reading) redirect("/app/quiz");

  const { data: zanpakuto } = await supabase
    .from("zanpakuto")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!zanpakuto) redirect("/app/forge");

  redirect("/app/sanctum");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] paper-grain" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(160,32,240,0.06) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 text-center space-y-6 max-w-sm">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
        >
          ——&nbsp; Soul reading complete &nbsp;——
        </p>
        <h1
          className="text-4xl font-black text-white"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Your spirit stirs.
        </h1>
        <p
          className="text-base leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
        >
          The forging will begin in the next phase.
        </p>
        <form action="/api/auth/signout" method="POST">
          <button
            className="text-xs uppercase tracking-widest transition-colors"
            style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
