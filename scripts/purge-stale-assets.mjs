import fs from "node:fs";
import path from "node:path";

/** Delete known-stale / unreferenced art that is not part of the live WebP pipeline. */
const targets = [
  // old honor experiments
  "public/honors/hackathon-arena-diorama.png",
  "public/honors/hacktoberfest-diorama.png",
  "public/honors/yc-garage-diorama.png",
  "public/honors/tokens-furnace-diorama.png",
  "public/honors/tokens-blast.png",
  "public/honors/tokens-blast-compact.png",
  "public/honors/tokens-furnace.png",
  "public/honors/tokens-hero.png",
  "public/honors/slot-hackathon.png",
  "public/honors/slot-hacktoberfest.png",
  "public/honors/slot-tokens.png",
  "public/honors/slot-yc.png",
  "public/honors/honor-card-hacktoberfest.png",
  "public/honors/honor-card-yc.png",
  "public/honors/1b-tokens-card.png", // full-res master not referenced; delivery is 1b-tokens.{avif,webp,png}

  // unused folders
  "public/honors/_logo-refs",
  "public/honors/tools",
  "public/honors/agents",
  "public/sprites/sitting",
  "public/sprites/standing",
  "public/sprites/stand-norm",
  "public/harisit",
  "public/haristand",

  // old section / art / icon sprites
  "public/sprites/section_achievements.png",
  "public/sprites/section_skills.png",
  "public/sprites/section_experience.png",
  "public/sprites/section_projects.png",
  "public/sprites/art_experience.png",
  "public/sprites/art_projects.png",
  "public/sprites/art_achievements.png",
  "public/sprites/icon_react.png",
  "public/sprites/icon_brain.png",
  "public/sprites/icon_trophy.png",
  "public/sprites/icon_code.png",
  "public/sprites/icon_startup.png",
  "public/sprites/icon_medal.png",
  "public/sprites/hari1.png",
  "public/sprites/hari_sit.png",
  "public/sprites/trainer_grin.png",

  // root leftover hari sprites
  "public/hari1.png",
  "public/hari2sprite.png",
  "public/harisit1.png",
  "public/hario1.png",
  "public/harisprite.png",
];

function rm(p) {
  if (!fs.existsSync(p)) return { p, ok: false };
  const st = fs.statSync(p);
  const kb = st.isDirectory()
    ? Math.round(
        walkSize(p) / 1024,
      )
    : Math.round(st.size / 1024);
  fs.rmSync(p, { recursive: true, force: true });
  return { p, ok: true, kb };
}

function walkSize(dir) {
  let n = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const q = path.join(dir, e.name);
    n += e.isDirectory() ? walkSize(q) : fs.statSync(q).size;
  }
  return n;
}

let freed = 0;
let n = 0;
for (const t of targets) {
  const r = rm(t);
  if (r.ok) {
    n++;
    freed += r.kb || 0;
    console.log(`deleted ${r.kb}KB  ${t}`);
  }
}
console.log(`\nremoved ${n} paths · ~${(freed / 1024).toFixed(1)}MB`);
