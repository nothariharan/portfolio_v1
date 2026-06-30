"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrainerCard } from "@/components/card/trainer-card";
import { useTransition } from "@/hooks/use-transition";

export default function Home() {
  const { startTransition } = useTransition();
  const [scale, setScale] = useState(1.0);

  // handlers to increase and decrease scale multiplier (bounds: 0.7 to 1.45)
  const increaseSize = () => setScale((prev) => Math.min(prev + 0.15, 1.45));
  const decreaseSize = () => setScale((prev) => Math.max(prev - 0.15, 0.7));

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gba-teal min-h-screen relative overflow-hidden">
      {/* scanline effects for background grid */}
      <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

      {/* simple floating controls instructions */}
      <div className="mb-4 text-center select-none z-10">
        <p className="text-[8px] font-pixel text-slate-500 animate-pulse">
          click card to flip · hover to tilt
        </p>
      </div>

      {/* primary interactive trainer card with retro scaling spring animation */}
      <motion.div
        className="w-full max-w-[720px] flex items-center justify-center z-10"
        animate={{ scale: scale }}
        transition={{
          type: "spring",
          stiffness: 380, // high stiffness for snappy retro step scaling
          damping: 18,    // slightly underdamped for a small springy pop bounce
        }}
      >
        <TrainerCard onEnterPortfolio={() => startTransition("/portfolio")} />
      </motion.div>

      {/* sizing controls panel in bottom right */}
      <div className="fixed bottom-4 right-4 flex flex-col items-end gap-1.5 z-50">
        <span className="text-[6px] font-pixel text-slate-500 select-none">
          ZOOM: {Math.round(scale * 100)}%
        </span>
        <div className="flex gap-1.5">
          <button 
            onClick={decreaseSize} 
            className="w-6 h-6 bg-slate-100 hover:bg-slate-200 border border-slate-600 text-gba-text-dark font-pixel text-[8px] flex items-center justify-center cursor-pointer shadow active:scale-90 transition-transform select-none rounded"
            title="decrease size"
          >
            -
          </button>
          <button 
            onClick={increaseSize} 
            className="w-6 h-6 bg-slate-100 hover:bg-slate-200 border border-slate-600 text-gba-text-dark font-pixel text-[8px] flex items-center justify-center cursor-pointer shadow active:scale-90 transition-transform select-none rounded"
            title="increase size"
          >
            +
          </button>
        </div>
      </div>
    </main>
  );
}
