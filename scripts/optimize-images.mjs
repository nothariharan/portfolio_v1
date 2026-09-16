// Convert referenced PNGs → WebP (lossy q88). Source PNGs are kept on disk as
// regenerable source art; code points at the .webp sidecar instead.
// Run from repo root:  node scripts/optimize-images.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const PUBLIC = "public";

// every image referenced from src/, with an optional resize target for sprites
// rendered much smaller than their source (nearest kernel keeps pixel art crisp).
const JOBS = [
  // card front (landing LCP)
  "harifinal.png",
  "sprites/front_bg.png",
  "sprites/focus_ai.png",
  "sprites/focus_web.png",
  "sprites/focus_devops.png",
  "sprites/focus_explore.png",

  // card back — project thumbs + honor tiles/cards
  "sprites/proj_mugen.png",
  "sprites/proj_visor.png",
  "sprites/proj_gurren.png",
  "sprites/proj_monkeyspeak.png",
  "sprites/proj_cofound.png",
  "sprites/proj_vahanlive.png",
  "sprites/proj_yui.png",
  "sprites/proj_scout.png",
  "sprites/proj_slopmark.png",
  "sprites/proj_certamen.png",
  "sprites/proj_continuum.png",
  "sprites/proj_phyla.png",
  "sprites/proj_raksha.png",
  "honors/hacktoberfest-tile.png",
  "honors/yc-tile.png",
  "honors/hackathon-tile.png",
  "honors/tokens-tile.png",
  "honors/hacktoberfest-card.png",
  "honors/yc-garage-card.png",
  "honors/hackathon-arena-card.png",
  "honors/tokens-furnace-card.png",

  // portfolio pages — nav panels + hero + avatar
  "sprites/panel_projects.png",
  "sprites/panel_experience.png",
  "sprites/panel_honors.png",
  "sprites/panel_skills.png",
  "sprites/sit-norm/s1.png",
  "sprites/sit-norm/s2.png",
  "sprites/sit-norm/s3.png",
  "sprites/sit-norm/s4.png",
  "sprites/sit-norm/s5.png",
  "sprites/hari_stand.png",

  // project / win screenshots
  "shots/crux.png",
  "shots/scout.png",
  "shots/slopmark.png",
  "shots/certamen.png",
  "shots/cofound.png",
  "shots/justask.png",
  "shots/yui.png",
  "shots/monkeyspeak.png",
  "shots/mugen.png",
  "shots/vahanlive.png",
  "shots/bharat-seva.png",
];

// sprites shown tiny — resize the source down before encoding
const RESIZE = {
  "sprites/focus_ai.png": 512,
  "sprites/focus_web.png": 512,
  "sprites/focus_devops.png": 512,
  "sprites/focus_explore.png": 512,
  "sprites/proj_mugen.png": 256,
  "sprites/proj_visor.png": 256,
  "sprites/proj_gurren.png": 256,
  "sprites/proj_monkeyspeak.png": 256,
  "sprites/proj_cofound.png": 256,
  "sprites/proj_vahanlive.png": 256,
  "sprites/proj_yui.png": 256,
  "sprites/proj_scout.png": 256,
  "sprites/proj_slopmark.png": 256,
  "sprites/proj_certamen.png": 256,
  "sprites/proj_continuum.png": 256,
  "sprites/proj_phyla.png": 256,
  "sprites/proj_raksha.png": 256,
  "sprites/panel_projects.png": 480,
  "sprites/panel_experience.png": 480,
  "sprites/panel_honors.png": 480,
  "sprites/panel_skills.png": 480,
  "sprites/hari_stand.png": 280,
};

async function main() {
  const start = Date.now();
  let totalBefore = 0;
  let totalAfter = 0;
  let done = 0;

  for (const rel of JOBS) {
    const src = path.join(PUBLIC, rel);
    const out = path.join(PUBLIC, rel.replace(/\.png$/i, ".webp"));
    if (!existsSync(src)) {
      console.warn(`skip (missing): ${rel}`);
      continue;
    }
    const before = (await readFile(src)).length;

    let pipeline = sharp(src);
    const targetW = RESIZE[rel];
    if (targetW) {
      pipeline = pipeline.resize({ width: targetW, kernel: "nearest" });
    }
    const buf = await pipeline
      .webp({ quality: 88, effort: 6 })
      .toBuffer();

    await sharp(buf).toFile(out);
    const after = buf.length;
    totalBefore += before;
    totalAfter += after;
    done++;
    console.log(
      `${rel}\n  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB` +
        `  (${Math.round((1 - after / before) * 100)}% smaller)`
    );
  }

  console.log(`\n${done} images · ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
