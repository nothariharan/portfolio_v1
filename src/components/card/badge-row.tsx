"use client";

import { useState } from "react";

// badge data structure
interface Badge {
  id: number;
  name: string;
  color: string;
  shape: "droplet" | "flame" | "leaf" | "bolt" | "diamond" | "shield" | "star" | "heart";
  description: string;
}

const BADGES: Badge[] = [
  { id: 1, name: "Next.js", color: "bg-black text-white", shape: "droplet", description: "server side architecture & routing" },
  { id: 2, name: "React", color: "bg-cyan-500 text-slate-900", shape: "star", description: "dynamic ui components & state management" },
  { id: 3, name: "TypeScript", color: "bg-blue-600 text-white", shape: "diamond", description: "type safety & robust developer experience" },
  { id: 4, name: "Tailwind", color: "bg-teal-400 text-slate-900", shape: "heart", description: "utility classes & theme configuration" },
  { id: 5, name: "Node.js", color: "bg-emerald-500 text-slate-900", shape: "leaf", description: "server scripts & backend services" },
  { id: 6, name: "Python", color: "bg-amber-400 text-blue-900", shape: "bolt", description: "scraping & automation scripts" },
  { id: 7, name: "Obsidian", color: "bg-indigo-500 text-white", shape: "shield", description: "second brain knowledge management" },
  { id: 8, name: "GitHub API", color: "bg-purple-600 text-white", shape: "flame", description: "dynamic repo fetches & workflow pipelines" },
];

export function BadgeRow() {
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  // helper to render gym badge icons as svgs
  function renderBadgeShape(shape: string, color: string) {
    // get the background color class
    const colorClass = color.split(" ")[0];
    
    // retro pixel-style paths for badges
    switch (shape) {
      case "droplet":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <path d="M50 10 L80 60 A 30 30 0 1 1 20 60 Z" />
          </svg>
        );
      case "flame":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <path d="M50 10 C 65 30, 80 50, 75 75 C 70 90, 30 90, 25 75 C 20 50, 35 30, 50 10 Z" />
          </svg>
        );
      case "leaf":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <path d="M20 80 Q 20 20 80 20 Q 80 80 20 80 Z" />
          </svg>
        );
      case "bolt":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <polygon points="50,10 70,50 45,50 60,90 30,50 55,50" />
          </svg>
        );
      case "diamond":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <polygon points="50,10 85,50 50,90 15,50" />
          </svg>
        );
      case "shield":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <path d="M20 15 L80 15 L80 50 C80 75, 50 90, 50 90 C50 90, 20 75, 20 50 Z" />
          </svg>
        );
      case "star":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
          </svg>
        );
      case "heart":
        return (
          <svg className={`w-5 h-5 ${colorClass} text-white fill-current pixel-border-sm`} viewBox="0 0 100 100">
            <path d="M12,30 A15,15 0 0,1 50,30 A15,15 0 0,1 88,30 Q88,60 50,90 Q12,60 12,30 Z" />
          </svg>
        );
      default:
        return <div className={`w-5 h-5 ${colorClass} pixel-border-sm`} />;
    }
  }

  return (
    <div className="relative flex flex-col mt-4">
      {/* header strip for the badge row */}
      <div className="flex items-center justify-between mb-1 px-1 border-b-2 border-slate-300 pb-1">
        <span className="text-[8px] font-pixel text-gba-text-light">BADGES</span>
        {activeBadge ? (
          <span className="text-[8px] font-pixel text-red-500 font-bold tracking-tight uppercase">
            {activeBadge.name}
          </span>
        ) : (
          <span className="text-[8px] font-pixel text-slate-400">HOVER TO VIEW</span>
        )}
      </div>

      {/* badges layout grid */}
      <div className="grid grid-cols-8 gap-1.5 justify-items-center">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className="group relative cursor-help transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setActiveBadge(badge)}
            onMouseLeave={() => setActiveBadge(null)}
          >
            {renderBadgeShape(badge.shape, badge.color)}
          </div>
        ))}
      </div>

      {/* badge details readout bar */}
      <div className="mt-2 h-7 bg-slate-100 pixel-border-sm flex items-center px-2">
        <p className="text-[7px] font-pixel text-gba-text-dark leading-tight truncate">
          {activeBadge ? activeBadge.description : "gym badges earned through development trials..."}
        </p>
      </div>
    </div>
  );
}
