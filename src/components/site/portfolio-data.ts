// ------------------------------------------------------------------
// Full portfolio catalog for the main site (/portfolio + sub-routes).
// Every fact here is sourced from the /Desktop/Hariharan knowledge base
// (wiki/projects, wiki/achievements, wiki/life). Taglines keep Hari's
// lowercase, punchy voice. Live URLs are exact — screenshots of the six
// deployed apps live in /public/shots.
// ------------------------------------------------------------------

export type Category =
  | "AI / Agents"
  | "Civic Tech"
  | "Dev Tools"
  | "ML / Research"
  | "Mobile / Creative";

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
  shot?: string; // /shots/<slug>.png — real screenshot of the live app
  featured?: boolean;
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
    award: "⏳ Hack-Nation #6 · results Jul 25",
    featured: true,
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
    featured: true,
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
    shot: "/shots/certamen.png",
    featured: true,
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
    shot: "/shots/cofound.png",
    featured: true,
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
    shot: "/shots/justask.png",
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
    shot: "/shots/yui.png",
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
    shot: "/shots/monkeyspeak.png",
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
    shot: "/shots/mugen.png",
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
    shot: "/shots/vahanlive.png",
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
  result: "1st" | "2nd" | "Winner" | "Golden" | "Participant" | "Selected";
  icon: string; // emoji
  date: string;
  note: string; // one line, Hari's voice
  project?: string; // related project name
  live?: string; // related live URL
  tracks?: { label: string; project: string; result: string }[]; // for Abhisarga's 4-in-a-day
  featured?: boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: "YC Startup School India '26",
    event: "Y Combinator · Bangalore",
    result: "Selected",
    icon: "🚀",
    date: "Apr 2026",
    note: "yc founder education for india — serious startup intent, not just hackathon projects.",
    project: "CoFound",
    live: "https://cofounder-alpha.vercel.app",
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
    featured: true,
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
    featured: true,
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
    title: "Hacktoberfest 2025 — Golden Contributor",
    event: "DigitalOcean × GitHub",
    result: "Golden",
    icon: "🎖️",
    date: "Oct 2025",
    note: "highest tier — 4+ meaningful prs merged across open-source repos in october.",
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
  icon: string; // ExpIcon key
  bullets?: string[];
};

export const WORK: ExpRow[] = [
  {
    title: "AI / Full-Stack Builder",
    org: "Independent",
    period: "2025 — Present",
    desc: "shipping ai agents, civic tech and developer tools — 22+ projects, most of them deployed and in front of real users.",
    icon: "laptop",
  },
  {
    title: "SAP Security Intern",
    org: "Rinexis",
    period: "May 2026 — Present",
    desc: "building a multi-tenant sap security saas from the inside.",
    icon: "brief",
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
    desc: "dual-degree programme — building products in parallel with coursework.",
    icon: "grad",
  },
  {
    title: "Dual Degree (CS)",
    org: "IIT Patna",
    period: "Aug 2025 — Present",
    desc: "the second half of the dual degree with iiit sri city.",
    icon: "grad",
  },
];

// small headline stats
export const STATS = [
  { value: "22+", label: "projects shipped" },
  { value: "9", label: "hackathon wins" },
  { value: "1700+", label: "leetcode rating" },
];

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
    date: "Jul 2026",
    title: "Scout + Slopmark shipped",
    desc: "scout — autonomous voice buyer for hack-nation #6 (results jul 25). slopmark — honest ai-slop benchmarks with rule-based verifiers. also cooking crux (openai build week) and tecora.",
    kind: "ship",
    icon: "🚀",
  },
  {
    date: "Jun 2026",
    title: "Building CoFound",
    desc: "multi-agent founder OS — still a main product. also shipped monkeyspeak (voice wpm benchmark) and SlopOS (a fake OS made of slop, on purpose).",
    kind: "ship",
    icon: "🚀",
  },
  {
    date: "May 2026",
    title: "gurren shipped",
    desc: "a local-first windows dev overlay with on-device rag — press a hotkey, ask your codebase anything.",
    kind: "ship",
    icon: "⌘",
  },
  {
    date: "Apr 2026",
    title: "YC Startup School India '26",
    desc: "selected for y combinator's founder programme in bangalore. startup thinking, baked in.",
    kind: "milestone",
    icon: "🚀",
  },
  {
    date: "Apr 2026",
    title: "Four hackathon wins in a single day",
    desc: "swept four tracks at abhisarga '26 — bepop (🥇 cosmix), team rocket (replicate), yui (ideaverse) and veda (agentica).",
    kind: "win",
    icon: "🏆",
  },
  {
    date: "Apr 2026",
    title: "Mugen shipped",
    desc: "an explainable ai bias auditor that maps findings to the eu ai act, eeoc and ecoa.",
    kind: "ship",
    icon: "🧪",
  },
  {
    date: "Mar 2026",
    title: "The prolific month",
    desc: "shipped stitch n sense, bharat seva, justask, visor, team rocket, bepop, yui and veda — eight projects in one month.",
    kind: "ship",
    icon: "⚡",
  },
  {
    date: "Feb 2026",
    title: "AMUHACKS 5.0 — 1st place",
    desc: "won with justask, a brutalist career roadmap drawn as a subway metro map.",
    kind: "win",
    icon: "🥇",
  },
  {
    date: "Feb 2026",
    title: "Two 2nd places in one weekend",
    desc: "global game jam (visage, a host-switching platformer) and gdg techsprint (lensfix, campus maintenance).",
    kind: "win",
    icon: "🥈",
  },
  {
    date: "Jan 2026",
    title: "First hackathon win",
    desc: "vahanlive took the mvp sprint challenge — real-time bus tracking with driver phones as gps beacons.",
    kind: "win",
    icon: "🏆",
  },
  {
    date: "Nov 2025",
    title: "Synergia Hackathon win",
    desc: "real-time underwater computer vision with yolov8 — detection, tracking and risk scoring.",
    kind: "win",
    icon: "🏆",
  },
  {
    date: "Oct 2025",
    title: "Hacktoberfest Golden Contributor",
    desc: "highest-tier open-source contributor for 2025 — meaningful prs merged across repos.",
    kind: "milestone",
    icon: "🎖️",
  },
  {
    date: "Aug 2025",
    title: "Started dual-degree CS",
    desc: "iiit sri city × iit patna — building in parallel with coursework from day one.",
    kind: "education",
    icon: "🎓",
  },
  {
    date: "May 2026 — Present",
    title: "SAP Security Intern @ Rinexis",
    desc: "building a multi-tenant sap security saas — segregation-of-duties analysis and itgc audit tooling.",
    kind: "work",
    icon: "💼",
  },
];
