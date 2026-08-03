import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import OAuth from "oauth-1.0a";

const oauth = new OAuth({
  consumer: { key: process.env.NOUN_KEY, secret: process.env.NOUN_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(base, key) {
    return crypto.createHmac("sha1", key).update(base).digest("base64");
  },
});

async function nounGet(url) {
  const headers = oauth.toHeader(oauth.authorize({ url, method: "GET" }));
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

function tint(svg) {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"')
    .replace(/fill:\s*#[0-9a-fA-F]{3,8}/g, "fill:currentColor")
    .replace(/<svg\b/, '<svg aria-hidden="true"');
}

async function save(query, slug, prefer) {
  const url =
    `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(query)}` +
    `&limit=15&limit_to_public_domain=1`;
  const data = await nounGet(url);
  const icons = data.icons || [];
  console.log(
    slug,
    icons
      .slice(0, 8)
      .map((i) => `#${i.id} ${i.term}`)
      .join(" | "),
  );
  const picked =
    icons.find((x) => prefer.test(x.term || "")) || icons[0];
  if (!picked) {
    console.log("no pick", slug);
    return;
  }
  const d = await nounGet(
    `https://api.thenounproject.com/v2/icon/${picked.id}/download?filetype=svg&color=000000`,
  );
  const svg = tint(Buffer.from(d.base64_encoded_file, "base64").toString("utf8"));
  const out = path.resolve("public/icons/noun");
  await fs.writeFile(path.join(out, `${slug}.svg`), svg);
  await fs.writeFile(
    path.join(out, `${slug}.json`),
    JSON.stringify(
      {
        slug,
        id: picked.id,
        term: picked.term,
        attribution: picked.attribution,
        license: picked.license_description,
      },
      null,
      2,
    ),
  );
  console.log("saved", slug, picked.id, picked.term);
}

await save("branch", "branch", /branch|fork|merge|git/i);
await save("code brackets", "code", /code|bracket|program|coding/i);
await save("fire", "flame", /fire|flame/i);
await save("git", "branch", /git|branch|fork/i);
