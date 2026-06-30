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
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  // flip state toggle
  function handleCardClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div className="perspective-1000 w-[700px] max-w-full h-[580px] flex items-center justify-center p-2">
      {/* outer container handles 3d mouse-tilt and floating idle animation */}
      <motion.div
        className="w-full h-full relative cursor-pointer select-none"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          y: [0, -8, 0], // slow sine-wave hover movement
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >
        {/* inner container handles card flipping */}
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
          {/* front of the developer card — stepped pixel bezel (light / mid / dark teal) */}
          <div
            className="absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 2px #cdeeea, 0 0 0 12px #3f9b94, 0 0 0 14px #14403d, 0 16px 36px rgba(0,0,0,0.45)",
            }}
          >
            <CardFront />
            {/* subtle holographic sheen — light so it doesn't muddy the white face */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-30" />
          </div>

          {/* back of the trainer card (pokedex) — same stepped pixel bezel as the front */}
          <div
            className="absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              transform: "rotateY(180deg)",
              boxShadow:
                "0 0 0 2px #cdeeea, 0 0 0 12px #3f9b94, 0 0 0 14px #14403d, 0 16px 36px rgba(0,0,0,0.45)",
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
