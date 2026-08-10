import fs from "node:fs";
import path from "node:path";

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function collectCode() {
  const roots = ["src", "scripts", "content"];
  let blob = "";
  for (const root of roots) {
    for (const f of walk(root)) {
      if (!/\.(tsx?|jsx?|mjs|css|md|json)$/i.test(f)) continue;
      blob += fs.readFileSync(f, "utf8") + "\n";
    }
  }
  return blob;
}

const blob = collectCode();
const files = walk("public").filter((f) =>
  /\.(png|webp|avif|jpe?g|gif|svg)$/i.test(f),
);

const unused = [];
for (const f of files) {
  const rel = f.split(path.sep).join("/").replace(/^public\//, "");
  const base = path.basename(f);
  const stem = base.replace(/\.(png|webp|avif|jpe?g|gif|svg)$/i, "");
  const parent = path.posix.dirname(rel);

  let hit =
    blob.includes(`/${rel}`) ||
    blob.includes(`"${rel}"`) ||
    blob.includes(`'${rel}'`) ||
    blob.includes(stem) ||
    blob.includes(base);

  // dynamic project thumbs: /sprites/proj_${icon}
  if (!hit && parent === "sprites" && stem.startsWith("proj_")) {
    const key = stem.slice(5);
    hit =
      blob.includes("/sprites/proj_") &&
      (blob.includes(`"${key}"`) || blob.includes(`'${key}'`) || blob.includes(`icon: "${key}"`) || blob.includes(`icon: '${key}'`));
  }

  // sit-norm frames
  if (!hit && rel.includes("sit-norm/")) hit = blob.includes("sit-norm");

  // honor picture base without extension
  if (!hit && parent === "honors") {
    const baseNoExt = `/honors/${stem.replace(/\.(png|webp|avif)$/i, "")}`;
    hit =
      blob.includes(`/honors/${stem}`) ||
      blob.includes(stem) ||
      blob.includes("/honors/1b-tokens");
  }

  // shots
  if (!hit && parent === "shots") hit = blob.includes(`/shots/${stem}`);

  // logos / icons often referenced by key only
  if (!hit && (parent === "logos" || parent.startsWith("icons"))) {
    hit = blob.includes(`/logos/${stem}`) || blob.includes(`/icons/`) || blob.includes(`"${stem}"`);
  }

  if (!hit) unused.push({ rel, kb: Math.round(fs.statSync(f).size / 1024) });
}

unused.sort((a, b) => b.kb - a.kb);
console.log(`unused ${unused.length}`);
for (const u of unused) console.log(`${u.kb}\t${u.rel}`);
console.log(`total_mb ${(unused.reduce((s, u) => s + u.kb, 0) / 1024).toFixed(1)}`);
