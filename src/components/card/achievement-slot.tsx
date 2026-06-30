"use client";

import { useState } from "react";

interface AchievementSlotProps {
  title: string;
  level: string;
  category: "project" | "achievement" | "skill";
  description: string;
  iconSrc: string; // path to the generated pixel sprite icon
}

export function AchievementSlot({
  title,
  level,
  category,
  description,
  iconSrc,
}: AchievementSlotProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center p-2 bg-white pixel-border-sm cursor-pointer select-none hover:bg-gba-yellow/10 transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* small retro pixel box for custom sprite icon */}
      <div className="flex items-center justify-center w-8 h-8 mr-2 bg-slate-900 border border-slate-700 rounded overflow-hidden select-none p-0.5">
        <img src={iconSrc} alt={title} className="w-full h-full object-contain pixelated" />
      </div>

      {/* slot name and level */}
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-pixel text-gba-text-dark truncate leading-none mb-1">
          {title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-pixel text-red-500 font-bold leading-none">
            {level}
          </span>
          {/* small hp/experience bar visual effect */}
          <div className="w-12 h-1.5 bg-slate-200 pixel-border-sm flex overflow-hidden">
            <div 
              className="h-full bg-emerald-500" 
              style={{ width: `${level.match(/\d+/) ? level.match(/\d+/)![0] : 80}%` }}
            />
          </div>
        </div>
      </div>

      {/* category tag floating on top right */}
      <span className="absolute top-[-4px] right-2 px-1 text-[6px] font-pixel bg-slate-100 text-gba-text-light border border-slate-300">
        {category}
      </span>

      {/* hover tooltip box */}
      {hovered && (
        <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-slate-800 text-white text-[8px] font-pixel leading-normal pixel-border z-50 shadow-lg pointer-events-none">
          <p className="text-gba-yellow mb-1 font-bold">{title} ({category})</p>
          <p className="text-slate-300">{description}</p>
        </div>
      )}
    </div>
  );
}
