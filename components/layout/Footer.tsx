import Link from "next/link";
import { CloudSun } from "lucide-react";
import { GithubMark } from "@/components/ui/GithubMark";
import { NAV_LINKS } from "@/constants";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/10 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-start">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="text-sm text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            Contact
          </Link>
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400">
              <CloudSun className="h-4 w-4 text-white" />
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Skyline — premium weather, built with Next.js
            </span>
          </div>
          <a
            href="https://github.com/Diparno169"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-cyan-600 dark:hover:text-cyan-300"
          >
            <GithubMark className="h-4 w-4" /> View source
          </a>
        </div>
      </div>
    </footer>
  );
}
