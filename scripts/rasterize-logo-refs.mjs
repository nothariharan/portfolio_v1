import * as icons from "simple-icons";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const out = "public/honors/_logo-refs";
fs.mkdirSync(out, { recursive: true });

const fromFiles = ["claude", "cursor", "openai", "opencode", "deepseek"];
for (const name of fromFiles) {
  const svgPath = path.join("public/logos", `${name}.svg`);
  await sharp(svgPath)
    .resize(220, 220, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(path.join(out, `${name}.png`));
  console.log("ok", name);
}

const hermes = Object.values(icons).find((i) => i && i.slug === "hermes");
if (!hermes) throw new Error("hermes icon missing");
const hermesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#${hermes.hex}" d="${hermes.path}"/></svg>`;
fs.writeFileSync(path.join(out, "hermes.svg"), hermesSvg);
await sharp(Buffer.from(hermesSvg))
  .resize(220, 220, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  })
  .png()
  .toFile(path.join(out, "hermes.png"));
console.log("ok hermes", hermes.title, hermes.hex);

fs.copyFileSync(path.join(out, "openai.png"), path.join(out, "chatgpt.png"));
fs.copyFileSync(path.join(out, "openai.png"), path.join(out, "codex.png"));
console.log("refs", fs.readdirSync(out));
