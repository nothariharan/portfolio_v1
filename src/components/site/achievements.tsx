"use client";

import { Section, Reveal, SectionHeading, ArrowIcon, RowMark } from "./ui";
import { FEATURED_ACHIEVEMENTS, ACHIEVEMENTS } from "./portfolio-data";
import { useTransition } from "@/hooks/use-transition";

export function Achievements() {
  const { startTransition } = useTransition();

  return (
    <Section id="achievements">
      <SectionHeading
        title="recent wins"
        action={
          <button
            onClick={() => startTransition("/portfolio/achievements")}
            className="inline-flex items-center gap-1 text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            all {ACHIEVEMENTS.length} achievements <ArrowIcon className="h-3.5 w-3.5" />
          </button>
        }
      />

      <ul className="flex flex-col">
        {FEATURED_ACHIEVEMENTS.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.05}>
            <li className="group flex items-start gap-4 border-t border-portfolio-border/70 py-4 first:border-t-0">
              <span className="mt-0.5 shrink-0">
                <RowMark name={a.icon} size={36} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-portfolio-text">{a.title}</h3>
                  <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{a.date}</span>
                </div>
                <p className="mt-0.5 text-[12px] text-portfolio-muted/80">{a.event}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-portfolio-muted">{a.note}</p>

                {a.tracks && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {a.tracks.map((t) => (
                      <span
                        key={t.label}
                        className="inline-flex items-center gap-1 rounded-md border border-portfolio-border bg-portfolio-border/40 px-2 py-0.5 font-mono text-[10px] text-portfolio-text/80"
                      >
                        <span className="text-portfolio-muted">{t.label}</span> {t.result}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
