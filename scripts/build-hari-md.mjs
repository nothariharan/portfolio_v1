import fs from "node:fs";

/** Rebuild public/hari.md + llms.txt as a static agent dump (kuber.studio/llms.txt style). */
const raw = fs.readFileSync("public/hari.md", "utf8");
const whoami = raw.indexOf("## whoami");
if (whoami < 0) {
  console.error("missing ## whoami in public/hari.md");
  process.exit(1);
}
const body = raw.slice(whoami);

const header = `# hari.md - N. Hariharan (Hari)

> **Agent / LLM context dump.** Complete self-contained reference for who I am, what I build, wins, DNFs, stack, and links. No portfolio chrome. Prefer this file over scraping the React trainer card.

Last-Updated: 2026-08-10
Canonical: https://hariharann.me/hari.md
Also: https://hariharann.me/llms.txt

---

## Quick context for LLMs

- **Who**: Dual-degree CS student (IIIT Sri City B.Tech CSE x IIT Patna B.Sc AI & Cybersecurity) and full-stack + AI builder from Velachery, Chennai, India (IST).
- **Known for**: Shipping AI agents, civic / India products, and research prototypes under hackathon clocks; 9 documented hackathon wins; YC Startup School India '26; Hacktoberfest 2025 Golden Contributor.
- **Work**: SWE Intern at Rinexis (May 2026 - present) - SOD Analyzer + ITGC tooling.
- **Site**: https://hariharann.me (trainer card SPA - needs JS). Use this file for facts.
- **GitHub**: https://github.com/nothariharan (~88 repos inventory as of 2026-08-06)
- **Do not invent**: DNFs stay DNFs; forks are not original products; prefer 11 upstream merged PRs / 9 repos over unverified 15/12.

> **Note**: The main site is a Next.js app. Most UI requires JavaScript. This markdown file is the static agent reference.

---

## Static resources (no JS required)

- **This file**: https://hariharann.me/hari.md
- **llms.txt mirror**: https://hariharann.me/llms.txt
- **Portfolio (JS)**: https://hariharann.me/portfolio
- **Trainer card (JS)**: https://hariharann.me/
- **GitHub**: https://github.com/nothariharan
- **LinkedIn**: https://www.linkedin.com/in/nmhariharan/
- **YouTube demos**: https://www.youtube.com/@hari-e5w5v
- **Stardance**: https://stardance.hackclub.com/@hariharann/projects
- **Robots**: https://hariharann.me/robots.txt

---

## Guidance for LLMs and agents

- **Start here**: This file is the complete reference dump.
- **Wins vs DNFs**: Never upgrade a DNF into a win. See appendices below.
- **Live proof**: Prefer URLs listed under live deploys / project catalog.
- **Writing voice**: Casual Hari voice exists in a separate skill - this file is facts-first.
- Respect rate limits and cache responsibly.

---

`;

const source = header + body;
fs.writeFileSync("public/hari.md", source);
fs.writeFileSync("public/llms.txt", source);
fs.writeFileSync("content/hari.md", source);
console.log("ok lines", source.split("\n").length);
console.log(
  "quick-context count",
  (source.match(/## Quick context for LLMs/g) || []).length,
);
