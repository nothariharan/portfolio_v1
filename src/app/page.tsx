"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrainerCard } from "@/components/card/trainer-card";
import { useTransition } from "@/hooks/use-transition";

export default function Home() {
  const { startTransition } = useTransition();
  const [scale, setScale] = useState(1.0);

  // scale handlers with bounds 0.7 to 1.45
  const increaseSize = () => setScale((prev) => Math.min(prev + 0.15, 1.45));
  const decreaseSize = () => setScale((prev) => Math.max(prev - 0.15, 0.7));

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gba-teal min-h-screen relative overflow-hidden">
      {/* scanlines overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

      {/* escape hatch button straight to main portfolio */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2"
      >
        <button
          onClick={() => startTransition("/portfolio")}
          className="font-pixel text-white text-[11px] leading-none px-4 py-3 rounded-[6px] cursor-pointer transition-all duration-150 ease-out hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97] select-none"
          style={{ background: "#e0524a", boxShadow: "inset 0 0 0 2px #a32f28, 0 3px 0 rgba(0,0,0,0.3)" }}
        >
          ▶ MAIN PORTFOLIO
        </button>
        <p className="font-card text-[13px] leading-snug text-slate-500 text-right max-w-[210px] select-none">
          not a big fan of cards? then go to my main portfolio :)
        </p>
      </motion.div>

      {/* floating helper instruction text */}
      <div className="mb-4 text-center select-none z-10">
        <p className="text-[8px] font-pixel text-slate-500 animate-pulse">
          click card to flip · hover to tilt
        </p>
      </div>

      {/* trainer card with retro spring zoom scale animation */}
      <motion.div
        className="w-full max-w-[720px] flex items-center justify-center z-10"
        animate={{ scale: scale }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 18,
        }}
      >
        <TrainerCard onEnterPortfolio={(tab) => startTransition(`/portfolio?tab=${tab}`)} />
      </motion.div>

      {/* zoom sizing button panel */}
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
