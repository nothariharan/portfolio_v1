"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { retroSound } from "@/lib/sound";

const REPO_URL = "https://github.com/nothariharan/portfolio_v1";
const REPO_API = "https://api.github.com/repos/nothariharan/portfolio_v1";

const PIXEL_EDGE =
  "-3px 0 0 #111, 3px 0 0 #111, 0 -3px 0 #111, 0 3px 0 #111";

function PixelStar() {
  const ink = "#111111";
  const pale = "#fff4a8";
  const gold = "#ffe14a";
  const shade = "#f0a020";
  const cells: [number, number, string][] = [
    [7, 0, pale],
    [6, 1, ink], [7, 1, pale], [8, 1, ink],
    [5, 2, ink], [6, 2, pale], [7, 2, gold], [8, 2, gold], [9, 2, ink],
    [4, 3, ink], [5, 3, gold], [6, 3, gold], [7, 3, gold], [8, 3, gold], [9, 3, shade], [10, 3, ink],
    [1, 4, ink], [2, 4, pale], [3, 4, gold], [4, 4, gold], [5, 4, gold], [6, 4, gold], [7, 4, gold], [8, 4, gold], [9, 4, shade], [10, 4, shade], [11, 4, ink],
    [0, 5, ink], [1, 5, gold], [2, 5, gold], [3, 5, gold], [4, 5, gold], [5, 5, gold], [6, 5, gold], [7, 5, gold], [8, 5, shade], [9, 5, shade], [10, 5, shade], [11, 5, shade], [12, 5, ink],
    [1, 6, ink], [2, 6, gold], [3, 6, gold], [4, 6, gold], [5, 6, gold], [6, 6, gold], [7, 6, shade], [8, 6, shade], [9, 6, shade], [10, 6, shade], [11, 6, ink],
    [2, 7, ink], [3, 7, gold], [4, 7, gold], [5, 7, gold], [6, 7, shade], [7, 7, shade], [8, 7, shade], [9, 7, shade], [10, 7, ink],
    [2, 8, ink], [3, 8, gold], [4, 8, shade], [5, 8, ink], [7, 8, ink], [8, 8, shade], [9, 8, ink],
    [1, 9, ink], [2, 9, gold], [3, 9, ink], [4, 9, ink], [8, 9, ink], [9, 9, shade], [10, 9, ink],
    [0, 10, ink], [1, 10, shade], [2, 10, ink], [9, 10, ink], [10, 10, shade], [11, 10, ink],
    [0, 11, ink], [11, 11, ink],
  ];

  return (
    <svg viewBox="0 0 13 12" width="16" height="15" aria-hidden className="shrink-0 pixelated">
      {cells.map(([x, y, fill]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />
      ))}
    </svg>
  );
}

function StarPlaque({ count }: { count: number | null }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star this portfolio on GitHub"
      className="flex items-center gap-1.5 bg-[#f6ecc6] px-1.5 py-1"
      style={{ boxShadow: PIXEL_EDGE }}
    >
      <img
        src="/hud/pixel_github.png"
        alt=""
        className="h-9 w-9 object-contain pixelated"
        draggable={false}
      />
      <span className="flex flex-col items-center gap-0.5">
        <PixelStar />
        <span className="font-pixel text-[8px] leading-none text-[#111]">
          {count == null ? "—" : count}
        </span>
      </span>
    </a>
  );
}

function LeverTrack({ open }: { open: boolean }) {
  return (
    <span
      className="relative block h-[18px] w-[48px] bg-[#1a1a1a]"
      style={{ boxShadow: PIXEL_EDGE }}
    >
      <motion.span
        className="absolute top-[2px] block h-[14px] w-[16px] bg-[#111]"
        animate={{ left: open ? 28 : 2 }}
        transition={{ type: "spring", stiffness: 560, damping: 28, mass: 0.6 }}
        style={{ boxShadow: "inset 2px 2px 0 #4a4a4a, inset -2px -2px 0 #000" }}
      />
    </span>
  );
}

export function GithubStarLever({ mobile }: { mobile: boolean }) {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let dead = false;
    fetch(REPO_API)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!dead && data && typeof data.stargazers_count === "number") {
          setCount(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, []);

  function toggle() {
    retroSound.unlockAudio();
    retroSound.playBip(open ? "low" : "high");
    setOpen((value) => !value);
  }

  const plaque = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="github-star"
          initial={mobile ? { y: 12, opacity: 0 } : { x: -14, opacity: 0 }}
          animate={mobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={mobile ? { y: 10, opacity: 0 } : { x: -12, opacity: 0 }}
          transition={{ type: "spring", stiffness: 480, damping: 30 }}
        >
          <StarPlaque count={count} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  const lever = (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={open ? "Tuck the GitHub star" : "Pull out the GitHub star"}
      className="cursor-pointer border-0 bg-transparent p-0"
    >
      <LeverTrack open={open} />
    </button>
  );

  if (mobile) {
    return (
      <div className="fixed z-50 flex flex-col items-center gap-2 right-[58px] bottom-[calc(max(0.4rem,env(safe-area-inset-bottom))+10px)] min-[721px]:hidden">
        {plaque}
        {lever}
      </div>
    );
  }

  return (
    <div className="fixed left-1 top-[54%] z-50 hidden -translate-y-1/2 items-center gap-2 min-[721px]:flex">
      {lever}
      {plaque}
    </div>
  );
}
