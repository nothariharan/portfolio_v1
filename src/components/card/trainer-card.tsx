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
  
  // pause idle float while hover is active so buttons are stable
  const [isHovered, setIsHovered] = useState(false);
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useCardTilt();

  // toggle card flip state
  function handleCardClick() {
    setIsFlipped(!isFlipped);
  }

  function handleLeave() {
    setIsHovered(false);
    handleMouseLeave();
  }

  return (
    <div className="perspective-1000 w-[680px] max-w-full h-[525px] flex items-center justify-center p-2">
      {/* outer container handles 3d tilt and hover float animations */}
      <motion.div
        className="w-full h-full relative cursor-pointer select-none"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          // hover stops float, otherwise float on a sine wave
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
        {/* inner card flip animator */}
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
          {/* front face card slot with a custom shadows bezel */}
          <div
            className="absolute inset-0 backface-hidden rounded-lg overflow-hidden"
            style={{
              boxShadow:
                "0 0 0 2px #cdeeea, 0 0 0 12px #3f9b94, 0 0 0 14px #14403d, 0 16px 36px rgba(0,0,0,0.45)",
            }}
          >
            <CardFront />
            {/* subtle holographic diagonal overlay sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 pointer-events-none opacity-30" />
          </div>

          {/* back face card slot with standard shadows bezel */}
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
