"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

export function OnlineStatusBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-3"
          role="status"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-950/90 px-4 py-2 text-sm font-medium text-rose-100 shadow-xl backdrop-blur-xl">
            <WifiOff className="h-4 w-4" />
            You&apos;re offline — showing your last saved data.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
