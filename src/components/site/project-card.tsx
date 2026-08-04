"use client";

import { CATEGORY_META, type SiteProject } from "./portfolio-data";
import { TechTag, PillLink, GitHubIcon, ArrowIcon } from "./ui";

const MAX_TECH = 4;

// screenshot cover for deployed apps, styled gradient fallback for the rest
function Cover({ project }: { project: SiteProject }) {
  const meta = CATEGORY_META[project.category];
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-portfolio-border bg-portfolio-bg">
      {project.shot ? (
        <img
          src={project.shot}
          alt={`${project.name} screenshot`}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background: `radial-gradient(120% 120% at 15% 0%, ${meta.color}2e, transparent 60%), linear-gradient(160deg, #0a0f1c, #030712)`,
          }}
        >
          <span
            className="font-display text-3xl font-semibold tracking-tight text-white/85"
            style={{ textShadow: `0 0 32px ${meta.color}55` }}
          >
            {project.name}
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-4 select-none text-[7rem] leading-none opacity-[0.07]"
            style={{ color: meta.color }}
          >
            {meta.glyph}
          </span>
        </div>
      )}

      {/* award badge */}
      {project.award && (
        <span className="absolute left-2.5 top-2.5 rounded-md bg-black/70 px-2 py-1 font-mono text-[10px] font-medium text-white backdrop-blur-sm ring-1 ring-white/10">
          {project.award}
        </span>
      )}

      {/* category chip */}
      <span
        className="absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5 font-mono text-[10px] font-medium text-white/90 backdrop-blur-sm ring-1 ring-white/10"
        style={{ background: `${meta.color}33` }}
      >
        {project.category}
      </span>
    </div>
  );
}

export function ProjectCard({ project }: { project: SiteProject }) {
  const extra = project.tech.length - MAX_TECH;
  return (
    <article
      id={project.slug}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-portfolio-border bg-portfolio-card transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(0,0,0,0.45)] scroll-mt-24"
    >
      <Cover project={project} />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[16px] font-semibold tracking-tight text-portfolio-text">
            {project.name}
          </h3>
          <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{project.date}</span>
        </div>

        <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-portfolio-muted">
          {project.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, MAX_TECH).map((k) => (
            <TechTag key={k} k={k} />
          ))}
          {extra > 0 && (
            <span className="inline-flex items-center rounded-md border border-portfolio-border bg-portfolio-border/40 px-2 py-1 text-[11px] font-medium text-portfolio-muted">
              +{extra}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          {project.repo && (
            <PillLink href={project.repo}>
              <GitHubIcon className="h-3.5 w-3.5" /> Source
            </PillLink>
          )}
          {project.live && (
            <PillLink href={project.live} primary={!project.repo}>
              <ArrowIcon className="h-3.5 w-3.5" /> Live
            </PillLink>
          )}
        </div>
      </div>
    </article>
  );
}
