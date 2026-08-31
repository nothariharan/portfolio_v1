"use client";

import { useMemo, useState } from "react";
import { Section, Reveal, SectionHeading, ArrowIcon } from "./ui";
import { ProjectCard } from "./project-card";
import { FEATURED_PROJECTS, PROJECTS, type FeaturedLane } from "./portfolio-data";
import { useTransition } from "@/hooks/use-transition";

const LANES: { id: "all" | FeaturedLane; label: string }[] = [
  { id: "all", label: "all" },
  { id: "people", label: "in use" },
  { id: "systems", label: "systems" },
  { id: "civic", label: "civic" },
];

export function Projects() {
  const { startTransition } = useTransition();
  const [lane, setLane] = useState<(typeof LANES)[number]["id"]>("all");

  const shown = useMemo(
    () => (lane === "all" ? FEATURED_PROJECTS : FEATURED_PROJECTS.filter((p) => p.lane === lane)),
    [lane],
  );

  return (
    <Section id="projects">
      <SectionHeading
        title="featured work"
        action={
          <button
            onClick={() => startTransition("/portfolio/projects")}
            className="inline-flex items-center gap-1 text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            all {PROJECTS.length} projects <ArrowIcon className="h-3.5 w-3.5" />
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {LANES.map((l) => (
          <button
            key={l.id}
            onClick={() => setLane(l.id)}
            className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors cursor-pointer ${
              lane === l.id
                ? "bg-portfolio-text text-portfolio-bg"
                : "border border-portfolio-border text-portfolio-muted hover:border-white/25 hover:text-portfolio-text"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.06}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
