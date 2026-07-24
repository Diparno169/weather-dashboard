"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <GlassCard glow="garnet" className="flex flex-col items-center gap-4 p-10">
        <AlertTriangle className="h-12 w-12 text-rose-500 dark:text-rose-400" />
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {error.message || "An unexpected error occurred."}
          </p>
        </div>
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
      </GlassCard>
    </main>
  );
}
