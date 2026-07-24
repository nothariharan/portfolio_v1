"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCardTilt } from "../../hooks/use-card-tilt";
import { CardFront } from "./card-front";
import { CardBack } from "./card-back";

import type { TabKey } from "../portfolio/data";

interface TrainerCardProps {
  onEnterPortfolio: (tab: TabKey) => void;
}

export function TrainerCard({ onEnterPortfolio }: TrainerCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // keep the float chill while you're hovering so buttons don't bounce
  const [isHovered, setIsHovered] = useState(false);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  function handleCardClick() {
    setIsFlipped((prev) => !prev);
  }

  function handleLeave() {
    setIsHovered(false);
    handleMouseLeave();
  }

  return (
    <div className="perspective-1000 w-[680px] max-w-full h-[525px] flex items-center justify-center p-2">
      {/* tilt + float live here; flip is on the inner shell */}
      <motion.div
        className="w-full h-full relative cursor-pointer select-none"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          // float when idle, settle when hovered
          y: isHovered ? 0 : [0, -8, 0],
        }}
        transition={{
          y: isHovered
            ? { duration: 0.4, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleLeave}
        onClick={handleCardClick}
      >
        {/* actual flip */}
        <motion.div
          className="w-full h-full relative"
          style={{
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 20,
          }}
        >
          {/* front — disable hits when flipped so the back can receive hover */}
          <div
            className="absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              pointerEvents: isFlipped ? "none" : "auto",
              boxShadow:
                "0 0 0 3px #33406b, 0 0 0 8px #f2e6bc, 0 0 0 11px #33406b, 0 0 0 13px #1f2a44, 0 16px 36px rgba(0,0,0,0.45)",
            }}
          >
            <CardFront />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-30" />
          </div>

          {/* back — only interactive when facing the user */}
          <div
            className="absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              transform: "rotateY(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
              boxShadow:
                "0 0 0 3px #33406b, 0 0 0 8px #f2e6bc, 0 0 0 11px #33406b, 0 0 0 13px #1f2a44, 0 16px 36px rgba(0,0,0,0.45)",
            }}
          >
            <CardBack onEnterPortfolio={onEnterPortfolio} />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-30" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
