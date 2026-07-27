"use client";

import { Container, Reveal, ExpIcon } from "@/components/site/ui";
import {
  WORK,
  EDUCATION,
  JOURNEY,
  JOURNEY_KIND_META,
  type ExpRow,
} from "@/components/site/portfolio-data";
import { useTransition } from "@/hooks/use-transition";

// timeline stays career-focused — work + awards, not every ship log
const TIMELINE = JOURNEY.filter((j) => j.kind === "work" || j.kind === "win" || j.kind === "milestone");

function RoleBlock({ rows }: { rows: ExpRow[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li
          key={`${r.title}-${r.org}`}
          className="flex items-start gap-4 border-t border-portfolio-border/70 py-5 first:border-t-0"
        >
          {r.logo ? (
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-portfolio-border bg-black">
              <img
                src={r.logo}
                alt=""
                aria-hidden
                className={`object-contain ${r.logo.endsWith(".png") ? "h-full w-full object-cover" : "h-[55%] w-[55%]"}`}
              />
            </span>
          ) : (
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-portfolio-border bg-portfolio-card text-portfolio-muted">
              <ExpIcon name={r.icon} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[15px] font-semibold text-portfolio-text">
                {r.title} <span className="text-portfolio-muted">· {r.org}</span>
              </h3>
              <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{r.period}</span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-portfolio-muted">{r.desc}</p>
            {r.bullets && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {r.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-[13px] leading-relaxed text-portfolio-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-portfolio-muted/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ExperiencePage() {
  const { startTransition } = useTransition();

  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">the journey so far</h1>
        <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
          work, education, and the wins along the way — projects live on their own page.
        </p>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">work</h2>
        <div className="mt-2">
          <RoleBlock rows={WORK} />
        </div>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">education</h2>
        <div className="mt-2">
          <RoleBlock rows={EDUCATION} />
        </div>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">timeline</h2>
        <ol className="mt-4 flex flex-col">
          {TIMELINE.map((j, i) => {
            const meta = JOURNEY_KIND_META[j.kind];
            return (
              <Reveal key={`${j.date}-${j.title}`} delay={(i % 6) * 0.04}>
                <li className="relative flex gap-4 pb-6 pl-1">
                  <div className="relative flex w-6 shrink-0 justify-center">
                    <span
                      className="absolute top-1 bottom-[-24px] w-px"
                      style={{ background: "var(--color-portfolio-border)" }}
                    />
                    <span
                      className="relative z-10 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-portfolio-border bg-portfolio-card text-[11px]"
                      style={{ boxShadow: `0 0 0 3px ${meta.color}22` }}
                    >
                      {j.icon}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="text-[15px] font-semibold text-portfolio-text">{j.title}</h3>
                      <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{j.date}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                        style={{ background: `${meta.color}22`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-portfolio-muted">{j.desc}</p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => startTransition("/portfolio/projects")}
            className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
          >
            see all projects →
          </button>
          <button
            onClick={() => startTransition("/portfolio/achievements")}
            className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
          >
            see all achievements →
          </button>
        </div>
      </Container>
    </main>
  );
}
