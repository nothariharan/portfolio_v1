"use client";

import { Container, Reveal, SectionHeading, LogoChip } from "./ui";
import { BACK_SKILLS } from "../portfolio/data";

// pretty display names for logo keys
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
};

const pretty = (k: string) => NAMES[k] ?? k.charAt(0).toUpperCase() + k.slice(1);

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading index="04" label="SKILLS" title="Tools in my belt" />

        <div className="space-y-10">
          {BACK_SKILLS.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <div className="grid gap-4 border-t border-white/8 pt-6 sm:grid-cols-[160px_1fr]">
                <span className="font-pixel text-[10px] tracking-wider text-portfolio-accent">
                  {group.label}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {group.icons.map((k) => (
                    <span
                      key={k}
                      className="flex items-center gap-2 rounded-lg border border-white/8 bg-portfolio-card/60 py-1.5 pl-1.5 pr-3 transition-colors hover:border-white/20"
                    >
                      <LogoChip k={k} size={26} label={pretty(k)} />
                      <span className="text-sm text-portfolio-text/80">{pretty(k)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
