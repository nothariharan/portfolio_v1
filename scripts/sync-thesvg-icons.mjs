/**
 * Sync /public/logos from thesvg.org (multi-color brand SVGs).
 * Keeps the existing file when a slug is missing or the download fails.
 *
 * Run: node scripts/sync-thesvg-icons.mjs
 *
 * CDN: https://thesvg.org/icons/{slug}/{variant}.svg
 * Manifest: https://thesvg.org/api/registry.json
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "logos");
const REGISTRY_URL = "https://thesvg.org/api/registry.json";
const CDN = "https://thesvg.org/icons";

/**
 * Portfolio logo key → thesvg.org slug.
 * Only keys listed here are candidates for replacement.
 */
const SLUGS = {
  anthropic: "anthropic",
  aws: "aws",
  bash: "bash",
  claude: "claude",
  copilot: "github-copilot",
  cpp: "cplusplus",
  csharp: "csharp",
  css3: "css3",
  cursor: "cursor",
  dart: "dart",
  deepgram: "deepgram",
  deepseek: "deepseek",
  digitalocean: "digitalocean",
  docker: "docker",
  electron: "electron",
  elevenlabs: "elevenlabs",
  express: "express",
  fastapi: "fastapi",
  ffmpeg: "ffmpeg",
  firebase: "firebase",
  flutter: "flutter",
  gcp: "googlecloud",
  gemini: "gemini",
  git: "git",
  github: "github",
  githubactions: "github-actions",
  google: "google",
  googlescholar: "google-scholar",
  // Portfolio "Hermes" = NousResearch Hermes Agent (not Facebook Hermes JS)
  hermes: "nousresearch-hermes",
  html5: "html5",
  huggingface: "hugging-face",
  javascript: "javascript",
  kimi: "kimi",
  kubernetes: "kubernetes",
  langgraph: "langgraph",
  leetcode: "leetcode",
  linux: "linux",
  mongodb: "mongodb",
  nextjs: "nextjs",
  nginx: "nginx",
  nodejs: "nodejs",
  numpy: "numpy",
  openai: "openai",
  opencode: "opencode",
  opencv: "opencv",
  openrouter: "openrouter",
  pandas: "pandas",
  perplexity: "perplexity",
  postgresql: "postgresql",
  python: "python",
  pytorch: "pytorch",
  react: "react",
  redis: "redis",
  rust: "rust",
  sap: "sap",
  socketio: "socketdotio",
  streamlit: "streamlit",
  supabase: "supabase",
  tailwindcss: "tailwindcss",
  twilio: "twilio",
  typescript: "typescript",
  unity: "unity",
  vercel: "vercel",
  vite: "vite",
  wxt: "wxt",
  ycombinator: "y-combinator",
};

/**
 * Default/color variants that are white (or near-white) disappear on our
 * cream/white logo tiles. Prefer a dark-on-light variant for those brands.
 * thesvg "light" = dark fill for light UIs; "mono" = currentColor silhouette.
 */
const VARIANT_OVERRIDE = {
  anthropic: "light",
  bash: "light",
  copilot: "mono",
  cursor: "mono",
  elevenlabs: "mono",
  unity: "light",
  vercel: "light",
};

function isSvg(text) {
  const t = text.trimStart();
  return t.startsWith("<svg") || t.startsWith("<?xml");
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { Accept: "image/svg+xml,application/xml,text/plain,*/*" },
  });
  if (!res.ok) return null;
  const text = await res.text();
  return isSvg(text) ? text : null;
}

/** Make silhouettes readable as <img> on light tiles (and invertible on black). */
function tileSafeSvg(svg, { forceDarkWhite = false } = {}) {
  let out = svg;
  // currentColor in external <img> is unreliable — pin a near-black fill.
  out = out.replaceAll('fill="currentColor"', 'fill="#111111"');
  out = out.replaceAll("fill='currentColor'", "fill='#111111'");
  out = out.replaceAll("fill:currentColor", "fill:#111111");
  // Only for known white silhouettes — never touch multi-color icons
  // (Next.js masks / Kubernetes accents use intentional white).
  if (forceDarkWhite) {
    out = out.replaceAll('fill="#fff"', 'fill="#111111"');
    out = out.replaceAll('fill="#FFF"', 'fill="#111111"');
    out = out.replaceAll('fill="#ffffff"', 'fill="#111111"');
    out = out.replaceAll('fill="#FFFFFF"', 'fill="#111111"');
    out = out.replaceAll('fill="#ffff"', 'fill="#111111"');
    out = out.replaceAll('fill="white"', 'fill="#111111"');
  }
  return out;
}

/** Prefer override → multi-color `color` → `default`. */
async function fetchIcon(slug, variants, override) {
  const order = [];
  if (override) order.push(override);
  if (variants?.includes("color") && override !== "color") order.push("color");
  if (!order.includes("default")) order.push("default");
  for (const v of order) {
    const svg = await fetchText(`${CDN}/${slug}/${v}.svg`);
    if (svg) {
      return {
        svg: tileSafeSvg(svg, { forceDarkWhite: Boolean(override) }),
        variant: v,
      };
    }
  }
  return null;
}

mkdirSync(OUT, { recursive: true });

console.log("fetching thesvg.org registry…");
const registry = await fetch(REGISTRY_URL).then((r) => r.json());
const bySlug = Object.fromEntries(registry.icons.map((i) => [i.slug, i]));

let replaced = 0;
let kept = 0;
let missing = 0;

for (const [key, slug] of Object.entries(SLUGS)) {
  const meta = bySlug[slug];
  const dest = join(OUT, `${key}.svg`);

  if (!meta) {
    console.warn(`MISS  ${key} → ${slug} (not in registry) — keep existing`);
    missing++;
    kept++;
    continue;
  }

  try {
    const hit = await fetchIcon(slug, meta.variants, VARIANT_OVERRIDE[key]);
    if (!hit) {
      console.warn(`FAIL  ${key} → ${slug} (no valid svg) — keep existing`);
      kept++;
      continue;
    }
    // Normalize to a single trailing newline; don't rewrite fill colors.
    const out = hit.svg.trimEnd() + "\n";
    const prev = existsSync(dest) ? readFileSync(dest, "utf8") : null;
    if (prev === out) {
      console.log(`same  ${key} ← ${slug}/${hit.variant}`);
      kept++;
      continue;
    }
    writeFileSync(dest, out);
    console.log(`OK    ${key} ← ${slug}/${hit.variant} (${out.length} bytes)`);
    replaced++;
  } catch (err) {
    console.warn(`ERR   ${key} → ${slug}: ${err.message} — keep existing`);
    kept++;
  }
}

console.log(
  `\ndone: replaced ${replaced}, unchanged/kept ${kept}, missing ${missing} → ${OUT}`,
);
