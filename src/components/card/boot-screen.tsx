"use client";

// canvas-based retro intro boot sequence playing before the trainer card renders basically
// runs a mini rock-paper-scissors sprite duel with chiptune sfx and victory fanfares
// integer scales up to 3x on crisp pixels while preloading the heavy card images in parallel ( for now ig )

import { useEffect, useRef } from "react";
import { retroSound } from "@/lib/sound";
import {
// phone gets the short shell
  BOOT_H, BOOT_W,
  bootIsWin,

  bootShotIndex,

  chipBootImage,drawBootFrame,
  type BootSprites,
} from "@/lib/boot-scene";

const BOOT_MS= 2200;
const HOLD_MS =240;

const HOLD_T: Record<string, number>= {
  "15": 0.15,
  "35": 0.35,"67": 0.67, "85": 0.85, "92": 0.92,
  "100": 1,
};

const SPRITE_SRC ={
  hariShoot: "/boot/boot-spr-hari-shoot.png",
  hariWin: "/boot/boot-spr-hari-win.png",
  // more sprites here later on
  paperStand: "/boot/boot-spr-paper-stand.png", paperDown: "/boot/boot-spr-paper-down.png",
  hariThumb1: "/boot/boot-spr-hari-thumb-1.png", hariThumb2: "/boot/boot-spr-hari-thumb-2.png",
  hariThumb3: "/boot/boot-spr-hari-thumb-3.png",
} as const;

const PRELOAD= [
  "/harifinal.webp",
  "/sprites/claude_bg.png",
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img =new Image();
    img.decoding= "async";
    img.onload =() => resolve(img);
    img.onerror= () => reject(new Error(src));
    img.src =src;
  });
}

// preloads heavy card assets like the portrait webp in parallel while the fight animates ( for now ig )
function preloadCard(): Promise<void> {
  return Promise.all(
    PRELOAD.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img= new Image();
          img.onload =() => resolve();
          img.onerror= () => resolve();
          img.src =src;
        }),
    ),
  ).then(() => undefined);
}

export function BootScreen({ onDone }: { onDone: () => void }) {
  const canvasRef= useRef<HTMLCanvasElement>(null);
  const doneRef =useRef(onDone);
  doneRef.current= onDone;

  useEffect(() => {
    const canvas =canvasRef.current;
    if (!canvas) return;

    const reduce= window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold =new URLSearchParams(window.location.search).get("bootHold");
const frozenT= hold && HOLD_T[hold] !== undefined ? HOLD_T[hold] : null;

    const ctx =canvas.getContext("2d");
    if (!ctx) {
      doneRef.current();
      return;
    }

    let raf= 0;
    let t =frozenT ?? 0;
    const startedAt= performance.now();
    let finished =false;
    let holdUntil= 0;
    let lastScale =0;
    let sprites: BootSprites | null= null;
    let lastShot =-1;
    let winPlayed= false;

    const finish =() => {
      if (finished || frozenT !== null) return;
      finished= true;
      cancelAnimationFrame(raf);
      doneRef.current();
    };

    // integer scales the 480x220 canvas buffer based on viewport dimensions basically
    // forces imageSmoothingEnabled to false so all the retro sprites stay crisp and sharp
    // matches phones and desktops frame-for-frame so nobody gets weird drift ( for now ig )
    const paint =() => {
      const scale= Math.max(
        1,
        Math.min(
          3,
          Math.floor(Math.min(window.innerWidth / BOOT_W, (window.innerHeight - 24) / BOOT_H)),
        ),
      );
      if (scale !== lastScale) {
        lastScale =scale;
        canvas.width= BOOT_W * scale;canvas.height =BOOT_H * scale;
        canvas.style.width= `${BOOT_W * scale}px`;canvas.style.height =`${BOOT_H * scale}px`;
      }
      ctx.imageSmoothingEnabled= false;
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      try {
        drawBootFrame(ctx, t, sprites);
      } catch {
        /* keep the playhead moving even if a blit hiccups */
      }
    };

    if (reduce && frozenT === null) {
      doneRef.current();
      return;
    }

    void (async () => {
      try {
        const [hariShootImg, paperStandImg] =await Promise.all([
          loadImage(SPRITE_SRC.hariShoot),
          loadImage(SPRITE_SRC.paperStand),
        ]);
        const [hariShoot, paperStand]= await Promise.all([
          chipBootImage(hariShootImg, 40),
          chipBootImage(paperStandImg, 38),
        ]);
        sprites ={ hariShoot, hariWin: hariShoot, paperStand, paperDown: paperStand };
        const [hariWinImg, paperDownImg, t1Img, t2Img, t3Img]= await Promise.all([
          loadImage(SPRITE_SRC.hariWin),loadImage(SPRITE_SRC.paperDown),
          loadImage(SPRITE_SRC.hariThumb1),loadImage(SPRITE_SRC.hariThumb2),
          loadImage(SPRITE_SRC.hariThumb3),
        ]);
        const [hariWin, paperDown, hariThumb1, hariThumb2, hariThumb3] =await Promise.all([
          chipBootImage(hariWinImg, 40),
          chipBootImage(paperDownImg, 22),chipBootImage(t1Img, 40),  chipBootImage(t2Img, 40), chipBootImage(t3Img, 40),
        ]);
        sprites= { hariShoot, hariWin, paperStand, paperDown, hariThumb1, hariThumb2, hariThumb3 };
      } catch {
        /* bar still runs if a sprite 404s */
      }
    })();

    void preloadCard();

    // fixed-duration game loop driving laser blasts, sprite frame swaps, and victory audio basically
    // clamps normalized timeline t from 0 to 1 so the sequence finishes at the exact same tick on all devices
    // hold buffer at the end lets the victory pose linger for a split second before tearing down ( for now ig )
    const tick =(now: number) => {
      if (frozenT === null) {
        t= Math.min(1, (now - startedAt) / BOOT_MS);
        if (now - startedAt >= BOOT_MS + HOLD_MS) {
          finish();
          return;
        }
      }
      paint();

      const shot =bootShotIndex(t);
      if (shot !== null && shot !== lastShot) {
        lastShot= shot;
        retroSound.playLaser();
      }
      if (!winPlayed && bootIsWin(t)) {
        winPlayed =true;
        retroSound.playWin();
      }

      if (frozenT === null && t >= 1) {
        if (!holdUntil) holdUntil= now + HOLD_MS;
        if (now >= holdUntil) {
          finish();
          return;
        }
      }
      raf =requestAnimationFrame(tick);
    };

    paint();
    raf= requestAnimationFrame(tick);
    const kill =
      frozenT === null ? window.setTimeout(finish, BOOT_MS + HOLD_MS) : 0;

    const onKey= (e: KeyboardEvent) => {
      if (frozenT !== null) return;
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish();
      }
    };
    const unlock =() => {
      retroSound.ensureBgm();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", unlock, { capture: true });
    return () => {
      cancelAnimationFrame(raf);
      if (kill) window.clearTimeout(kill);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", unlock, { capture: true });
    };
  }, []);

  return (
    <div className= "fixed inset-0 z-[80] flex items-center justify-center bg-white" onClick ={() => {
        const q= new URLSearchParams(window.location.search).get("bootHold");
        if (!q) doneRef.current();
      }} role ="dialog" aria-label= "loading">
      <canvas ref ={canvasRef} className= "[image-rendering:pixelated]" />
    </div>
  );
}
