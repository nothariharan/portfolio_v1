"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// ------------------------------------------------------------------
// Shared primitives for the minimal (tedawf-inspired) portfolio.
// Narrow centered column, grayscale palette, subtle blur-fade reveals.
// ------------------------------------------------------------------

// centered ~768px content column
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-3xl px-6 sm:px-8 ${className}`}>{children}</div>;
}

// consistent section rhythm + scroll offset for the sticky header
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-10 sm:py-12 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

// subtle blur-fade on scroll
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// compact lowercase section header with an optional right-side action
export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 className="text-base font-semibold tracking-tight text-portfolio-text">{title}</h2>
      {action}
    </div>
  );
}

// svg files that actually exist in /public/logos — anything else renders as text
export const LOGO_KEYS = new Set([
  "aws", "bash", "claude", "copilot", "cpp", "css3", "cursor", "dart", "docker",
  "electron", "express", "fastapi", "firebase", "gcp", "gemini", "git", "github",
  "githubactions", "html5", "javascript", "kubernetes", "linux", "mongodb", "nextjs",
  "nginx", "nodejs", "numpy", "openai", "opencv", "pandas", "postgresql", "python",
  "pytorch", "react", "redis", "rust", "supabase", "tailwindcss", "typescript", "vercel",
]);

// pretty display names for tech keys (logo or text)
const NAMES: Record<string, string> = {
  nextjs: "Next.js",
  nodejs: "Node.js",
  fastapi: "FastAPI",
  html5: "HTML5",
  css3: "CSS3",
  tailwindcss: "Tailwind",
  githubactions: "Actions",
  postgresql: "SQL",
  opencv: "OpenCV",
  pytorch: "PyTorch",
  cpp: "C++",
  javascript: "JavaScript",
  typescript: "TypeScript",
  aws: "AWS",
  gcp: "GCP",
  // text-only (no logo file) —
  adk: "Google ADK",
  deepgram: "Deepgram",
  socketio: "Socket.io",
  ffmpeg: "FFmpeg",
  streamlit: "Streamlit",
  unity: "Unity",
  csharp: "C#",
  flutter: "Flutter",
  langgraph: "LangGraph",
  bedrock: "Bedrock",
  vite: "Vite",
  zustand: "Zustand",
};

export const prettyTech = (k: string) => NAMES[k] ?? k.charAt(0).toUpperCase() + k.slice(1);

// brand logo on a light tile so both dark and colored logos stay visible
export function LogoChip({ k, size = 24, label }: { k: string; size?: number; label?: string }) {
  const icon = Math.round(size * 0.66);
  return (
    <span
      title={label ?? prettyTech(k)}
      className="flex shrink-0 items-center justify-center rounded-[5px] bg-[#f4f3ef] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
      style={{ width: size, height: size }}
    >
      <img
        src={`/logos/${k}.svg`}
        alt={label ?? prettyTech(k)}
        className="object-contain"
        style={{ width: icon, height: icon }}
      />
    </span>
  );
}

// small tech pill: icon tile + label when a logo exists, otherwise a clean text-only pill
export function TechTag({ k, label }: { k: string; label?: string }) {
  const hasLogo = LOGO_KEYS.has(k);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-portfolio-border bg-portfolio-border/40 text-[11px] font-medium text-portfolio-text/85 ${
        hasLogo ? "py-1 pl-1 pr-2" : "px-2 py-1"
      }`}
    >
      {hasLogo && <LogoChip k={k} size={18} />}
      {label ?? prettyTech(k)}
    </span>
  );
}

// small bordered link button used on cards / hero
export function PillLink({
  href,
  onClick,
  children,
  primary = false,
  external = true,
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  primary?: boolean;
  external?: boolean;
}) {
  const cls = `inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
    primary
      ? "border-transparent bg-portfolio-text text-portfolio-bg hover:bg-portfolio-text/90"
      : "border-portfolio-border bg-portfolio-card text-portfolio-text/80 hover:border-white/25 hover:text-portfolio-text"
  }`;
  if (onClick) {
    return (
      <button onClick={onClick} className={`${cls} cursor-pointer`}>
        {children}
      </button>
    );
  }
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>
      {children}
    </a>
  );
}

// ------------------------------------------------------------------
// Inline icons (kept dependency-free)
// ------------------------------------------------------------------

export function GitHubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.05 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function LinkedInIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

// experience/education row icons, chosen by a key
export function ExpIcon({ name, className = "h-[18px] w-[18px]" }: { name: string; className?: string }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "laptop":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="4" y="5" width="16" height="11" rx="1.5" />
          <path d="M2 20h20" />
        </svg>
      );
    case "brain":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V4Z" />
          <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V4Z" />
        </svg>
      );
    case "globe":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />
        </svg>
      );
    case "grad":
    case "hands":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 4 2 9l10 5 10-5-10-5Z" />
          <path d="M5 11v5c0 1.1 3.1 2.5 7 2.5s7-1.4 7-2.5v-5" />
        </svg>
      );
    case "brief":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
