"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, Moon, Sun } from "lucide-react";
import { GithubMark } from "@/components/ui/GithubMark";
import { useTheme } from "next-themes";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { MenuToggle } from "./MenuToggle";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-3xl border border-black/[0.06] bg-white/70 px-4 py-3 shadow-[0_8px_32px_-16px_rgba(15,23,42,0.15)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none sm:mx-4 lg:mx-auto"
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_20px_-2px_rgba(34,211,238,0.7)]">
            <CloudSun className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            Skyline<span className="text-cyan-400">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                  : "text-slate-600 hover:bg-black/5 hover:text-cyan-600 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-cyan-300"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/5 text-slate-600 transition-colors hover:bg-black/10 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-300 lg:flex"
            aria-label="View source on GitHub"
          >
            <GithubMark className="h-4 w-4" />
          </a>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className="hidden h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/5 text-slate-600 transition-colors hover:bg-black/10 hover:text-cyan-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-300 lg:flex"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="lg:hidden">
            <MenuToggle open={open} onClick={() => setOpen((o) => !o)} />
          </div>
        </div>
      </motion.div>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
