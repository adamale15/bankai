import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <p className="text-xs tracking-[0.3em] uppercase text-indigo-400/70">Inner World</p>
        <h1 className="text-3xl font-bold text-white">Your soul is being read.</h1>
        <p className="text-zinc-500 text-sm">The soul reading quiz is coming in the next milestone.</p>
        <form action="/api/auth/signout" method="POST">
          <button className="text-xs text-zinc-600 hover:text-zinc-400 underline">Sign out</button>
        </form>
      </div>
    </main>
  );
}
