// ------------------------------------------------------------------
// Full portfolio catalog for the main site (/portfolio + sub-routes).
// Every fact here is sourced from the /Desktop/Hariharan knowledge base
// (wiki/projects, wiki/achievements, wiki/life). Taglines keep Hari's
// lowercase, punchy voice. Live URLs are exact — real screenshots of
// deployed apps live in /public/shots (captured from production).
// ------------------------------------------------------------------

export type Category =
  | "AI / Agents"
  | "Civic Tech"
  | "Dev Tools"
  | "ML / Research"
  | "Mobile / Creative";

export type FeaturedLane = "people" | "systems" | "civic";

export type SiteProject = {
  slug: string;
  name: string;
  tagline: string; // punchy one-liner
  description: string; // 1–2 sentences, more detail
  category: Category;
  tech: string[]; // logo keys where possible, else plain labels (see ui.tsx)
  date: string;
  repo?: string;
  live?: string;
  award?: string; // e.g. "🥇 1st · AMUHACKS 5.0"
  shot?: string; // /shots/<slug>.webp — real screenshot of the live app
  featured?: boolean;
  /** shown on the cover, e.g. "100+ users" */
  users?: string;
  /** featured-grid filter on /portfolio */
  lane?: FeaturedLane;
};

export const CATEGORIES: Category[] = [
  "AI / Agents",
  "Civic Tech",
  "Dev Tools",
  "ML / Research",
  "Mobile / Creative",
];

// accent + fallback glyph per category (used for cover panels without a screenshot)
export const CATEGORY_META: Record<Category, { color: string; glyph: string }> = {
  "AI / Agents": { color: "#8b5cf6", glyph: "◇" },
  "Civic Tech": { color: "#10b981", glyph: "❖" },
  "Dev Tools": { color: "#38bdf8", glyph: "⌘" },
  "ML / Research": { color: "#f59e0b", glyph: "∆" },
  "Mobile / Creative": { color: "#ec4899", glyph: "✦" },
};

export const PROJECTS: SiteProject[] = [
  {
    slug: "phyla",
    name: "Phyla",
    tagline: "know when something you own becomes dangerous.",
    description:
      "household safety watchdog — ingest what you own, match it against cpsc / fda / usda / nhtsa recalls, then alert with a real remedy. never turns a bad amazon review into a fake federal recall.",
    category: "Civic Tech",
    tech: ["nextjs", "typescript", "supabase", "fireworks"],
    date: "Aug 2026",
    repo: "https://github.com/nothariharan/phyla",
    live: "https://phyla.vercel.app",
    shot: "/shots/phyla.png",
    featured: true,
    lane: "systems",
  },
  {
    slug: "continuum",
    name: "Continuum",
    tagline: "company memory that stays true over time.",
    description:
      "temporal knowledge graph on hydradb — slack and gmail claims fuse into one timeline, so 'who owns acme now?' is reconstructed state, not the highest-ranked chunk. 476 tests, same answer on web / slack / mcp.",
    category: "Dev Tools",
    tech: ["python", "fastapi", "nextjs", "hydradb"],
    date: "Aug 2026",
    repo: "https://github.com/nothariharan/continuum",
    live: "https://continuum-web-xi.vercel.app",
    shot: "/shots/continuum.png",
    featured: true,
    lane: "systems",
  },
  {
    slug: "raksha",
    name: "Raksha",
    tagline: "one freeze packet, four doors — web, whatsapp, phone, agents.",
    description:
      "civic action protocol for financial cyber-fraud in india. one deterministic freeze packet reachable from web, whatsapp, phone, and mcp — banks and 1930 stay simulated on purpose.",
    category: "Civic Tech",
    tech: ["nextjs", "typescript", "python", "twilio"],
    date: "Aug 2026",
    repo: "https://github.com/nothariharan/raksha",
    live: "https://raksha-theta.vercel.app",
    shot: "/shots/raksha.png",
    award: "🏅 Finalist · Build What Moves India · Maya",
    featured: true,
    lane: "civic",
  },
  {
    slug: "image-gen",
    name: "image-gen",
    tagline: "mcp image gen for coding agents. no api key.",
    description:
      "open-source mcp server that drives a real chatgpt session over cdp so cursor / claude code can generate images into the project. 100+ people actually use it.",
    category: "Dev Tools",
    tech: ["nodejs", "typescript", "playwright"],
    date: "Aug 2026",
    repo: "https://github.com/nothariharan/image-gen",
    live: "https://web-2b3c-3000.prg1.zerops.app/",
    shot: "/shots/image-gen.png",
    featured: true,
    users: "100+ mcp users",
    lane: "people",
  },
  {
    slug: "scout",
    name: "Scout",
    tagline: "an autonomous voice buyer that haggles for you.",
    description:
      "calls vendors, negotiates, and only trusts verified quotes — elevenlabs voice agent + twilio + live web research. built for hack-nation #6 (the negotiator challenge).",
    category: "AI / Agents",
    tech: ["nextjs", "typescript", "elevenlabs", "twilio"],
    date: "Jul 2026",
    repo: "https://github.com/nothariharan/scout",
    live: "https://scout-dusky-six.vercel.app",
    award: "🏅 Finalist · Hack-Nation #6",
    shot: "/shots/scout.webp",
    featured: true,
    lane: "systems",
  },
  {
    slug: "slopmark",
    name: "Slopmark",
    tagline: "honest ai slop detection — no llm-as-judge.",
    description:
      "rule-based verifiers put models through a fixed harness so 'slop' scores aren't just another model vibing. next.js + openrouter + supabase.",
    category: "AI / Agents",
    tech: ["nextjs", "typescript", "supabase", "openrouter"],
    date: "Jul 2026",
    repo: "https://github.com/nothariharan/slopmark",
    live: "https://slopmark.vercel.app",
    shot: "/shots/slopmark.webp",
  },
  {
    slug: "crux",
    name: "Crux",
    tagline: "deadline-first study os — upload, extract, plan, practice.",
    description:
      "turns messy course material into a study plan that actually respects the exam date. next.js + supabase + inngest + bedrock/textract. building for openai build week.",
    category: "AI / Agents",
    tech: ["nextjs", "typescript", "supabase", "aws"],
    date: "Jul 2026",
    repo: "https://github.com/nothariharan/crux",
    live: "https://crux-snowy.vercel.app",
    shot: "/shots/crux.webp",
  },
  {
    slug: "tecora",
    name: "Tecora",
    tagline: "folders and search for your ai chats. local-first.",
    description:
      "browser extension that cleans up the chaos of living in claude / chatgpt / gemini — folders, search, bulk cleanup, export. wxt + react + dexie. no cloud brain, just yours.",
    category: "Dev Tools",
    tech: ["typescript", "react", "wxt"],
    date: "Jul 2026",
    repo: "https://github.com/nothariharan/Tecora",
    live: "https://chromewebstore.google.com/detail/tecora/ihagfljacjognebfcmcmcbddjlonpifn",
    shot: "/shots/tecora.png",
    featured: true,
    users: "80+ active",
    lane: "people",
  },
  {
    slug: "certamen",
    name: "Certamen",
    tagline: "any ai model competes live. the crowd bets.",
    description:
      "an open arena where any AI model battles head-to-head while spectators back competitors on live parimutuel odds — double-entry ledger on aurora dsql, hot path on dynamodb streams, four services wired by sqs.",
    category: "AI / Agents",
    tech: ["nextjs", "typescript", "aws"],
    date: "Jul 2026",
    repo: "https://github.com/nothariharan/certamen",
    live: "https://web-theta-khaki-90.vercel.app",
    shot: "/shots/certamen.webp",
  },
  {
    slug: "cofound",
    name: "CoFound",
    tagline: "an ai cofounder that actually shows up to standup.",
    description:
      "startup founder OS — multiple specialized agents research markets, validate assumptions, build product and scale growth from a single idea. an 11-node startup tech tree with live SSE streaming, pivot detection and voice input.",
    category: "AI / Agents",
    tech: ["fastapi", "react", "gemini", "mongodb", "adk"],
    date: "Jun 2026",
    repo: "https://github.com/nothariharan/CoFound",
    live: "https://cofounder-alpha.vercel.app",
    shot: "/shots/cofound.webp",
  },
  {
    slug: "justask",
    name: "JustAsk",
    tagline: "career roadmaps drawn as a metro map.",
    description:
      "brutalist ai career platform — parse a goal, analyse the skill gap, and lay it out as a subway-style metro map with gamification, an ai mentor and a shipping manifest. zero to hired, no fluff.",
    category: "AI / Agents",
    tech: ["react", "firebase", "gemini", "tailwindcss"],
    date: "Feb 2026",
    repo: "https://github.com/nothariharan/JustAsk",
    live: "https://justask-one.vercel.app",
    award: "🥇 1st · AMUHACKS 5.0",
    shot: "/shots/justask.webp",
  },
  {
    slug: "yui",
    name: "Yui",
    tagline: "ai travel concierge that fixes disruptions before you ask.",
    description:
      "an autonomous travel agent that manages a journey from booking to landing — predicting and resolving delays and re-bookings proactively instead of waiting for you to panic.",
    category: "AI / Agents",
    tech: ["react", "typescript", "gemini"],
    date: "Apr 2026",
    live: "https://yui-lemon-five.vercel.app",
    award: "🏆 Won · Ideaverse @ Abhisarga '26",
    shot: "/shots/yui.webp",
  },
  {
    slug: "monkeyspeak",
    name: "monkeyspeak",
    tagline: "monkeytype, but you speak it.",
    description:
      "voice typing speed benchmark — talk the talk and it clocks your wpm, filler words and accuracy, with a global supabase leaderboard. deepgram for stt, web speech api as fallback.",
    category: "Dev Tools",
    tech: ["nextjs", "react", "supabase", "deepgram"],
    date: "Jun 2026",
    repo: "https://github.com/nothariharan/monkeyspeak",
    live: "https://monkeyspeak-delta.vercel.app",
    shot: "/shots/monkeyspeak.webp",
  },
  {
    slug: "mugen",
    name: "Mugen",
    tagline: "audits ai models for bias before the eu act has to.",
    description:
      "explainable ai auditor with a detect → fix → prove workflow using aif360, fairlearn, shap and dice — mapping findings straight to the eu ai act, eeoc and ecoa.",
    category: "ML / Research",
    tech: ["react", "fastapi", "python", "gemini"],
    date: "Apr 2026",
    repo: "https://github.com/nothariharan/Mugen",
    live: "https://mugen-flax.vercel.app",
    shot: "/shots/mugen.webp",
  },
  {
    slug: "vahanlive",
    name: "VahanLive",
    tagline: "where's my bus? answered live.",
    description:
      "real-time public transport tracking — driver phones become gps beacons and passengers watch buses move with sub-second socket.io updates. my first hackathon win.",
    category: "Civic Tech",
    tech: ["react", "nodejs", "mongodb", "socketio"],
    date: "Jan 2026",
    repo: "https://github.com/nothariharan/VahanLive",
    live: "https://vahan-live.vercel.app",
    award: "🏆 Winner · MVP Sprint Challenge",
    shot: "/shots/vahanlive.webp",
  },
  {
    slug: "veda",
    name: "Veda",
    tagline: "an intelligent browser agent — llms that actually drive the web.",
    description:
      "a browser agent framework bridging llms and real web interaction. a react/ts engine builds a dynamic accessibility tree and chunks the page; a fastapi decision hub computes the next action.",
    category: "AI / Agents",
    tech: ["react", "typescript", "fastapi", "python"],
    date: "Apr 2026",
    repo: "https://github.com/nothariharan/Veda",
    award: "🏆 Won · Agentica @ Abhisarga '26",
  },
  {
    slug: "stitch-n-sense",
    name: "Stitch N Sense",
    tagline: "surgical video edits — regenerate a clip, don't reshoot it.",
    description:
      "modular ai video editing — pdf → storyboard, an infinite scene-node canvas, natural-language edit commands, and surgical regeneration where only the changed scenes re-render. bedrock nova pro + ffmpeg.",
    category: "AI / Agents",
    tech: ["react", "typescript", "fastapi", "aws", "ffmpeg"],
    date: "Mar 2026",
    repo: "https://github.com/nothariharan/Stitch_N_Sense",
  },
  {
    slug: "gurren",
    name: "gurren",
    tagline: "pierce the codebase — a local-first windows dev overlay.",
    description:
      "hit ctrl+shift+space to ask anything about your cursor / vs code project. three-level escalation: local chromadb search first, claude or amazon bedrock only when it needs to.",
    category: "Dev Tools",
    tech: ["electron", "react", "typescript", "python", "claude"],
    date: "May 2026",
    repo: "https://github.com/nothariharan/gurren",
  },
  {
    slug: "visor",
    name: "Visor",
    tagline: "see your codebase, don't just read it.",
    description:
      "turns any js/ts/python repo into an interactive spatial IDE with four modes — topography, skeleton, forge and chronicle. installable global npm cli that runs at localhost:6767.",
    category: "Dev Tools",
    tech: ["react", "nodejs", "gemini", "socketio"],
    date: "Mar 2026",
    repo: "https://github.com/nothariharan/Visor",
  },
  {
    slug: "bepop",
    name: "Bepop",
    tagline: "fusing sar + optical satellites into one clear picture.",
    description:
      "an optosar multi-modal digital twin engine — fuses satellite radar and optical imagery for 3d building footprints, height maps, material classification and flood simulation via a custom pytorch cross-attention fusion.",
    category: "ML / Research",
    tech: ["python", "pytorch", "opencv", "streamlit"],
    date: "Mar 2026",
    repo: "https://github.com/nothariharan/Bepop",
    award: "🥇 1st · Cosmix @ Abhisarga '26",
  },
  {
    slug: "team-rocket",
    name: "Team Rocket",
    tagline: "landslide prediction with a sparse mixture-of-experts.",
    description:
      "landslide-ssmoe — a novel adaptation of the eegmoe architecture for 2d geospatial landslide-mask prediction from multi-channel satellite data, with domain-specific and domain-shared experts.",
    category: "ML / Research",
    tech: ["python", "pytorch"],
    date: "Mar 2026",
    repo: "https://github.com/nothariharan/Team_Rocket",
    award: "🏆 Won · Replicate @ Abhisarga '26",
  },
  {
    slug: "synergia",
    name: "Synergia",
    tagline: "real-time underwater cv — detect, track, score risk.",
    description:
      "an end-to-end underwater computer-vision pipeline running yolov8n over 9 object classes with tracking, distance estimation, bearing angles, risk scoring and csv export — all in real time.",
    category: "ML / Research",
    tech: ["python", "opencv", "pytorch"],
    date: "Nov 2025",
    repo: "https://github.com/nothariharan/synergia",
    award: "🏆 Winner · Synergia Hackathon",
  },
  {
    slug: "bharat-seva",
    name: "Bharat Seva",
    tagline: "ai civic assistant for rural india, in any language.",
    description:
      "democratises access to government services with a voice-first, multilingual interface and visual guides — built for citizens with low digital literacy.",
    category: "Civic Tech",
    tech: ["react", "nodejs", "aws", "gemini"],
    date: "Mar 2026",
    repo: "https://github.com/nothariharan/Bharat_Seva",
    live: "https://bharat-seva-alpha.vercel.app",
    shot: "/shots/bharat-seva.webp",
  },
  {
    slug: "mandisaathi",
    name: "MandiSaathi",
    tagline: "multilingual agri-trading, mandi prices in real time.",
    description:
      "an agricultural trading platform bridging farmers, vendors and buyers — multilingual (hindi, english, tamil, telugu, kannada), voice-enabled, with real-time market chat over socket.io.",
    category: "Civic Tech",
    tech: ["react", "nodejs", "gemini", "socketio"],
    date: "Jan 2026",
    repo: "https://github.com/nothariharan/MandiSaathi",
  },
  {
    slug: "lensfix",
    name: "LensFix",
    tagline: "snap a campus issue, watch it get fixed.",
    description:
      "an ai campus-maintenance app — photo capture, gemini classifies the issue and auto-routes it to the right department, with location tagging and resolution tracking across student and helper roles.",
    category: "Mobile / Creative",
    tech: ["flutter", "dart", "firebase", "gemini"],
    date: "Jan 2026",
    repo: "https://github.com/nothariharan/LensFix",
    award: "🥈 2nd · GDG TechSprint",
  },
  {
    slug: "visage",
    name: "Visage",
    tagline: "a retro platformer where you switch hosts, not just masks.",
    description:
      "a 16-bit pixel-art action platformer for global game jam 2026 (theme: mask). the core mechanic is host switching — control different characters with unique abilities, boss battles and a cinematic combat camera.",
    category: "Mobile / Creative",
    tech: ["unity", "csharp"],
    date: "Feb 2026",
    live: "https://globalgamejam.org/games/2026/visage-3-0",
    award: "🥈 2nd · Global Game Jam '26",
  },
  {
    slug: "slopos",
    name: "SlopOS",
    tagline: "what if an operating system was made entirely of slop? on purpose.",
    description:
      "a deliberately janky fake browser desktop — draggable windows, a feedback-eating mouth, a 50/50 delete-or-duplicate gamble wheel and a clippy parody. pure vanilla, zero dependencies.",
    category: "Mobile / Creative",
    tech: ["html5", "css3", "javascript"],
    date: "Jun 2026",
    repo: "https://github.com/nothariharan/SlopOS",
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

// ------------------------------------------------------------------
// Achievements — 9 hackathon wins + recognitions (chronological, newest first)
// ------------------------------------------------------------------

export type Achievement = {
  title: string;
  event: string;
  result: "1st" | "2nd" | "Winner" | "Golden" | "Participant" | "Selected" | "Best UI/UX" | "Finalist";
  /** Emoji mark for the list row */
  icon: string;
  date: string;
  note: string; // one line, Hari's voice
  project?: string; // related project name
  live?: string; // related live URL
  tracks?: { label: string; project: string; result: string }[]; // for Abhisarga's 4-in-a-day
  featured?: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "Build What Moves India — Finalist",
    event: "Maya · Build What Moves India",
    result: "Finalist",
    icon: "🏅",
    date: "2026",
    note: "raksha made the finalist cut from ~13,000 entries — a civic freeze protocol for financial cyber-fraud in india.",
    project: "Raksha",
    live: "https://raksha-theta.vercel.app",
    featured: true,
  },
  {
    title: "Agentic Commerce — Best UI/UX",
    event: "Agentic Commerce Hackathon",
    result: "Best UI/UX",
    icon: "✦",
    date: "Aug 2026",
    note: "compasso won best ui/ux — a shopping agent that actually felt like a product, not a demo.",
    project: "Compasso",
    live: "https://compasso-lime.vercel.app/",
    featured: true,
  },
  {
    title: "Hack-Nation #6 — Finalist Winner",
    event: "Hack-Nation · The Negotiator",
    result: "Finalist",
    icon: "🏅",
    date: "Jul 2026",
    note: "scout made the finalist cut — a voice buyer that calls vendors, haggles, and only trusts verified quotes.",
    project: "Scout",
    live: "https://scout-dusky-six.vercel.app",
    featured: true,
  },
  {
    title: "OpenAI Agents SDK + Google ADK JS",
    event: "openai/openai-agents-python · google/adk-js",
    result: "Selected",
    icon: "⌥",
    date: "Aug 2026",
    note: "merged #4298 into openai agents sdk (session history on cancelled compaction) and #644 into google adk js (binary skill assets as Buffer).",
    live: "https://github.com/openai/openai-agents-python/pull/4298",
    featured: true,
  },
  {
    title: "YC Startup School India '26",
    event: "Y Combinator · Bangalore",
    result: "Selected",
    icon: "🚀",
    date: "Apr 2026",
    note: "yc founder education for india. selected from 100k+ applicants.",
    project: "CoFound",
    live: "https://cofounder-alpha.vercel.app",
    featured: true,
  },
  {
    title: "Hacktoberfest 2025 — Golden Contributor",
    event: "DigitalOcean × GitHub",
    result: "Golden",
    icon: "🎖️",
    date: "Oct 2025",
    note: "highest tier — 4+ meaningful prs merged across open-source repos in october.",
    featured: true,
  },
  {
    title: "Four hackathon wins in a single day",
    event: "Abhisarga '26 · multi-track fest",
    result: "Winner",
    icon: "🏆",
    date: "Apr 2026",
    note: "landslide ml, satellite fusion, a travel concierge and a browser agent — four tracks, one day. range check passed.",
    tracks: [
      { label: "Cosmix", project: "Bepop", result: "🥇 1st" },
      { label: "Replicate", project: "Team Rocket", result: "🏆 Won" },
      { label: "Ideaverse", project: "Yui", result: "🏆 Won" },
      { label: "Agentica", project: "Veda", result: "🏆 Won" },
    ],
  },
  {
    title: "AMUHACKS 5.0 — 1st place",
    event: "Aligarh Muslim University",
    result: "1st",
    icon: "🥇",
    date: "Feb 2026",
    note: "built JustAsk — a brutalist career roadmap generator with a subway-style metro map.",
    project: "JustAsk",
    live: "https://justask-one.vercel.app",
  },
  {
    title: "Global Game Jam '26 — 2nd place",
    event: "GGJ26 · IIIT Sri City (theme: Mask)",
    result: "2nd",
    icon: "🥈",
    date: "Feb 2026",
    note: "a 16-bit platformer where host switching is the mask mechanic.",
    project: "Visage",
    live: "https://globalgamejam.org/games/2026/visage-3-0",
  },
  {
    title: "GDG TechSprint — 2nd place",
    event: "Google Developer Groups",
    result: "2nd",
    icon: "🥈",
    date: "Feb 2026",
    note: "snap a photo of a broken light, gemini routes it to the right department.",
    project: "LensFix",
  },
  {
    title: "MVP Sprint Challenge — Winner",
    event: "Backtracking with Minds",
    result: "Winner",
    icon: "🏆",
    date: "Jan 2026",
    note: "my first hackathon win — driver phones as live gps beacons, buses moving in real time.",
    project: "VahanLive",
    live: "https://vahan-live.vercel.app",
  },
  {
    title: "Synergia Hackathon — Winner",
    event: "Synergia",
    result: "Winner",
    icon: "🏆",
    date: "Nov 2025",
    note: "yolov8 underwater detection on 9 classes — distance, bearing and risk scoring, all live.",
    project: "Synergia",
  },
  {
    title: "Lean In Hacks 5.0 — Flash Rescue",
    event: "Lean In Hacks",
    result: "Participant",
    icon: "⚡",
    date: "Feb 2026",
    note: "a resource/donation matching app connecting donors with people who need stuff.",
  },
];

export const FEATURED_ACHIEVEMENTS = ACHIEVEMENTS.filter((a) => a.featured);

// ------------------------------------------------------------------
// Experience + education (from wiki/life/profile + entities/Rinexis)
// ------------------------------------------------------------------

export type ExpRow = {
  title: string;
  org: string;
  period: string;
  desc: string;
  /** Quiet ExpIcon glyph fallback */
  icon: string;
  /** Optional real logo path under /public (e.g. /logos/rinexis.png) */
  logo?: string;
  bullets?: string[];
};

export const WORK: ExpRow[] = [
  {
    title: "Founding Engineer",
    org: "Stealth Startup (VC-backed)",
    period: "Jun 2026 — Aug 2026",
    desc: "shipped the product in quiet mode. role ended this month.",
    icon: "laptop",
  },
  {
    title: "Webmaster",
    org: "IEEE ITSS · IIIT Sri City",
    period: "May 2026 — Present",
    desc: "run the chapter site — live at iiits-itss.vercel.app.",
    icon: "globe",
  },
  {
    title: "Freelance",
    org: "Independent",
    period: "Jan 2026 — Present",
    desc: "two client builds — full-stack products and agent work, shipped and handed off.",
    icon: "code",
  },
  {
    title: "SAP Security Intern",
    org: "Rinexis",
    period: "May 2026 — Jul 2026",
    desc: "built a multi-tenant sap security saas from the inside.",
    icon: "brief",
    logo: "/logos/rinexis.png",
    bullets: [
      "SOD analyzer — segregation-of-duties conflict detection across sap role assignments, generating auditor remediation reports.",
      "ITGC audit tool — it general controls for sox / soc 2, with finding lifecycle and role-based access for auditors, admins and viewers.",
    ],
  },
];

export const EDUCATION: ExpRow[] = [
  {
    title: "B.Tech, Computer Science",
    org: "IIIT Sri City",
    period: "Aug 2025 — Present",
    desc: "dual degree with iit patna · cgpa 9.6/10.",
    icon: "grad",
  },
  {
    title: "B.Sc, AI & Cybersecurity",
    org: "IIT Patna",
    period: "Aug 2025 — Present",
    desc: "cpi 9.53/10.",
    icon: "grad",
  },
];

// ------------------------------------------------------------------
// Upstream OSS — org-grouped PRs (own-repo PRs excluded).
// Facts from wiki/life/open-source-activity + HF export 2026-08-06.
// Graphify #2422 landed via cherry-pick (shipped, not GitHub-merged).
// ------------------------------------------------------------------

export type OssPrState = "merged" | "shipped" | "open";

export type OssPr = {
  number: number;
  title: string;
  url: string;
  state: OssPrState;
  note?: string;
};

export type OssGroup = "upstream" | "hacktoberfest" | "other";

export type OssOrg = {
  id: string;
  name: string;
  /** shown as owner/repo under the org name */
  repo: string;
  logo: string;
  /** invert dark SVGs so they read on the black tile */
  invert?: boolean;
  note?: string;
  group: OssGroup;
  prs: OssPr[];
};

export const OSS_ORGS: OssOrg[] = [
  {
    id: "openai",
    name: "OpenAI",
    repo: "openai/openai-agents-python",
    logo: "/logos/openai.svg",
    invert: true,
    note: "Agents SDK",
    group: "upstream",
    prs: [
      {
        number: 4298,
        title: "fix(sessions): restore session history when compaction replacement is cancelled",
        url: "https://github.com/openai/openai-agents-python/pull/4298",
        state: "merged",
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    repo: "google/adk-js",
    logo: "/logos/google.svg",
    note: "ADK JS",
    group: "upstream",
    prs: [
      {
        number: 644,
        title: "fix(skills): preserve binary skill assets as Buffer",
        url: "https://github.com/google/adk-js/pull/644",
        state: "merged",
      },
    ],
  },
  {
    id: "graphify",
    name: "Graphify Labs",
    repo: "Graphify-Labs/graphify",
    logo: "/oss/graphify-labs.png",
    note: "YC S26",
    group: "upstream",
    prs: [
      {
        number: 2422,
        title: "fix(hooks): skip post-checkout rebuild when PREV_HEAD equals NEW_HEAD",
        url: "https://github.com/Graphify-Labs/graphify/pull/2422",
        state: "shipped",
        note: "v0.9.46",
      },
      {
        number: 2423,
        title: "fix(cli): point explain truncation at affected for full blast-radius",
        url: "https://github.com/Graphify-Labs/graphify/pull/2423",
        state: "open",
      },
    ],
  },
  {
    id: "mem0",
    name: "Mem0",
    repo: "mem0ai/mem0",
    logo: "/oss/mem0ai.png",
    note: "YC S24",
    group: "upstream",
    prs: [
      {
        number: 6851,
        title: "fix(vector_stores/azure_ai_search): raise on failed IndexingResult",
        url: "https://github.com/mem0ai/mem0/pull/6851",
        state: "open",
      },
    ],
  },
  {
    id: "foss42",
    name: "foss42",
    repo: "foss42/apidash",
    logo: "/oss/foss42.png",
    note: "APIDash",
    group: "upstream",
    prs: [
      {
        number: 1742,
        title: "fix: prevent AI JSON parse from leaving request stuck in isWorking",
        url: "https://github.com/foss42/apidash/pull/1742",
        state: "open",
      },
      {
        number: 1738,
        title: "Clear expired history via isolate",
        url: "https://github.com/foss42/apidash/pull/1738",
        state: "open",
      },
    ],
  },
  {
    id: "foodie",
    name: "Foodie",
    repo: "janavipandole/Foodie",
    logo: "/oss/janavipandole.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 131,
        title: "Updated Filter Bar",
        url: "https://github.com/janavipandole/Foodie/pull/131",
        state: "merged",
      },
      {
        number: 114,
        title: "Add feature: Added Items into the menu",
        url: "https://github.com/janavipandole/Foodie/pull/114",
        state: "merged",
      },
    ],
  },
  {
    id: "opensauce",
    name: "OpenSauce",
    repo: "xthxr/OpenSauce",
    logo: "/oss/xthxr.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 260,
        title: "Added Searching and Sorting algorithms on Scala and Swift",
        url: "https://github.com/xthxr/OpenSauce/pull/260",
        state: "merged",
      },
      {
        number: 231,
        title: "Add DynamicProgramming and Linked List Cycles in JavaScript",
        url: "https://github.com/xthxr/OpenSauce/pull/231",
        state: "merged",
      },
    ],
  },
  {
    id: "css-art-museum",
    name: "css-art-museum",
    repo: "pixel-museum/css-art-museum",
    logo: "/oss/pixel-museum.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 314,
        title: "feat: Create Animated Halloween Scene with CSS Art",
        url: "https://github.com/pixel-museum/css-art-museum/pull/314",
        state: "merged",
      },
    ],
  },
  {
    id: "leetcode2024",
    name: "LeetCode 6Companies30Days",
    repo: "abhisek247767/LeetCode2024-6Companies30Days",
    logo: "/oss/abhisek247767.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 211,
        title: "Added solution to Trapping Rain Water Problem and LRU Cache in JS",
        url: "https://github.com/abhisek247767/LeetCode2024-6Companies30Days/pull/211",
        state: "merged",
      },
    ],
  },
  {
    id: "student-portfolio",
    name: "Student-Portfolio",
    repo: "Sbiswas001/Student-Portfolio",
    logo: "/oss/sbiswas001.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 68,
        title: "Add My Portfolio",
        url: "https://github.com/Sbiswas001/Student-Portfolio/pull/68",
        state: "merged",
      },
    ],
  },
  {
    id: "beginner-python",
    name: "beginner-python-mini-projects",
    repo: "arya2004/beginner-python-mini-projects-hacktoberfest-2025",
    logo: "/oss/arya2004.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 87,
        title: "Added Typing Speed Test with Documentation",
        url: "https://github.com/arya2004/beginner-python-mini-projects-hacktoberfest-2025/pull/87",
        state: "merged",
      },
    ],
  },
  {
    id: "hf-2k25",
    name: "Hacktoberfest-2k25",
    repo: "mohamedammar27/Hacktoberfest-2k25",
    logo: "/oss/mohamedammar27.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 19,
        title: "Added My Portfolio",
        url: "https://github.com/mohamedammar27/Hacktoberfest-2k25/pull/19",
        state: "merged",
      },
    ],
  },
  {
    id: "ai-tools-manager",
    name: "ai-tools-manager",
    repo: "ArshdeepGrover/ai-tools-manager",
    logo: "/oss/arshdeepgrover.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 121,
        title: "Add 2 new AI Tools",
        url: "https://github.com/ArshdeepGrover/ai-tools-manager/pull/121",
        state: "merged",
      },
    ],
  },
  {
    id: "hf-python",
    name: "HACKTOBERFEST_25_Python",
    repo: "A-K-0/HACKTOBERFEST_25_Python",
    logo: "/oss/a-k-0.png",
    group: "hacktoberfest",
    prs: [
      {
        number: 51,
        title: "Add: Create command-line Blackjack game and documentation",
        url: "https://github.com/A-K-0/HACKTOBERFEST_25_Python/pull/51",
        state: "merged",
      },
    ],
  },
  {
    id: "hackathon-tools",
    name: "Hackathon-Tools",
    repo: "rahavshukla/Hackathon-Tools",
    logo: "/oss/rahavshukla.png",
    group: "other",
    prs: [
      {
        number: 2,
        title: "README techs",
        url: "https://github.com/rahavshukla/Hackathon-Tools/pull/2",
        state: "open",
      },
    ],
  },
];

export const OSS_UPSTREAM = OSS_ORGS.filter((o) => o.group === "upstream");
export const OSS_HACKTOBERFEST = OSS_ORGS.filter((o) => o.group === "hacktoberfest");
export const OSS_OTHER = OSS_ORGS.filter((o) => o.group === "other");

// ------------------------------------------------------------------
// Journey timeline — the full "so far", newest first
// (curated from wiki/life/timeline.md)
// ------------------------------------------------------------------

export type JourneyKind = "education" | "work" | "win" | "ship" | "milestone";

export type JourneyEntry = {
  date: string;
  title: string;
  desc: string;
  kind: JourneyKind;
  icon: string;
};

export const JOURNEY_KIND_META: Record<JourneyKind, { color: string; label: string }> = {
  education: { color: "#10b981", label: "education" },
  work: { color: "#8b5cf6", label: "work" },
  win: { color: "#f59e0b", label: "win" },
  ship: { color: "#38bdf8", label: "shipped" },
  milestone: { color: "#ec4899", label: "milestone" },
};

export const JOURNEY: JourneyEntry[] = [
  {
    date: "Jun 2026 — Aug 2026",
    title: "Founding Eng @ Stealth (VC-backed)",
    desc: "shipped the product in quiet mode. role ended this month.",
    kind: "work",
    icon: "🚀",
  },
  {
    date: "Aug 2026",
    title: "Phyla + Continuum + Raksha shipped",
    desc: "household safety watchdog, temporal company memory on hydradb, and a civic freeze protocol. all live.",
    kind: "ship",
    icon: "🚀",
  },
  {
    date: "Aug 2026",
    title: "OpenAI Agents SDK + Google ADK JS",
    desc: "merged #4298 and #644 upstream. also 100+ users on image-gen mcp, tecora on the chrome web store.",
    kind: "milestone",
    icon: "⌥",
  },
  {
    date: "May 2026 — Present",
    title: "Webmaster @ IEEE ITSS",
    desc: "chapter site for iiit sri city — live at iiits-itss.vercel.app.",
    kind: "work",
    icon: "🌐",
  },
  {
    date: "May 2026 — Jul 2026",
    title: "SAP Security Intern @ Rinexis",
    desc: "built a multi-tenant sap security saas — sod analysis and itgc audit tooling.",
    kind: "work",
    icon: "💼",
  },
  {
    date: "Jan 2026 — Present",
    title: "Freelance · 2 client projects",
    desc: "full-stack and agent work, shipped and handed off.",
    kind: "work",
    icon: "💻",
  },
  {
    date: "Jul 2026",
    title: "Scout, Crux, Tecora",
    desc: "voice buyer, deadline-first study os, and a local-first extension now in chrome web store.",
    kind: "ship",
    icon: "🚀",
  },
  {
    date: "Jun 2026",
    title: "Building CoFound",
    desc: "multi-agent founder OS — still a main product. also shipped monkeyspeak and SlopOS.",
    kind: "ship",
    icon: "🚀",
  },
  {
    date: "Apr 2026",
    title: "YC Startup School India '26",
    desc: "selected for y combinator's founder programme in bangalore.",
    kind: "milestone",
    icon: "🚀",
  },
  {
    date: "Oct 2025",
    title: "Hacktoberfest Golden Contributor",
    desc: "highest-tier open-source contributor for 2025 — meaningful prs merged across repos.",
    kind: "milestone",
    icon: "🎖️",
  },
];
