"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { GithubMark } from "@/components/ui/GithubMark";
import { NAV_LINKS } from "@/constants";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: Props) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm dark:bg-[#030712]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed left-4 right-4 top-20 z-50 origin-top rounded-3xl border border-black/[0.06] bg-white/90 p-3 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.06] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "block rounded-2xl px-4 py-3 text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300"
                        : "text-slate-700 hover:bg-black/5 hover:text-cyan-600 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-cyan-300"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * NAV_LINKS.length }}
                className="mt-1 flex items-center justify-between gap-2 border-t border-black/10 px-4 pt-3 dark:border-white/10"
              >
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
                <div className="flex gap-1 rounded-2xl border border-black/[0.06] bg-black/[0.03] p-1 dark:border-white/10 dark:bg-white/[0.04]">
                  {[
                    { key: "light", icon: Sun },
                    { key: "dark", icon: Moon },
                    { key: "system", icon: Laptop },
                  ].map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      aria-label={`${key} theme`}
                      aria-pressed={theme === key}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-colors",
                        theme === key
                          ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300"
                          : "text-slate-500 hover:bg-black/5 dark:text-slate-400 dark:hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.a
                href="https://github.com/Diparno169"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * (NAV_LINKS.length + 1) }}
                className="mt-1 flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-black/5 hover:text-cyan-600 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-300"
              >
                <GithubMark className="h-4 w-4" /> GitHub
              </motion.a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
