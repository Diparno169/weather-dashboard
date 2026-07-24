"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-blue-500 text-white shadow-[0_0_24px_-4px_rgba(59,130,246,0.6)] hover:bg-blue-400 hover:shadow-[0_0_32px_-4px_rgba(59,130,246,0.8)]",
  secondary:
    "bg-rose-600 text-white shadow-[0_0_24px_-4px_rgba(190,18,60,0.6)] hover:bg-rose-500 hover:shadow-[0_0_32px_-4px_rgba(190,18,60,0.8)]",
  ghost:
    "bg-black/5 text-slate-700 border border-black/10 hover:bg-black/10 dark:bg-white/5 dark:text-slate-200 dark:border-white/10 dark:hover:bg-white/10",
  outline:
    "bg-transparent text-cyan-600 border border-cyan-500/40 hover:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-400/40 dark:hover:bg-cyan-400/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium",
        "transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
