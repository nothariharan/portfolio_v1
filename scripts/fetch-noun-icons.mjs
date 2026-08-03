/**
 * one-shot: pull pixel-ish icons from Noun Project v2 into public/icons/noun
 * keys via env — never commit them
 *
 *   $env:NOUN_KEY="..."; $env:NOUN_SECRET="..."; node scripts/fetch-noun-icons.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import OAuth from "oauth-1.0a";

const KEY = process.env.NOUN_KEY;
const SECRET = process.env.NOUN_SECRET;
if (!KEY || !SECRET) {
  console.error("set NOUN_KEY and NOUN_SECRET first");
  process.exit(1);
}

const OUT = path.resolve("public/icons/noun");
await fs.mkdir(OUT, { recursive: true });

const oauth = new OAuth({
  consumer: { key: KEY, secret: SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base, key) {
    return crypto.createHmac("sha1", key).update(base).digest("base64");
  },
});

async function nounGet(url) {
  const req = { url, method: "GET" };
  const headers = oauth.toHeader(oauth.authorize(req));
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url}\n${text.slice(0, 400)}`);
  return JSON.parse(text);
}

/** pick a clean solid/line icon from search hits */
function pickIcon(icons, prefer = []) {
  if (!icons?.length) return null;
  const scored = icons.map((ic) => {
    let s = 0;
    const t = `${ic.term || ""} ${(ic.tags || []).join(" ")}`.toLowerCase();
    if (prefer.some((p) => t.includes(p))) s += 5;
    if (ic.icon_url || ic.thumbnail_url) s += 1;
    if (ic.style === "solid" || ic.styles?.includes?.("solid")) s += 2;
    if (t.includes("pixel") || t.includes("8-bit") || t.includes("8bit")) s += 4;
    return { ic, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored[0]?.ic ?? null;
}

async function downloadSvg(icon, slug) {
  // v2 often returns permalink_id + thumbnail_url; svg via icon endpoint
  const id = icon.id || icon.icon_id;
  const detail = await nounGet(`https://api.thenounproject.com/v2/icon/${id}?filetype=svg`);
  const ic = detail.icon || detail;
  const svgUrl = ic.icon_url || ic.thumbnail_url || ic.preview_url;
  if (!svgUrl) throw new Error(`no svg url for ${slug} id=${id}`);

  const svgRes = await fetch(svgUrl);
  if (!svgRes.ok) throw new Error(`svg fetch failed ${slug}: ${svgRes.status}`);
  let svg = await svgRes.text();

  // force currentColor so we can tint in CSS
  svg = svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"')
    .replace(/<svg\b/, '<svg aria-hidden="true"');

  const file = path.join(OUT, `${slug}.svg`);
  await fs.writeFile(file, svg, "utf8");

  const meta = {
    slug,
    id,
    term: ic.term || icon.term,
    attribution: ic.attribution || icon.attribution,
    license: ic.license_description || ic.license || icon.license_description,
    creator: ic.uploader?.name || ic.creator?.name || icon.uploader?.name,
  };
  await fs.writeFile(path.join(OUT, `${slug}.json`), JSON.stringify(meta, null, 2));
  console.log(`ok  ${slug}  ← #${id}  ${meta.term || ""}`);
  return meta;
}

const QUERIES = [
  { slug: "star", q: "pixel star", prefer: ["star", "pixel"] },
  { slug: "trophy", q: "pixel trophy", prefer: ["trophy", "pixel"] },
  { slug: "branch", q: "git branch", prefer: ["branch", "git"] },
  { slug: "shield", q: "shield check", prefer: ["shield", "check", "verified"] },
  { slug: "code", q: "pixel code", prefer: ["code", "pixel", "brackets"] },
  { slug: "rocket", q: "pixel rocket", prefer: ["rocket", "pixel"] },
  { slug: "flame", q: "pixel fire", prefer: ["fire", "flame", "pixel"] },
  { slug: "medal", q: "pixel medal", prefer: ["medal", "pixel"] },
  { slug: "bolt", q: "pixel lightning", prefer: ["lightning", "bolt", "pixel"] },
  { slug: "calendar", q: "pixel calendar", prefer: ["calendar", "pixel"] },
  { slug: "users", q: "pixel users", prefer: ["users", "people", "pixel"] },
  { slug: "check", q: "pixel checkmark", prefer: ["check", "pixel"] },
];

const index = [];
for (const item of QUERIES) {
  try {
    const url =
      `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(item.q)}` +
      `&limit=20&styles=solid,line&thumbnail_format=svg`;
    const data = await nounGet(url);
    const icons = data.icons || data.icon || [];
    const list = Array.isArray(icons) ? icons : [icons];
    const picked = pickIcon(list, item.prefer);
    if (!picked) {
      console.warn(`miss ${item.slug} — no hits for "${item.q}"`);
      continue;
    }
    index.push(await downloadSvg(picked, item.slug));
  } catch (err) {
    console.error(`fail ${item.slug}:`, err.message);
  }
}

await fs.writeFile(path.join(OUT, "_index.json"), JSON.stringify(index, null, 2));
console.log(`\ndone — ${index.length} icons in ${OUT}`);
