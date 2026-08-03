/**
 * Grab pixel-style Noun icons as PNG thumbnails (free API cant download CC as SVG).
 * We tint them at runtime with CSS mask. Keys via env.
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
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

async function savePng(id, slug) {
  const detail = await nounGet(`https://api.thenounproject.com/v2/icon/${id}`);
  const ic = detail.icon || detail;
  // prefer largest thumbnail if listed; else 200px
  const url =
    ic.thumbnail_url?.replace("-200.png", "-600.png") ||
    ic.thumbnail_url ||
    `https://static.thenounproject.com/png/${id}-200.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`png ${slug} ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(path.join(OUT, `${slug}.png`), buf);
  await fs.writeFile(
    path.join(OUT, `${slug}.pixel.json`),
    JSON.stringify(
      {
        slug,
        id,
        term: ic.term,
        attribution: ic.attribution,
        license: ic.license_description,
        format: "png-mask",
      },
      null,
      2,
    ),
  );
  console.log(`ok  ${slug}.png  ← #${id}  ${ic.term}`);
}

/** known pixel / 8-bit ids + search fallbacks */
const PICKS = [
  // tulpahn 8 Bit Game Solid — these are the ones that match the mock
  { slug: "star", id: 2651785 },
  { slug: "trophy", id: 2651783 },
  { slug: "code", query: "pixel code", prefer: /pixel|8.?bit|code/i },
  { slug: "branch", query: "git branch", prefer: /git|branch|merge/i },
  { slug: "shield", query: "pixel shield", prefer: /shield|pixel|8.?bit/i },
  { slug: "check", query: "pixel check", prefer: /check|pixel|8.?bit/i },
  { slug: "medal", query: "pixel medal", prefer: /medal|pixel|8.?bit/i },
  { slug: "bolt", query: "pixel lightning", prefer: /lightning|bolt|pixel|8.?bit/i },
  { slug: "rocket", query: "pixel rocket", prefer: /rocket|pixel|8.?bit/i },
  { slug: "flame", query: "pixel fire", prefer: /fire|flame|pixel|8.?bit/i },
  { slug: "calendar", query: "pixel calendar", prefer: /calendar|pixel|8.?bit/i },
  { slug: "users", query: "pixel user", prefer: /user|pixel|8.?bit/i },
  { slug: "token", query: "pixel coin", prefer: /coin|token|pixel|8.?bit/i },
];

for (const item of PICKS) {
  try {
    if (item.id) {
      await savePng(item.id, item.slug);
      continue;
    }
    const data = await nounGet(
      `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(item.query)}&limit=20&styles=solid`,
    );
    const icons = data.icons || [];
    const scored = icons
      .map((ic) => {
        const t = `${ic.term} ${(ic.tags || []).join(" ")}`.toLowerCase();
        let s = 0;
        if (/pixel|8-bit|8bit|retro|game/.test(t)) s += 6;
        if (item.prefer?.test(t)) s += 3;
        return { ic, s };
      })
      .sort((a, b) => b.s - a.s);
    const picked = scored[0]?.ic;
    if (!picked) {
      console.warn("miss", item.slug);
      continue;
    }
    console.log(
      `pick ${item.slug}:`,
      scored
        .slice(0, 4)
        .map((x) => `#${x.ic.id} ${x.ic.term} (${x.s})`)
        .join(" | "),
    );
    await savePng(picked.id, item.slug);
  } catch (err) {
    console.error("fail", item.slug, err.message);
  }
}
