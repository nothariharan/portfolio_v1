import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";

const ref =
  "C:/Users/HARIHARAN/.cursor/projects/c-Users-HARIHARAN-Desktop-Portfolio/assets/c__Users_HARIHARAN_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-d5edf3de-4f34-4d1a-91fc-2b5813e03f23.png";
const outDir = path.resolve("public/honors");
await fs.mkdir(outDir, { recursive: true });

const meta = await sharp(ref).metadata();
console.log("ref", meta.width, meta.height);

// crop left mascot square from the mock (art above GOLDEN TIER bar)
const w = meta.width;
const h = meta.height;
const left = Math.round(w * 0.032);
const top = Math.round(h * 0.075);
const size = Math.min(Math.round(h * 0.58), Math.round(w * 0.22));

await sharp(ref)
  .extract({ left, top, width: size, height: size })
  .resize(256, 256, { kernel: sharp.kernel.nearest })
  .png()
  .toFile(path.join(outDir, "hacktoberfest-tile.png"));
console.log("hacktoberfest-tile", { left, top, size });

async function placeholder(name, bg, label, accent) {
  const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
    <rect width="256" height="256" fill="${bg}"/>
    <rect x="24" y="24" width="208" height="208" rx="16" fill="none" stroke="${accent}" stroke-width="6" stroke-dasharray="14 10" opacity="0.9"/>
    <text x="128" y="122" text-anchor="middle" font-family="Verdana, sans-serif" font-size="26" font-weight="700" fill="${accent}">${label}</text>
    <text x="128" y="158" text-anchor="middle" font-family="Verdana, sans-serif" font-size="14" fill="${accent}" opacity="0.7">coming soon</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, name));
  console.log("placeholder", name);
}

await placeholder("yc-tile.png", "#fff0e6", "YC", "#fb651e");
await placeholder("hackathon-tile.png", "#fff8e1", "WINS", "#d99a2c");
await placeholder("tokens-tile.png", "#fdecea", "1B+", "#e23b2e");
