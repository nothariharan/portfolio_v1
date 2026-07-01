"use client";

import { SITE } from "./content";
import { Container, Reveal, SectionHeading } from "./ui";
import { EDUCATION } from "../portfolio/data";

const FACTS = [
  { label: "Based in", value: "India · Remote" },
  { label: "Focus", value: "AI Agents · Web · Civic Tech" },
  { label: "Studying", value: "B.Tech CS — dual degree" },
  { label: "Currently", value: "SAP Security Intern · Rinexis" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading index="01" label="ABOUT" title="Who's behind the card" />

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="space-y-6">
              {SITE.about.map((p, i) => (
                <p key={i} className="text-lg leading-relaxed text-portfolio-text/75">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="divide-y divide-white/8 rounded-xl border border-white/8 bg-portfolio-card/60 px-6">
              {FACTS.map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-4 py-4">
                  <dt className="font-pixel text-[8px] tracking-wider text-portfolio-text/40">
                    {f.label.toUpperCase()}
                  </dt>
                  <dd className="text-right text-sm text-portfolio-text/85">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 px-1 text-xs leading-relaxed text-portfolio-text/40">{EDUCATION}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
