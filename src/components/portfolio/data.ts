// real portfolio content for n. hariharan (hari)

export const TRAINER_ID = "67420";


export type TabKey = "projects" | "experience" | "honors" | "skills";

// projects data

export type Project = {
  id: string;
  name: string;
  short: string;
  tags: string[];
  color: string;
  blurb: string;
  role: string;
  duration: string;
  team: string;
  status: string;
  stack: string[];
  extraStack: number;
  url: string;
  repo: string;
};

export const PROJECTS: Project[] = [
  {
    id: "008",
    name: "SCOUT",
    short: "Scout",
    tags: ["Voice", "Agents"],
    color: "#5b87d6",
    blurb: "Autonomous voice buyer — calls vendors, haggles, only trusts verified quotes. Built for Hack-Nation #6.",
    role: "Solo Builder",
    duration: "Jul 2026",
    team: "Hackathon",
    status: "Submitted",
    stack: ["nextjs", "typescript"],
    extraStack: 2,
    url: "https://scout-dusky-six.vercel.app",
    repo: "https://github.com/nothariharan/scout",
  },
  {
    id: "009",
    name: "SLOPMARK",
    short: "Slopmark",
    tags: ["AI", "Eval"],
    color: "#d99a2c",
    blurb: "Honest AI slop detector — fixed harness with rule-based verifiers, never LLM-as-judge.",
    role: "Solo Builder",
    duration: "Jul 2026",
    team: "Solo",
    status: "Live",
    stack: ["nextjs", "supabase"],
    extraStack: 1,
    url: "https://slopmark.vercel.app",
    repo: "https://github.com/nothariharan/slopmark",
  },
  {
    id: "007",
    name: "CERTAMEN",
    short: "Certamen",
    tags: ["AI", "AWS"],
    color: "#c2453d",
    blurb: "An open arena where any AI model competes live and the crowd bets — double-entry ledger on Aurora DSQL, live odds on DynamoDB.",
    role: "Team Project",
    duration: "Jul 2026",
    team: "Hackathon",
    status: "Live",
    stack: ["nextjs", "aws"],
    extraStack: 2,
    url: "https://web-theta-khaki-90.vercel.app",
    repo: "https://github.com/nothariharan/certamen",
  },
  {
    id: "001",
    name: "COFOUND",
    short: "CoFound",
    tags: ["AI", "Agents"],
    color: "#d4524a",
    blurb: "An AI cofounder that actually shows up to standup — a multi-agent Founder OS built on Gemini 2.5 and Google ADK.",
    role: "Solo Builder",
    duration: "Jun 2026 · Active",
    team: "Solo",
    status: "Active",
    stack: ["fastapi", "react", "mongodb"],
    extraStack: 2,
    url: "https://cofounder-alpha.vercel.app",
    repo: "https://github.com/nothariharan/CoFound",
  },
  {
    id: "002",
    name: "MONKEYSPEAK",
    short: "MonkeySpeak",
    tags: ["Voice", "Next.js"],
    color: "#3f8f33",
    blurb: "Voice-typing speed benchmark — talk and it clocks your WPM and filler words in real time.",
    role: "Solo Builder",
    duration: "Jun 2026",
    team: "Solo",
    status: "Live",
    stack: ["nextjs", "supabase"],
    extraStack: 1,
    url: "https://monkeyspeak-delta.vercel.app",
    repo: "https://github.com/nothariharan/monkeyspeak",
  },
  {
    id: "003",
    name: "VISOR",
    short: "Visor",
    tags: ["DevTool"],
    color: "#5a9bd6",
    blurb: "See your codebase, don't just read it — a visual OS for repos, installable from npm.",
    role: "Solo Builder",
    duration: "Mar 2026",
    team: "Solo",
    status: "Shipped",
    stack: ["react", "nodejs", "gemini"],
    extraStack: 1,
    url: "",
    repo: "https://github.com/nothariharan/Visor",
  },
  {
    id: "004",
    name: "VAHANLIVE",
    short: "VahanLive",
    tags: ["Realtime", "Winner"],
    color: "#e0a52c",
    blurb: "Where's my bus? Answered live. Real-time public-transport tracking — won the Backtracking with Minds hackathon.",
    role: "Team Project",
    duration: "Jan 2026",
    team: "Hackathon",
    status: "Winner",
    stack: ["react", "nodejs", "mongodb"],
    extraStack: 1,
    url: "https://vahan-live.vercel.app",
    repo: "https://github.com/nothariharan/VahanLive",
  },
  {
    id: "005",
    name: "GURREN",
    short: "Gurren",
    tags: ["Electron", "RAG"],
    color: "#9b6cc4",
    blurb: "Pierce the codebase — a local-first Windows dev overlay with on-device RAG, powered by the Claude API.",
    role: "Solo Builder",
    duration: "May 2026",
    team: "Solo",
    status: "Shipped",
    stack: ["electron", "react"],
    extraStack: 2,
    url: "",
    repo: "https://github.com/nothariharan/gurren",
  },
  {
    id: "006",
    name: "MUGEN",
    short: "Mugen",
    tags: ["AI", "Fairness"],
    color: "#2aa6a0",
    blurb: "Audits AI models for bias before the EU AI Act has to — explainable fairness reporting, end to end.",
    role: "Solo Builder",
    duration: "Apr 2026",
    team: "Solo",
    status: "Shipped",
    stack: ["fastapi", "react"],
    extraStack: 2,
    url: "https://mugen-flax.vercel.app/",
    repo: "https://github.com/nothariharan/Mugen",
  },
];

// project metadata mapping icons and descriptions
export const PROJECT_META: Record<string, { icon: string; listDesc: string }> = {
  "008": { icon: "scout", listDesc: "Voice buyer agent — haggles vendors with verified quotes." },
  "009": { icon: "slopmark", listDesc: "Honest AI slop benchmarks — rule-based, not vibes." },
  "007": { icon: "certamen", listDesc: "Live arena where AI models battle & the crowd bets." },
  "001": { icon: "cofound", listDesc: "Multi-agent founder OS to build, ship & scale faster." },
  "002": { icon: "monkeyspeak", listDesc: "Voice-typing benchmark — clocks WPM & filler words." },
  "003": { icon: "visor", listDesc: "Visual OS for codebases — explore & query visually." },
  "004": { icon: "vahanlive", listDesc: "Real-time public-transport tracking. Hackathon winner." },
  "005": { icon: "gurren", listDesc: "Local-first Windows dev overlay with on-device RAG." },
  "006": { icon: "mugen", listDesc: "Audits AI models for bias before the EU AI Act does." },
};

export const TOTAL_BUILT = "22+";

// experience data

export const EXP_STATS = [
  { value: "5", label: "EXPERIENCES" },
  { value: "22+", label: "PROJECTS" },
  { value: "10+", label: "HACKATHONS" },
  { value: "9", label: "WINS" },
];

export type TimelineItem = {
  current?: boolean;
  period: string;
  title: string;
  desc: string;
  icon: "laptop" | "brain" | "globe" | "code" | "hands";
};

export const TIMELINE: TimelineItem[] = [
  {
    current: true,
    period: "PRESENT",
    title: "AI / Full-Stack Builder",
    desc: "Shipping AI agents & products solving real problems.",
    icon: "laptop",
  },
  {
    period: "2025 — 2026",
    title: "SAP Security Intern · Rinexis",
    desc: "Built an SOD analyzer & ITGC audit tooling for SAP.",
    icon: "brain",
  },
  {
    period: "OCT 2025",
    title: "Hacktoberfest Golden Contributor",
    desc: "Top-tier open-source contributor — 4+ PRs merged.",
    icon: "globe",
  },
  {
    period: "2026",
    title: "Hackathon Circuit",
    desc: "Wins at VahanLive, AMUHACKS 5.0 & Cosmix.",
    icon: "code",
  },
  {
    period: "AUG 2025 — NOW",
    title: "Dual-Degree CS Student",
    desc: "IIIT SriCity × IIT Patna — building while learning.",
    icon: "hands",
  },
];

export const CURRENT_ROLE = {
  title: "AI / FULL-STACK BUILDER",
  status: "Present",
  tagline: "Building products, solving real world problems.",
  rows: [
    { label: "TYPE", value: "Student · Builder" },
    { label: "ROLE", value: "Full-Stack + AI" },
    { label: "LOCATION", value: "India · Remote" },
    { label: "FOCUS", value: "AI Agents, Web, Civic Tech" },
  ],
  tech: ["react", "nodejs", "fastapi", "mongodb"],
  extraTech: 4,
};

export const KEY_ACHIEVEMENTS = [
  "Shipped 20+ projects across AI & web",
  "Won 3 hackathons (VahanLive, AMUHACKS, Cosmix)",
  "Hacktoberfest Golden Contributor '25",
  "YC Startup School India '26 participant",
];

export const SKILLS_GAINED = [
  "Multi-Agent AI",
  "System Design",
  "Rapid Prototyping",
  "Product Sense",
  "Civic Tech",
  "SAP Security",
];

// education background
export const EDUCATION = "B.Tech CS · IIIT SriCity × IIT Patna (dual degree, since Aug 2025)";

// honors data

export const HONOR_STATS = [
  { value: "8", label: "ACHIEVEMENTS", icon: "trophy" },
  { value: "5", label: "HACKATHONS", icon: "medal" },
  { value: "3", label: "WINS", icon: "ribbon" },
  { value: "3", label: "FEATURED", icon: "star" },
];

export type Honor = {
  title: string;
  sub: string;
  badge: "Winner" | "Runner Up" | "Finalist" | "Contributor" | "Certificate" | "Participant";
  date: string;
  shape: "trophy" | "medal" | "shield" | "code" | "cert" | "star";
};

export const HONORS: Honor[] = [
  { title: "Hackathon Winner", sub: "Backtracking with Minds — VahanLive", badge: "Winner", date: "Jan 2026", shape: "trophy" },
  { title: "AMUHACKS 5.0 Winner", sub: "Aligarh Muslim University", badge: "Winner", date: "2026", shape: "medal" },
  { title: "Cosmix Hackathon Winner", sub: "Cosmix '26", badge: "Winner", date: "2026", shape: "shield" },
  { title: "Hacktoberfest Golden", sub: "Open Source — 4+ PRs merged", badge: "Contributor", date: "Oct 2025", shape: "code" },
  { title: "YC Startup School '26", sub: "Y Combinator — India cohort", badge: "Participant", date: "2026", shape: "star" },
  { title: "LeetCode 1700+", sub: "Competitive Programming", badge: "Certificate", date: "2026", shape: "cert" },
  { title: "TechSprint Hackathon", sub: "LensFix — campus maintenance app", badge: "Participant", date: "Jan 2026", shape: "shield" },
  { title: "Lean In Hacks 5.0", sub: "Flash Rescue — resource matching", badge: "Participant", date: "Feb 2026", shape: "shield" },
];

export const FEATURED_HONOR = {
  title: "HACKATHON WINNER",
  event: "BACKTRACKING WITH MINDS",
  blurb: "Built VahanLive — a real-time public-transport tracking system — and won. Live at vahan-live.vercel.app.",
  position: "Winner",
  date: "Jan 2026",
  team: "Team Project",
  duration: "Hackathon",
  tech: ["react", "nodejs", "mongodb"],
  extraTech: 1,
};

// skills data

export const SKILL_STATS = [
  { value: "30+", label: "TECHNOLOGIES", icon: "code" },
  { value: "6", label: "DOMAINS", icon: "tools" },
  { value: "20+", label: "PROJECTS", icon: "book" },
  { value: "3", label: "HACK WINS", icon: "bolt" },
];

export const SKILL_CATEGORIES = [
  { key: "lang", name: "LANGUAGES", desc: "Programming languages I build with.", color: "#7e54b8", icon: "code" },
  { key: "frame", name: "FRAMEWORKS", desc: "React, Next, FastAPI, Node, Flutter.", color: "#3a7cc2", icon: "react" },
  { key: "ai", name: "AI & ML", desc: "Agents, LLM APIs, PyTorch.", color: "#d99a2c", icon: "brain" },
  { key: "data", name: "DATABASES", desc: "Mongo, Supabase, Firebase, SQL.", color: "#c2453d", icon: "db" },
  { key: "tools", name: "TOOLS & CLOUD", desc: "Docker, AWS, GCP, Vercel, Git.", color: "#3f9b46", icon: "terminal" },
  { key: "learn", name: "CURRENTLY LEARNING", desc: "What I'm levelling up next.", color: "#5d6b7a", icon: "book" },
];

export const LANGUAGES = [
  { name: "Python", key: "python", stars: 5 },
  { name: "TypeScript", key: "typescript", stars: 5 },
  { name: "JavaScript", key: "javascript", stars: 5 },
  { name: "C / C++", key: "cpp", stars: 4 },
  { name: "SQL", key: "postgresql", stars: 4 },
  { name: "Dart", key: "dart", stars: 3 },
];

export const PROFICIENCY = [
  { name: "AI / ML & Agents", pct: 90, color: "#7e54b8" },
  { name: "Full-Stack Web", pct: 90, color: "#3a7cc2" },
  { name: "Backend (FastAPI/Node)", pct: 85, color: "#3f9b46" },
  { name: "Databases", pct: 80, color: "#e0a52c" },
  { name: "DevOps & Cloud", pct: 70, color: "#49a6ff" },
  { name: "System Design", pct: 70, color: "#c2453d" },
];

export const CURRENTLY_LEARNING = [
  { name: "System Design", key: "system", pct: 60 },
  { name: "LangGraph", key: "langgraph", pct: 55 },
  { name: "Kubernetes", key: "kubernetes", pct: 45 },
  { name: "Multi-Agent AI", key: "agents", pct: 65 },
];

export const SKILL_RADAR = [
  { axis: "Problem\nSolving", value: 0.9 },
  { axis: "Code\nQuality", value: 0.82 },
  { axis: "Shipping\nSpeed", value: 0.92 },
  { axis: "Collaboration", value: 0.8 },
  { axis: "Learning\nAgility", value: 0.95 },
];

export const SKILL_STATS_FOOTER = [
  { label: "LeetCode Rating", value: "1700+", icon: "trophy" },
  { label: "Hackathon Wins", value: "3", icon: "lines" },
  { label: "Projects Built", value: "20+", icon: "code" },
  { label: "Public Repos", value: "13+", icon: "github" },
];

// back-of-card panels data

export const PANELS: { tab: TabKey; label: string; img: string; accent: string }[] = [
  { tab: "projects", label: "PROJECTS", img: "/sprites/panel_projects.png", accent: "#5fd0e6" },
  { tab: "experience", label: "EXPERIENCE", img: "/sprites/panel_experience.png", accent: "#7fd6a6" },
  { tab: "honors", label: "HONORS", img: "/sprites/panel_honors.png", accent: "#f0c84a" },
  { tab: "skills", label: "SKILLS", img: "/sprites/panel_skills.png", accent: "#9aa0f0" },
];

// summaries for card back sections pulled from the knowledge base / README.
export const BACK_SUMMARY: Record<
  TabKey,
  { tagline: string; lines: string[]; stat: string; link: { label: string; url: string } }
> = {
  projects: {
    tagline: "things i've shipped",
    lines: [
      "CoFound — multi-agent Founder OS",
      "VahanLive — realtime transit (winner)",
      "Visor — visual OS for codebases",
    ],
    stat: "20+ BUILT · 3 HACKATHON WINS",
    link: { label: "LIVE DEMO", url: "https://cofounder-alpha.vercel.app" },
  },
  experience: {
    tagline: "the journey so far",
    lines: [
      "AI / Full-Stack Builder — present",
      "SAP Security Intern · Rinexis",
      "Dual-degree CS · IIIT × IIT Patna",
    ],
    stat: "5 ROLES · BUILDING SINCE 2025",
    link: { label: "LINKEDIN", url: "https://www.linkedin.com/in/nmhariharan/" },
  },
  honors: {
    tagline: "milestones earned",
    lines: [
      "3 hackathon wins — Vahan, AMUHACKS, Cosmix",
      "Hacktoberfest Golden Contributor '25",
      "YC Startup School India '26",
    ],
    stat: "8 HONORS · LEETCODE 1700+",
    link: { label: "VIEW WIN", url: "https://vahan-live.vercel.app/" },
  },
  skills: {
    tagline: "tools in my belt",
    lines: [
      "Python · TypeScript · React · Next.js",
      "FastAPI · Node · Mongo · Supabase",
      "AI agents · Gemini · Bedrock · PyTorch",
    ],
    stat: "30+ TECH · 6 DOMAINS",
    link: { label: "GITHUB", url: "https://github.com/nothariharan" },
  },
};

// back-of-card lists content

// high-level projects summaries for the back face — tag + color give each row its own identity
export const BACK_PROJECTS = [
  { name: "Scout", icon: "scout", desc: "Voice buyer agent — haggles with verified quotes only.", tag: "VOICE AGENT", color: "#5b87d6", live: "https://scout-dusky-six.vercel.app", repo: "https://github.com/nothariharan/scout" },
  { name: "Slopmark", icon: "slopmark", desc: "Honest AI slop benchmarks — rule-based verifiers.", tag: "AI EVAL", color: "#d99a2c", live: "https://slopmark.vercel.app", repo: "https://github.com/nothariharan/slopmark" },
  { name: "CoFound", icon: "cofound", desc: "Multi-agent founder OS — plan, build & ship.", tag: "AI AGENTS", color: "#9b6cc4", live: "https://cofounder-alpha.vercel.app", repo: "https://github.com/nothariharan/CoFound" },
  { name: "Certamen", icon: "certamen", desc: "Open arena where AI models battle & the crowd bets.", tag: "AI ARENA", color: "#d4524a", live: "https://web-theta-khaki-90.vercel.app", repo: "https://github.com/nothariharan/certamen" },
];

// experience highlights — chronological, oldest first
export const BACK_EXPERIENCE = [
  { year: "AUG 2025", title: "B.Tech CS — IIIT SriCity", sub: "Dual degree begins", icon: "grad", tag: "EDUCATION", color: "#4a76c9", url: "https://www.linkedin.com/in/nmhariharan/" },
  { year: "AUG 2025", title: "BS — IIT Patna", sub: "Dual-degree programme", icon: "grad", tag: "EDUCATION", color: "#4a76c9", url: "https://www.linkedin.com/in/nmhariharan/" },
  { year: "MAY 2026 — NOW", title: "SAP Security Intern — Rinexis", sub: "SOD analyzer & ITGC audit tooling", icon: "brief", tag: "INTERNSHIP", color: "#3f9b46", url: "https://www.linkedin.com/in/nmhariharan/" },
  { year: "2026 — NOW", title: "Stealth Startup", sub: "Building a cloud-infrastructure product", icon: "cloud", tag: "STARTUP", color: "#9b6cc4", url: "https://www.linkedin.com/in/nmhariharan/" },
];

// honors list
export const BACK_HONORS = [
  { title: "Hacktoberfest Golden '25", sub: "Top-tier open-source contributor", icon: "code", tag: "OPEN SOURCE", color: "#3f9b46", url: "https://github.com/nothariharan" },
  { title: "YC Startup School '26", sub: "Y Combinator — India cohort", icon: "star", tag: "Y COMBINATOR", color: "#fb651e", url: "https://www.startupschool.org/" },
  { title: "10+ Hackathons · multiple wins", sub: "VahanLive, AMUHACKS, Cosmix & more", icon: "trophy", tag: "HACKATHONS", color: "#d99a2c", url: "https://www.linkedin.com/in/nmhariharan/" },
];

// skills grouped by type
export const BACK_SKILLS: { label: string; icons: string[] }[] = [
  { label: "AI / ML", icons: ["python", "pytorch", "opencv", "numpy", "pandas", "gemini", "huggingface", "openai"] },
  { label: "FULL-STACK", icons: ["react", "nextjs", "nodejs", "fastapi", "express", "typescript", "tailwindcss", "mongodb", "supabase"] },
  { label: "DEVOPS", icons: ["docker", "kubernetes", "git", "github", "linux", "bash", "nginx", "githubactions"] },
  { label: "CLOUD", icons: ["aws", "gcp", "vercel", "firebase", "supabase", "redis", "electron"] },
  { label: "TOOLS", icons: ["claude", "openai", "gemini", "cursor", "copilot", "kimi", "opencode", "huggingface"] },
];
