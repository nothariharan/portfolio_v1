"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "../../hooks/use-transition";

// overlay for the full-screen pokemon white flash transition
export function FlashOverlay() {
  const { isTransitioning } = useTransition();

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 bg-white z-[9999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.35, 
            ease: "easeInOut" 
          }}
        />
      )}
    </AnimatePresence>
  );
}
