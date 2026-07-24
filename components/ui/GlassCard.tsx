"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "blue" | "garnet" | "cyan" | "none";
}

const glowMap = {
  blue: "hover:shadow-[0_0_40px_-8px_rgba(59,130,246,0.45)] hover:border-blue-400/40",
  garnet: "hover:shadow-[0_0_40px_-8px_rgba(190,18,60,0.45)] hover:border-rose-500/40",
  cyan: "hover:shadow-[0_0_40px_-8px_rgba(34,211,238,0.45)] hover:border-cyan-400/40",
  none: "",
};

export function GlassCard({ className, glow = "blue", children, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-3xl border border-black/[0.06] bg-white/70 backdrop-blur-xl",
        "dark:border-white/10 dark:bg-white/[0.04]",
        "shadow-[0_8px_32px_-12px_rgba(15,23,42,0.12)] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]",
        "transition-all duration-300",
        glowMap[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
