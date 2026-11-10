"use client";

// pixel joystick control sliding out the repo star counter plaque basically

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { retroSound } from "@/lib/sound";

const REPO_URL = "https://github.com/nothariharan/portfolio_v1";
const REPO_API = "https://api.github.com/repos/nothariharan/portfolio_v1";

const PIXEL_EDGE = "-3px 0 0 #111, 3px 0 0 #111, 0 -3px 0 #111, 0 3px 0 #111";
const SLIDE = { type: "spring" as const, stiffness: 520, damping: 28, mass: 0.62 };

function PixelStar({ px = 18 }: { px?: number }) {
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
    <svg viewBox="0 0 13 12" width={px} height={Math.round((px * 12) / 13)} aria-hidden className="shrink-0 pixelated">
      {cells.map(([x, y, fill]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} shapeRendering="crispEdges" />
      ))}
    </svg>
  );
}

const LEVER = buildJoystick();
const SHAFT_ROWS = LEVER.shaft;
const BASE_ROWS = LEVER.base;
const PIVOT_X = LEVER.pivotX;
const PIVOT_Y = LEVER.pivotY;

// procedurally rasterizes the arcade joystick shaft and red ball knob into pixel grids basically
function buildJoystick() {
  const width = 52;
  const height = 52;
  const base = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
  const shaft = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
  const paint = (grid: string[][], x: number, y: number, ch: string) => {
    if (x >= 0 && y >= 0 && x < width && y < height) grid[y][x] = ch;
  };

  const sx = 8;
  const sy = 40;
  const len = 32;
  const thick = 3.35;
  const dx = 1 / Math.SQRT2;
  const dy = -1 / Math.SQRT2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dist = Math.hypot(x - sx, y - sy);
      if (dist > 5.1) continue;
      paint(base, x, y, dist > 3.9 ? "#" : "B");
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const along = (x - sx) * dx + (y - sy) * dy;
      const side = (x - sx) * dx + (y - sy) * -dy;
      if (along < -0.4 || along > len - 1) continue;
      const ad = Math.abs(side);
      if (ad > thick) continue;
      paint(shaft, x, y, ad > thick - 1.05 ? "#" : side < -1.15 ? "H" : side > 0.85 ? "D" : "M");
    }
  }

  const cx = sx + dx * (len - 2);
  const cy = sy + dy * (len - 2);
  const radius = 9;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ox = x - cx;
      const oy = y - cy;
      const dist = Math.hypot(ox, oy);
      if (dist > radius + 0.3) continue;
      if (dist > radius - 1.15) paint(shaft, x, y, "#");
      else if (ox >= -4 && ox <= -1 && oy >= -5 && oy <= -2) paint(shaft, x, y, "h");
      else if (oy > 2.6 || (ox > 3 && oy > -1)) paint(shaft, x, y, "s");
      else paint(shaft, x, y, "r");
    }
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (base[y][x] === "." && shaft[y][x] === ".") continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  const crop = (grid: string[][]) =>
    grid.slice(minY, maxY + 1).map((row) => row.slice(minX, maxX + 1).join(""));

  return {
    shaft: crop(shaft),
    base: crop(base),
    pivotX: sx - minX,
    pivotY: sy - minY,
  };
}

const LEVER_INK: Record<string, string> = {
  "#": "#111111",
  h: "#ffffff",
  r: "#ef1c1c",
  s: "#7a0909",
  H: "#e4edf4",
  M: "#8d9bab",
  D: "#536170",
  B: "#3c4a58",
};

function leverCells(rows: string[]) {
  const cells: [number, number, string][] = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = LEVER_INK[ch];
      if (fill) cells.push([x, y, fill]);
    });
  });
  return { cells, w: rows[0].length, h: rows.length };
}

// renders the raw string rows into a scaled css grid of colored pixel spans basically
function PixelGrid({ rows, scale }: { rows: string[]; scale: number }) {
  const { cells, w, h } = leverCells(rows);
  const paint = new Map(cells.map(([x, y, fill]) => [`${x},${y}`, fill]));
  const boxes = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      boxes.push(
        <span
          key={`${x}-${y}`}
          style={{
            width: scale,
            height: scale,
            background: paint.get(`${x},${y}`) ?? "transparent",
            pointerEvents: paint.get(`${x},${y}`) ? "auto" : "none",
          }}
        />,
      );
    }
  }

  return (
    <span
      aria-hidden
      className="pointer-events-none block"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${w}, ${scale}px)`,
        width: w * scale,
        height: h * scale,
        lineHeight: 0,
      }}
    >
      {boxes}
    </span>
  );
}

// yellow pixel badge showing star count with pixel octocat and direct repo link ( for now ig )
function StarPlaque({ count, large }: { count: number | null; large?: boolean }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star this portfolio on GitHub"
      onClick={(event) => event.stopPropagation()}
      className={`relative z-30 flex w-max shrink-0 items-center bg-[#ffe14a] ${large ? "gap-3 px-3 py-2" : "gap-2 px-2 py-1.5"}`}
      style={{ boxShadow: PIXEL_EDGE }}
    >
      <img
        src="/hud/pixel_github.png"
        alt=""
        className={`${large ? "h-14 w-14" : "h-10 w-10"} object-contain pixelated`}
        draggable={false}
      />
      <span className={`flex flex-col items-center ${large ? "gap-1.5" : "gap-1"}`}>
        <PixelStar px={large ? 28 : 20} />
        <span className={`font-pixel leading-none text-[#111] ${large ? "text-[14px]" : "text-[11px]"}`}>
          {count == null ? "—" : count}
        </span>
      </span>
    </a>
  );
}

function WallLever({
  scale,
  bury,
  edge,
  swing,
}: {
  scale: number;
  bury: number;
  edge: "left" | "bottom";
  swing: number;
}) {
  const shift = bury * scale;
  const origin = `${(PIVOT_X + 0.5) * scale}px ${(PIVOT_Y + 0.5) * scale}px`;
  return (
    <span
      className="pointer-events-none relative block"
      style={edge === "left" ? { marginLeft: -shift } : { marginBottom: -shift }}
    >
      <PixelGrid rows={BASE_ROWS} scale={scale} />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 block"
        style={{ transformOrigin: origin }}
        animate={{ rotate: swing }}
        transition={SLIDE}
      >
        <PixelGrid rows={SHAFT_ROWS} scale={scale} />
      </motion.span>
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

  // pulls the lever, plays the retro chiptune bip and flips the open state ( for now ig )
  function toggle() {
    retroSound.unlockAudio();
    retroSound.playBip(open ? "low" : "high");
    setOpen((value) => !value);
  }

  const leverButton = (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={open}
      aria-label={open ? "Tuck the GitHub star" : "Pull the GitHub lever"}
      className="relative z-20 cursor-pointer border-0 bg-transparent p-0 pointer-events-none"
    >
      <WallLever
        scale={mobile ? 2 : 3}
        edge={mobile ? "bottom" : "left"}
        bury={mobile ? 0 : 8}
        swing={mobile ? (open ? -80 : 0) : open ? 80 : 0}
      />
    </button>
  );

  const caption = (
    <span className="select-none font-pixel text-[8px] leading-[1.6] text-[#111]">
      star the repo if u
      <br />
      like the portfolio :P
    </span>
  );

  // phone keeps the caption to the right of the plaque so it never sits on the card
  const plaque = open ? (
    <div
      className={`fixed z-30 flex w-max ${mobile ? "flex-row items-center gap-2.5 left-3" : "flex-col items-start gap-3 left-5"}`}
      style={mobile ? { bottom: 76 } : { top: 96 }}
    >
      <StarPlaque count={count} large={!mobile} />
      {caption}
    </div>
  ) : null;

  if (mobile) {
    return (
      <>
        {plaque}
        <div className="fixed z-50 min-[721px]:hidden" style={{ right: 68, bottom: -18 }}>
          {leverButton}
        </div>
      </>
    );
  }

  return (
    <>
      {plaque}
      <div className="fixed left-0 top-1/2 z-50 hidden -translate-y-1/2 min-[721px]:block">
        {leverButton}
      </div>
    </>
  );
}
