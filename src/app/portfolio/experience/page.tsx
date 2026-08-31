"use client";

import { Container, ExpIcon } from "@/components/site/ui";
import { WORK, EDUCATION, type ExpRow } from "@/components/site/portfolio-data";
import { OssOrgList } from "@/components/site/oss-orgs";
import { useTransition } from "@/hooks/use-transition";

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
          professional work, education, and upstream oss — click an org to see the prs.
        </p>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">
          professional work
        </h2>
        <div className="mt-2">
          <RoleBlock rows={WORK} />
        </div>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">education</h2>
        <div className="mt-2">
          <RoleBlock rows={EDUCATION} />
        </div>

        <h2 className="mt-10 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">open source</h2>
        <p className="mt-2 max-w-xl text-[13px] text-portfolio-muted">
          upstream contribs, not my own repos. graphify #2422 shipped in v0.9.46 (cherry-pick, not a github merge).
        </p>
        <div className="mt-2">
          <OssOrgList />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
