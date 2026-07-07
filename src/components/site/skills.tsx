"use client";

import { Section, Reveal, SectionHeading, TechTag } from "./ui";
import { BACK_SKILLS } from "../portfolio/data";

const LABELS: Record<string, string> = {
  "AI / ML": "ai / ml",
  "FULL-STACK": "full-stack",
  DEVOPS: "devops",
  CLOUD: "cloud",
  TOOLS: "tools",
};

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading title="skills & tools" />

      <div className="flex flex-col gap-5">
        {BACK_SKILLS.map((group, gi) => (
          <Reveal key={group.label} delay={gi * 0.04}>
            <div className="grid gap-2 sm:grid-cols-[110px_1fr] sm:items-start">
              <span className="pt-1 text-[12px] font-medium text-portfolio-muted">
                {LABELS[group.label] ?? group.label.toLowerCase()}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.icons.map((k) => (
                  <TechTag key={k} k={k} />
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
