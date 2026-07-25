/**
 * Sync /public/logos from the official simple-icons package (+ a few
 * older-release fallbacks for brands Simple Icons later removed).
 *
 * Run: node scripts/sync-simple-icons.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as icons from "simple-icons";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "logos");

/** Our tech keys → simple-icons slug (current package). */
const SLUGS = {
  bash: "gnubash",
  claude: "claude",
  copilot: "githubcopilot",
  cpp: "cplusplus",
  css3: "css",
  cursor: "cursor",
  dart: "dart",
  docker: "docker",
  electron: "electron",
  express: "express",
  fastapi: "fastapi",
  firebase: "firebase",
  gcp: "googlecloud",
  gemini: "googlegemini",
  git: "git",
  github: "github",
  githubactions: "githubactions",
  html5: "html5",
  huggingface: "huggingface",
  javascript: "javascript",
  kimi: "kimi",
  kubernetes: "kubernetes",
  linux: "linux",
  mongodb: "mongodb",
  nextjs: "nextdotjs",
  nginx: "nginx",
  nodejs: "nodedotjs",
  numpy: "numpy",
  opencode: "opencode",
  opencv: "opencv",
  pandas: "pandas",
  postgresql: "postgresql",
  python: "python",
  pytorch: "pytorch",
  react: "react",
  redis: "redis",
  rust: "rust",
  supabase: "supabase",
  tailwindcss: "tailwindcss",
  typescript: "typescript",
  vercel: "vercel",
  elevenlabs: "elevenlabs",
  openrouter: "openrouter",
  flutter: "flutter",
  unity: "unity",
  socketio: "socketdotio",
  ffmpeg: "ffmpeg",
  streamlit: "streamlit",
  deepgram: "deepgram",
  vite: "vite",
  langgraph: "langgraph",
  wxt: "wxt",
  anthropic: "anthropic",
  sap: "sap",
  ycombinator: "ycombinator",
  googlescholar: "googlescholar",
  leetcode: "leetcode",
  digitalocean: "digitalocean",
  google: "google",
};

/** Brands removed from modern simple-icons — fetch from an older release. */
const LEGACY = {
  aws: { slug: "amazonaws", hex: "232F3E" },
  openai: { slug: "openai", hex: "412991" },
  twilio: { slug: "twilio", hex: "F22F46" },
  csharp: { slug: "csharp", hex: "512BD4" },
};

const bySlug = Object.fromEntries(
  Object.values(icons)
    .filter((i) => i && typeof i === "object" && "slug" in i)
    .map((i) => [i.slug, i]),
);

/** Near-white brand colors disappear on our light logo tiles — darken them. */
function tileSafeHex(hex) {
  const h = hex.replace("#", "").toUpperCase();
  if (h.length !== 6) return h;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.9 ? "111111" : h;
}

function coloredSvg(title, path, hex) {
  const fill = tileSafeHex(hex);
  return `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>${escapeXml(title)}</title><path fill="#${fill}" d="${path}"/></svg>\n`;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function fetchLegacy(slug) {
  const url = `https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${slug}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${slug}: ${res.status}`);
  return res.text();
}

function extractPath(svg) {
  const m = svg.match(/\sd="([^"]+)"/);
  if (!m) throw new Error("no path");
  return m[1];
}

mkdirSync(OUT, { recursive: true });

let ok = 0;
for (const [key, slug] of Object.entries(SLUGS)) {
  const icon = bySlug[slug];
  if (!icon) {
    console.error("missing", key, slug);
    continue;
  }
  writeFileSync(join(OUT, `${key}.svg`), coloredSvg(icon.title, icon.path, icon.hex));
  ok++;
}

for (const [key, meta] of Object.entries(LEGACY)) {
  const raw = await fetchLegacy(meta.slug);
  const path = extractPath(raw);
  writeFileSync(join(OUT, `${key}.svg`), coloredSvg(key, path, meta.hex));
  ok++;
  console.log("legacy", key);
}

console.log(`synced ${ok} icons → public/logos`);
