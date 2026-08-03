/**
 * Download public-domain Noun Project SVGs (free API can only edit/download PD icons).
 * Keys via env — never commit them.
 *
 *   $env:NOUN_KEY="..."; $env:NOUN_SECRET="..."; node scripts/fetch-noun-icons-by-id.mjs
 */

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import OAuth from "oauth-1.0a";

const KEY = process.env.NOUN_KEY;
const SECRET = process.env.NOUN_SECRET;
if (!KEY || !SECRET) {
  console.error("set NOUN_KEY and NOUN_SECRET");
  process.exit(1);
}

const oauth = new OAuth({
  consumer: { key: KEY, secret: SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base, key) {
    return crypto.createHmac("sha1", key).update(base).digest("base64");
  },
});

const OUT = path.resolve("public/icons/noun");
await fs.mkdir(OUT, { recursive: true });

async function nounGet(url) {
  const headers = oauth.toHeader(oauth.authorize({ url, method: "GET" }));
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function toCurrentColor(svg) {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"')
    .replace(/fill:\s*#[0-9a-fA-F]{3,8}/g, "fill:currentColor")
    .replace(/stroke:\s*#[0-9a-fA-F]{3,8}/g, "stroke:currentColor")
    .replace(/<svg\b/, '<svg aria-hidden="true"');
}

async function searchPublic(query) {
  const url =
    `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(query)}` +
    `&limit=12&limit_to_public_domain=1&styles=solid,line`;
  const data = await nounGet(url);
  return data.icons || [];
}

async function downloadSvg(id, slug, color = "000000") {
  const data = await nounGet(
    `https://api.thenounproject.com/v2/icon/${id}/download?filetype=svg&color=${color}`,
  );
  const b64 = data.base64_encoded_file;
  if (!b64) throw new Error(`no file for #${id}`);
  const raw = Buffer.from(b64, "base64").toString("utf8");
  if (!raw.includes("<svg")) throw new Error(`not svg for #${id}`);
  const svg = toCurrentColor(raw);
  await fs.writeFile(path.join(OUT, `${slug}.svg`), svg, "utf8");
  return svg;
}

const QUERIES = [
  { slug: "star", q: "star" },
  { slug: "trophy", q: "trophy" },
  { slug: "branch", q: "git branch" },
  { slug: "shield", q: "shield check" },
  { slug: "code", q: "code brackets" },
  { slug: "rocket", q: "rocket" },
  { slug: "flame", q: "flame" },
  { slug: "medal", q: "medal" },
  { slug: "check", q: "checkmark" },
  { slug: "verified", q: "verified" },
  { slug: "calendar", q: "calendar" },
  { slug: "users", q: "users" },
  { slug: "bolt", q: "lightning" },
  { slug: "token", q: "coin" },
  { slug: "hackathon", q: "laptop" },
  { slug: "opensource", q: "open source" },
];

// wipe old broken png-as-svg files
for (const f of await fs.readdir(OUT)) {
  if (f.endsWith(".svg") || f.endsWith(".json") || f === "_index.json") {
    await fs.unlink(path.join(OUT, f));
  }
}

const index = [];
for (const item of QUERIES) {
  try {
    const hits = await searchPublic(item.q);
    if (!hits.length) {
      console.warn(`miss ${item.slug} — no public-domain hits for "${item.q}"`);
      continue;
    }
    // prefer shorter term / solid style
    const picked =
      hits.find((h) => (h.styles || []).some?.((s) => s.style === "solid" || s === "solid")) ||
      hits[0];
    await downloadSvg(picked.id, item.slug);
    const meta = {
      slug: item.slug,
      id: picked.id,
      term: picked.term,
      attribution: picked.attribution,
      license: picked.license_description,
      creator: picked.creator?.name || picked.uploader?.name,
    };
    await fs.writeFile(path.join(OUT, `${item.slug}.json`), JSON.stringify(meta, null, 2));
    index.push(meta);
    console.log(`ok  ${item.slug}  ← #${picked.id}  ${picked.term}`);
  } catch (err) {
    console.error(`fail ${item.slug}:`, err.message);
  }
}

await fs.writeFile(path.join(OUT, "_index.json"), JSON.stringify(index, null, 2));
await fs.writeFile(
  path.join(OUT, "ATTRIBUTION.txt"),
  [
    "Icons from The Noun Project (public domain via API).",
    "Downloaded for use in this portfolio. Sources:",
    ...index.map((m) => `- ${m.slug}: #${m.id} ${m.term} — ${m.attribution || "public domain"}`),
    "",
  ].join("\n"),
);

console.log(`\ndone — ${index.length} public-domain SVGs in ${OUT}`);
