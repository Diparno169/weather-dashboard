import type { Metadata } from "next";
import { OfflineState } from "@/components/ui/States";

export const metadata: Metadata = {
  title: "You're offline — Skyline",
};

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center">
      <OfflineState />
    </main>
  );
}
