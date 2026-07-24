import Link from "next/link";
import { CloudOff } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <GlassCard glow="none" className="flex flex-col items-center gap-4 p-10">
        <CloudOff className="h-12 w-12 text-slate-400 dark:text-slate-600" />
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Lost in the clouds
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            We couldn&apos;t find the page you were looking for.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_-4px_rgba(59,130,246,0.6)] transition-colors hover:bg-blue-400"
        >
          Back home
        </Link>
      </GlassCard>
    </main>
  );
}
