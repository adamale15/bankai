"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">The Senkaimon is closed.</h1>
          <p className="text-zinc-400 mb-6">An unexpected disturbance in the reiatsu.</p>
          <button
            onClick={reset}
            className="px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-900 transition"
          >
            Return to the inner world
          </button>
        </div>
      </body>
    </html>
  );
}
