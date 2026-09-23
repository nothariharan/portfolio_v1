/** Logical buffer. Display is an integer scale of this. */
export const BOOT_W = 480;
export const BOOT_H = 220;

export type BootSprites = {
  hariShoot: CanvasImageSource;
  hariWin: CanvasImageSource;
  paperStand: CanvasImageSource;
  paperDown: CanvasImageSource;
  hariThumb1?: CanvasImageSource;
  hariThumb2?: CanvasImageSource;
  hariThumb3?: CanvasImageSource;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * clamp01(t);
}

function easeOut(t: number) {
  const x = clamp01(t);
  return 1 - (1 - x) * (1 - x);
}

const boundCache = new WeakMap<CanvasImageSource, { x: number; y: number; w: number; h: number }>();

function srcSize(img: CanvasImageSource) {
  if (img instanceof HTMLImageElement) return { w: img.naturalWidth, h: img.naturalHeight };
  if (img instanceof HTMLCanvasElement) return { w: img.width, h: img.height };
  if (typeof ImageBitmap !== "undefined" && img instanceof ImageBitmap) {
    return { w: img.width, h: img.height };
  }
  if (typeof OffscreenCanvas !== "undefined" && img instanceof OffscreenCanvas) {
    return { w: img.width, h: img.height };
  }
  return { w: 0, h: 0 };
}

export function alphaBounds(img: CanvasImageSource) {
  const hit = boundCache.get(img);
  if (hit) return hit;
  const { w, h } = srcSize(img);
  const box = { x: 0, y: 0, w, h };
  if (w < 2 || h < 2) {
    boundCache.set(img, box);
    return box;
  }
  const max = 320;
  const shrink = Math.min(1, max / Math.max(w, h));
  const sw = Math.max(1, Math.round(w * shrink));
  const sh = Math.max(1, Math.round(h * shrink));
  const c = document.createElement("canvas");
  c.width = sw;
  c.height = sh;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) {
    boundCache.set(img, box);
    return box;
  }
  g.imageSmoothingEnabled = false;
  g.drawImage(img, 0, 0, sw, sh);
  const data = g.getImageData(0, 0, sw, sh).data;
  let minX = sw;
  let minY = sh;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      if (data[(y * sw + x) * 4 + 3] > 18) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const out =
    maxX >= minX
      ? {
          x: Math.floor(minX / shrink),
          y: Math.floor(minY / shrink),
          w: Math.ceil((maxX - minX + 1) / shrink),
          h: Math.ceil((maxY - minY + 1) / shrink),
        }
      : box;
  boundCache.set(img, out);
  return out;
}

function chipSprite(img: CanvasImageSource, destH: number) {
  const b = alphaBounds(img);
  if (b.w < 2 || b.h < 2) return null;
  const step = Math.max(1, Math.round(b.h / destH));
  const dw = Math.max(1, Math.round(b.w / step));
  const dh = Math.max(1, Math.round(b.h / step));
  const c = document.createElement("canvas");
  c.width = dw;
  c.height = dh;
  const g = c.getContext("2d");
  if (!g) return null;
  g.imageSmoothingEnabled = false;
  g.drawImage(img, b.x, b.y, b.w, b.h, 0, 0, dw, dh);
  return c;
}

export function prepareBootSprites(raw: BootSprites): BootSprites {
  return {
    hariShoot: chipSprite(raw.hariShoot, 40) ?? raw.hariShoot,
    hariWin: chipSprite(raw.hariWin, 40) ?? raw.hariWin,
    paperStand: chipSprite(raw.paperStand, 38) ?? raw.paperStand,
    paperDown: chipSprite(raw.paperDown, 22) ?? raw.paperDown,
  };
}

export async function chipBootImage(img: HTMLImageElement, destH: number) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (w < 2 || h < 2) return img;
  const max = 256;
  const shrink = Math.min(1, max / Math.max(w, h));
  let src: CanvasImageSource = img;
  if (shrink < 1 && typeof createImageBitmap === "function") {
    src = await createImageBitmap(img, {
      resizeWidth: Math.max(1, Math.round(w * shrink)),
      resizeHeight: Math.max(1, Math.round(h * shrink)),
      resizeQuality: "pixelated",
    });
  }
  return chipSprite(src, destH) ?? src;
}

function spriteSize(img: CanvasImageSource, destH: number) {
  const { w, h } = srcSize(img);
  if (w < 2 || h < 2) return { dw: 0, dh: 0, sx: 0, sy: 0, sw: 0, sh: 0 };
  if (w <= destH * 2 && h <= destH * 2) {
    return { dw: w, dh: h, sx: 0, sy: 0, sw: w, sh: h };
  }
  const b = alphaBounds(img);
  if (b.w < 2 || b.h < 2) return { dw: 0, dh: 0, sx: 0, sy: 0, sw: 0, sh: 0 };
  const step = Math.max(1, Math.round(b.h / destH));
  return {
    dw: Math.max(1, Math.round(b.w / step)),
    dh: Math.max(1, Math.round(b.h / step)),
    sx: b.x,
    sy: b.y,
    sw: b.w,
    sh: b.h,
  };
}

type Pose = {
  hop?: number;
  ox?: number;
  rot?: number;
  sx?: number;
  sy?: number;
};

function blitPose(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  feetX: number,
  feetY: number,
  destH: number,
  pose: Pose = {},
) {
  const dim = spriteSize(img, destH);
  if (dim.dw < 2 || dim.dh < 2) return;
  const hop = pose.hop ?? 0;
  const ox = pose.ox ?? 0;
  const rot = pose.rot ?? 0;
  const sx = pose.sx ?? 1;
  const sy = pose.sy ?? 1;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(Math.round(feetX + ox), Math.round(feetY + hop));
  if (rot) ctx.rotate((rot * Math.PI) / 180);
  if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);
  ctx.drawImage(img, dim.sx, dim.sy, dim.sw, dim.sh, Math.round(-dim.dw / 2), -dim.dh, dim.dw, dim.dh);
  ctx.restore();
}

function shadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, hop: number) {
  const wide = Math.max(8, Math.round(w * (1 + Math.min(0, hop) * -0.04)));
  pix(ctx, x - wide / 2, y + 1, wide, 2, "rgba(40,48,64,0.16)");
}

function pix(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/** Grey → yellow (~35%) → lime → green. Whole fill shifts with t. */
const BAR_STOPS: [number, [number, number, number]][] = [
  [0, [143, 154, 166]],
  [0.2, [168, 164, 142]],
  [0.35, [228, 192, 74]],
  [0.52, [214, 196, 70]],
  [0.68, [168, 196, 72]],
  [0.86, [96, 176, 72]],
  [1, [63, 155, 70]],
];

function mixRgb(a: [number, number, number], b: [number, number, number], u: number): [number, number, number] {
  return [
    Math.round(lerp(a[0], b[0], u)),
    Math.round(lerp(a[1], b[1], u)),
    Math.round(lerp(a[2], b[2], u)),
  ];
}

export function barFillRgb(t: number): [number, number, number] {
  const x = clamp01(t);
  let i = 0;
  while (i < BAR_STOPS.length - 1 && x > BAR_STOPS[i + 1][0]) i++;
  const [t0, c0] = BAR_STOPS[i];
  const [t1, c1] = BAR_STOPS[Math.min(i + 1, BAR_STOPS.length - 1)];
  const span = t1 - t0;
  return span <= 0 ? c1 : mixRgb(c0, c1, (x - t0) / span);
}

function rgbCss(c: [number, number, number]) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function drawBar(ctx: CanvasRenderingContext2D, x: number, y: number, segs: number, t: number) {
  const cell = 8;
  const h = 8;
  const w = segs * cell;
  const filled = Math.round(segs * clamp01(t));
  const fill = rgbCss(barFillRgb(t));
  pix(ctx, x - 2, y - 1, w + 4, h + 2, "#c8ced6");
  pix(ctx, x - 1, y, 1, h, "#d7dce3");
  pix(ctx, x + w, y, 1, h, "#d7dce3");
  for (let i = 0; i < segs; i++) {
    pix(ctx, x + i * cell, y, cell - 1, h, i < filled ? fill : "#e8ecf1");
  }
}

function stepCycle(u: number, frames: number) {
  const raw = clamp01(u) * frames;
  const frame = Math.floor(raw) % frames;
  const phase = raw - Math.floor(raw);
  return { frame, phase };
}

/** Contact → air → contact, like the 8-frame walk/run sheet. */
function gait(u: number, frames: number, hopPx: number) {
  const { frame, phase } = stepCycle(u, frames);
  const air = Math.sin(phase * Math.PI);
  const contact = phase < 0.14 || phase > 0.86;
  return {
    frame,
    hop: -air * hopPx,
    rot: phase < 0.5 ? 7 : -7,
    sx: contact ? 1.1 : 0.94,
    sy: contact ? 0.86 : 1.08,
    dust: contact && phase < 0.1,
  };
}

function drawDust(ctx: CanvasRenderingContext2D, x: number, y: number, seed: number) {
  const n = 3 + (seed % 2);
  for (let i = 0; i < n; i++) {
    pix(ctx, x - 6 + i * 5, y + (i % 2), 2, 1, "rgba(80,88,100,0.28)");
  }
}

function drawBolt(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  u: number,
) {
  const head = clamp01(u);
  const tail = clamp01(u - 0.28);
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    if (p < tail || p > head) continue;
    const x = lerp(x0, x1, p);
    const y = lerp(y0, y1, p);
    const tip = p > head - 0.12;
    pix(ctx, x, y, tip ? 3 : 2, tip ? 3 : 2, tip ? "#ffe46a" : "#ff3a3a");
  }
}

function drawMuzzle(ctx: CanvasRenderingContext2D, x: number, y: number, on: boolean) {
  if (!on) return;
  pix(ctx, x, y, 5, 3, "#fff4b0");
  pix(ctx, x + 4, y - 1, 3, 5, "#ff6a3a");
  pix(ctx, x + 7, y + 1, 2, 2, "#ffe46a");
}

function drawHitSpark(ctx: CanvasRenderingContext2D, x: number, y: number, u: number) {
  if (u <= 0 || u > 0.45) return;
  const r = Math.round(3 + (1 - u) * 5);
  pix(ctx, x - r, y, 2, 2, "#fff");
  pix(ctx, x + r, y, 2, 2, "#ff6a6a");
  pix(ctx, x, y - r, 2, 2, "#ffe46a");
  pix(ctx, x, y + r, 2, 2, "#fff");
}

function drawBurst(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, n: number, colors: string[]) {
  if (u <= 0 || u >= 1) return;
  const r = 3 + u * 16;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + u * 1.2;
    pix(
      ctx,
      x + Math.cos(a) * r,
      y + Math.sin(a) * r * 0.7,
      2,
      2,
      colors[i % colors.length],
    );
  }
}

/** Fight volleys: t 0.30 → 0.78, one shot every 0.12. */
export function bootShotIndex(t: number): number | null {
  if (t < 0.3 || t >= 0.78) return null;
  return Math.floor((t - 0.3) / 0.12);
}

export function bootIsWin(t: number): boolean {
  return t >= 0.9;
}

export function drawBootFrame(ctx: CanvasRenderingContext2D, t: number, sprites: BootSprites | null) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, BOOT_W, BOOT_H);

  let shakeX = 0;
  let shakeY = 0;
  if (t >= 0.3 && t < 0.78) {
    const shot = (t - 0.3) / 0.12;
    const phase = shot - Math.floor(shot);
    if (phase < 0.2) {
      shakeX = (Math.floor(t * 90) % 2) * 2 - 1;
      shakeY = Math.floor(t * 70) % 2;
    }
  } else if (t >= 0.78 && t < 0.88) {
    shakeX = Math.round(Math.sin(t * 88) * 3);
    shakeY = Math.round(Math.cos(t * 70) * 2);
  } else if (t >= 0.9 && t < 0.95) {
    shakeX = Math.round(Math.sin(t * 50) * 2);
  }
  ctx.save();
  ctx.translate(shakeX, shakeY);

  const segs = 18;
  const barW = segs * 8;
  const barX = Math.round((BOOT_W - barW) / 2);
  const barY = 138;
  const feetY = barY;

  const walkU = clamp01(t / 0.2);
  const aimU = clamp01((t - 0.2) / 0.1);
  const fallU = clamp01((t - 0.78) / 0.12);
  const winU = clamp01((t - 0.9) / 0.1);

  const homeHari = barX + 22;
  const homePaper = barX + barW - 22;
  let hariX = lerp(barX - 10, homeHari, easeOut(walkU));
  let paperX = lerp(barX + barW + 10, homePaper, easeOut(walkU));

  const hariPose: Pose = { hop: 0, ox: 0, rot: 0, sx: 1, sy: 1 };
  const paperPose: Pose = { hop: 0, ox: 0, rot: 0, sx: 1, sy: 1 };
  let hariImg: CanvasImageSource | null = sprites?.hariShoot ?? null;
  let paperImg: CanvasImageSource | null = sprites?.paperStand ?? null;
  let paperH = 38;
  let bolt: { u: number } | null = null;
  let muzzle = false;
  let spark = 0;
  let dustHari = false;
  let dustPaper = false;
  let dustHariFrame = 0;
  let dustPaperFrame = 0;

  if (t < 0.2) {
    const hg = gait(walkU, 8, 6);
    const pg = gait(clamp01(walkU + 0.08), 6, 5);
    Object.assign(hariPose, { hop: hg.hop, rot: hg.rot, sx: hg.sx, sy: hg.sy });
    Object.assign(paperPose, { hop: pg.hop, rot: -pg.rot, sx: pg.sx, sy: pg.sy });
    dustHari = hg.dust;
    dustPaper = pg.dust;
    dustHariFrame = hg.frame;
    dustPaperFrame = pg.frame;
  } else if (t < 0.3) {
    hariPose.ox = lerp(0, 3, aimU);
    hariPose.rot = lerp(0, -8, aimU);
    hariPose.sx = lerp(1, 1.06, aimU);
    hariPose.sy = lerp(1, 0.94, aimU);
    paperPose.rot = lerp(0, 6, Math.sin(aimU * Math.PI));
    paperPose.hop = -Math.sin(aimU * Math.PI) * 2;
  } else if (t < 0.78) {
    const shotLen = 0.12;
    const shot = (t - 0.3) / shotLen;
    const phase = shot - Math.floor(shot);
    const kick = phase < 0.22;
    hariPose.ox = kick ? -5 : 1;
    hariPose.hop = kick ? 2 : -Math.sin(phase * Math.PI * 2) * 1.2;
    hariPose.rot = kick ? -10 : -3;
    hariPose.sx = kick ? 1.12 : 1;
    hariPose.sy = kick ? 0.88 : 1;
    muzzle = phase < 0.2;
    bolt = { u: clamp01(phase / 0.45) };
    const hit = phase > 0.18 && phase < 0.7;
    paperPose.ox = hit ? 5 + Math.sin(phase * 40) * 2 : Math.sin(t * 18) * 0.8;
    paperPose.rot = hit ? 12 : Math.sin(t * 22) * 3;
    paperPose.hop = hit ? -2 : Math.sin(t * 16) * 1.2;
    paperPose.sx = hit ? 1.08 : 1;
    paperPose.sy = hit ? 0.9 : 1;
    spark = hit ? (phase - 0.18) / 0.3 : 0;
  } else if (t < 0.9) {
    hariPose.ox = -2;
    hariPose.rot = lerp(-6, 4, fallU);
    if (fallU < 0.55) {
      const u = fallU / 0.55;
      paperPose.ox = lerp(4, 10, u);
      paperPose.rot = lerp(10, 78, easeOut(u));
      paperPose.hop = -Math.sin(u * Math.PI) * 12;
      paperPose.sx = lerp(1, 1.15, u);
      paperPose.sy = lerp(1, 0.82, u);
    } else {
      paperImg = sprites?.paperDown ?? paperImg;
      paperH = 22;
      const u = (fallU - 0.55) / 0.45;
      paperPose.ox = 8;
      paperPose.rot = lerp(20, 0, u);
      paperPose.hop = -Math.abs(Math.sin(u * Math.PI)) * 5;
    }
  } else {
    const thumbs = [sprites?.hariThumb1, sprites?.hariThumb2, sprites?.hariThumb3];
    const thumbIdx = winU < 0.28 ? 0 : winU < 0.55 ? 1 : 2;
    hariImg = thumbs[thumbIdx] ?? sprites?.hariWin ?? hariImg;
    paperImg = sprites?.paperDown ?? paperImg;
    paperH = 22;
    hariPose.hop = winU < 0.62 ? -Math.sin(clamp01(winU / 0.5) * Math.PI) * 5 : 0;
    hariPose.rot = 0;
    hariPose.sx = 1;
    hariPose.sy = 1;
    paperPose.ox = 8;
    paperPose.hop = 0;
    paperPose.rot = 0;
  }

  drawBar(ctx, barX, barY, segs, t);
  if (dustHari) drawDust(ctx, hariX, feetY, dustHariFrame);
  if (dustPaper) drawDust(ctx, paperX, feetY, dustPaperFrame);

  if (sprites && hariImg && paperImg) {
    shadow(ctx, hariX + (hariPose.ox ?? 0), feetY, 16, hariPose.hop ?? 0);
    shadow(ctx, paperX + (paperPose.ox ?? 0), feetY, paperH === 22 ? 22 : 18, paperPose.hop ?? 0);
    blitPose(ctx, hariImg, hariX, feetY, 40, hariPose);
    blitPose(ctx, paperImg, paperX, feetY, paperH, paperPose);
    if (bolt && t >= 0.3 && t < 0.78) {
      drawBolt(ctx, hariX + 18, feetY - 22 + (hariPose.hop ?? 0), paperX - 14, feetY - 20 + (paperPose.hop ?? 0), bolt.u);
    }
    drawMuzzle(ctx, hariX + 16 + (hariPose.ox ?? 0), feetY - 24 + (hariPose.hop ?? 0), muzzle);
    drawHitSpark(ctx, paperX + 2, feetY - 22, spark);
    if (t >= 0.78 && t < 0.92) {
      drawBurst(ctx, paperX + 4, feetY - 10, clamp01((t - 0.78) / 0.14), 8, ["#ffe46a", "#ff6a3a", "#fff"]);
    }
    if (t >= 0.9 && t < 0.98) {
      drawBurst(ctx, hariX, feetY - 28, clamp01((t - 0.9) / 0.08), 7, ["#3f9b46", "#ffe46a", "#fff"]);
    }
  }

  ctx.restore();
  ctx.imageSmoothingEnabled = false;
  ctx.font = '10px "Press Start 2P", monospace';
  const done = t >= 0.94;
  ctx.fillStyle = done ? "#2d8a38" : rgbCss(barFillRgb(t));
  const label = done ? "SUCCESS" : "LOADDING";
  const pct = `${Math.round(t * 100)}%`;
  ctx.fillText(label, barX, barY + 26);
  ctx.fillText(pct, barX + barW - ctx.measureText(pct).width, barY + 26);
}
