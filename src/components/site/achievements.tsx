"use client";

import { Container, Reveal, SectionHeading } from "./ui";
import { HONORS, type Honor } from "../portfolio/data";

// badge mapping to accent colors
const BADGE_COLOR: Record<Honor["badge"], string> = {
  Winner: "#ebd67d",
  "Runner Up": "#c9a15a",
  Finalist: "#4ec9b0",
  Contributor: "#5aa9d6",
  Certificate: "#a88ad6",
  Participant: "#8a8f96",
};

// custom glyph for each honor shape
const SHAPE_GLYPH: Record<Honor["shape"], string> = {
  trophy: "🏆",
  medal: "🥇",
  shield: "🛡",
  code: "⌘",
  cert: "❖",
  star: "★",
};

export function Achievements() {
  return (
    <section id="achievements" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading index="05" label="ACHIEVEMENTS" title="Milestones earned" />

        <div className="grid gap-4 sm:grid-cols-2">
          {HONORS.map((h, i) => {
            const color = BADGE_COLOR[h.badge];
            return (
              <Reveal key={h.title} delay={(i % 2) * 0.06}>
                <div className="flex h-full items-start gap-4 rounded-xl border border-white/8 bg-portfolio-card/60 p-5 transition-colors hover:border-white/20">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg"
                    style={{ background: `${color}18`, color }}
                  >
                    {SHAPE_GLYPH[h.shape]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[15px] text-portfolio-text">{h.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-portfolio-text/60">{h.sub}</p>
                    <div className="mt-3 flex items-center gap-2.5">
                      <span
                        className="rounded-full px-2 py-0.5 font-pixel text-[7px] tracking-wide"
                        style={{ color, background: `${color}1a` }}
                      >
                        {h.badge.toUpperCase()}
                      </span>
                      <span className="text-xs text-portfolio-text/40">{h.date}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
