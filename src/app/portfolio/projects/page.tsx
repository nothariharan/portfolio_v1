"use client";

import { useEffect, useMemo, useState } from "react";
import { Container, Reveal } from "@/components/site/ui";
import { ProjectCard } from "@/components/site/project-card";
import { PROJECTS, CATEGORIES, type Category } from "@/components/site/portfolio-data";

type Filter = "All" | Category;

export default function ProjectsDirectory() {
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = ["All", ...CATEGORIES];
  const shown = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  // honor win strip deep-links land on /portfolio/projects#slug
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [shown]);

  return (
    <main className="pt-10 pb-16">
      <Container>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-portfolio-text">everything i&apos;ve shipped</h1>
        <p className="mt-2 max-w-xl text-[15px] text-portfolio-muted">
          {PROJECTS.length} projects across ai agents, civic tech, dev tools and ml research — most of
          them built (and deployed) at 3am.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                filter === f
                  ? "border-transparent bg-portfolio-text text-portfolio-bg"
                  : "border-portfolio-border text-portfolio-muted hover:border-white/25 hover:text-portfolio-text"
              }`}
            >
              {f === "All" ? `all · ${PROJECTS.length}` : f.toLowerCase()}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {shown.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.05}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </main>
  );
}
