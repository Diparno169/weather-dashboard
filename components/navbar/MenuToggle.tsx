"use client";

import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onClick: () => void;
}

const top = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: 45, translateY: 7 },
};
const middle = {
  closed: { opacity: 1 },
  open: { opacity: 0 },
};
const bottom = {
  closed: { rotate: 0, translateY: 0 },
  open: { rotate: -45, translateY: -7 },
};

export function MenuToggle({ open, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-black/5 backdrop-blur-md transition-colors hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-visible:ring-cyan-400/60"
    >
      <div className="flex h-4 w-5 flex-col justify-between">
        <motion.span
          className="h-[2px] w-full rounded-full bg-cyan-600 dark:bg-cyan-300"
          variants={top}
          animate={open ? "open" : "closed"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="h-[2px] w-full rounded-full bg-cyan-600 dark:bg-cyan-300"
          variants={middle}
          animate={open ? "open" : "closed"}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="h-[2px] w-full rounded-full bg-cyan-600 dark:bg-cyan-300"
          variants={bottom}
          animate={open ? "open" : "closed"}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}
