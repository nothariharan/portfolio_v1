"use client";

import { Container, Reveal, TechTag } from "@/components/site/ui";
import { BACK_SKILLS } from "@/components/portfolio/data";
import { useTransition } from "@/hooks/use-transition";

const LABELS: Record<string, string> = {
  "AI / ML": "ai / ml",
  "FULL-STACK": "full-stack",
  DEVOPS: "devops",
  CLOUD: "cloud",
  TOOLS: "tools",
};

export default function SkillsPage() {
  const { startTransition } = useTransition();

  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">skills &amp; tools</h1>
        <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
          the stack i reach for — from ai agents and full-stack to the devops glue that ships it.
        </p>

        <div className="mt-8 flex flex-col gap-6">
          {BACK_SKILLS.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.05}>
              <div className="grid gap-3 border-t border-portfolio-border/70 pt-5 first:border-t-0 first:pt-0 sm:grid-cols-[130px_1fr] sm:items-start">
                <span className="pt-1 font-mono text-[12px] uppercase tracking-wider text-portfolio-muted">
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

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => startTransition("/portfolio/projects")}
            className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
          >
            see all projects →
          </button>
          <button
            onClick={() => startTransition("/portfolio/experience")}
            className="rounded-md border border-portfolio-border px-4 py-2 text-[13px] text-portfolio-text/80 transition-colors hover:border-white/25 hover:text-portfolio-text cursor-pointer"
          >
            the journey so far →
          </button>
        </div>
      </Container>
    </main>
  );
}
