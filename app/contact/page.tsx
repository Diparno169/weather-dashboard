"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Skyline feedback from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:hello@skyline-weather.app?subject=${subject}&body=${body}`;
  };

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300">
          <Mail className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wide">Contact</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Get in touch
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Found a bug, or have an idea for Skyline? This opens your email client — nothing is
          sent from here directly.
        </p>
      </div>

      <GlassCard glow="cyan" className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-400/50"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-400/50"
              placeholder="ada@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full resize-none rounded-2xl border border-black/[0.08] bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-400/50"
              placeholder="What's on your mind?"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full sm:w-auto">
            <Send className="h-4 w-4" /> Send message
          </Button>
        </form>
      </GlassCard>
    </main>
  );
}
