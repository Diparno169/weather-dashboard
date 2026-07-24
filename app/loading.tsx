import { SkeletonCard } from "@/components/ui/States";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-56 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
      <SkeletonCard />
    </main>
  );
}
