"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  OSS_HACKTOBERFEST,
  OSS_OTHER,
  OSS_UPSTREAM,
  type OssGroup,
  type OssOrg,
  type OssPr,
  type OssPrState,
} from "./portfolio-data";

const STATE_STYLE: Record<OssPrState, { label: string; color: string }> = {
  merged: { label: "merged", color: "#34d399" },
  shipped: { label: "shipped", color: "#38bdf8" },
  open: { label: "open", color: "#fbbf24" },
};

function OrgMark({ org }: { org: OssOrg }) {
  const isSvg = org.logo.endsWith(".svg");
  return (
    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-portfolio-border bg-black">
      <img
        src={org.logo}
        alt=""
        aria-hidden
        className={isSvg ? "h-[55%] w-[55%] object-contain" : "h-full w-full object-cover"}
        style={org.invert ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </span>
  );
}

function PrRow({ pr }: { pr: OssPr }) {
  const meta = STATE_STYLE[pr.state];
  return (
    <li>
      <a
        href={pr.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 rounded-md px-1 py-2 transition-colors hover:bg-white/[0.03]"
      >
        <span className="mt-0.5 shrink-0 font-mono text-[12px] text-portfolio-muted">#{pr.number}</span>
        <span className="min-w-0 flex-1 text-[13px] leading-relaxed text-portfolio-text/90 group-hover:text-portfolio-text">
          {pr.title}
          {pr.note && <span className="ml-1.5 font-mono text-[11px] text-portfolio-muted">· {pr.note}</span>}
        </span>
        <span
          className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
          style={{ background: `${meta.color}22`, color: meta.color }}
        >
          {meta.label}
        </span>
      </a>
    </li>
  );
}

function OrgAccordion({ org }: { org: OssOrg }) {
  const [open, setOpen] = useState(false);
  const count = org.prs.length;
  const label = count === 1 ? "1 pr" : `${count} prs`;

  return (
    <li className="border-t border-portfolio-border/70 first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start gap-4 py-4 text-left"
      >
        <OrgMark org={org} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[15px] font-semibold text-portfolio-text">
              {org.name}
              {org.note && <span className="font-normal text-portfolio-muted"> · {org.note}</span>}
            </h3>
            <span className="shrink-0 font-mono text-[11px] text-portfolio-muted">{label}</span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-portfolio-muted">{org.repo}</p>
        </div>
        <span
          className={`mt-2 shrink-0 text-portfolio-muted transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden pb-3 pl-14"
          >
            {org.prs.map((pr) => (
              <PrRow key={pr.number} pr={pr} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

const GROUP_META: { id: OssGroup; label?: string; orgs: OssOrg[] }[] = [
  { id: "upstream", orgs: OSS_UPSTREAM },
  { id: "hacktoberfest", label: "hacktoberfest 2025", orgs: OSS_HACKTOBERFEST },
  { id: "other", label: "other", orgs: OSS_OTHER },
];

export function OssOrgList({ groups }: { groups?: OssGroup[] }) {
  const sections = GROUP_META.filter((s) => (!groups || groups.includes(s.id)) && s.orgs.length > 0);

  return (
    <div>
      {sections.map((section, i) => (
        <div key={section.id} className={i > 0 ? "mt-6" : undefined}>
          {section.label && (
            <p className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-portfolio-muted">
              {section.id === "hacktoberfest" && (
                <span className="inline-flex items-center gap-1 normal-case">
                  <img src="/logos/digitalocean.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
                  <img src="/logos/github.svg" alt="" aria-hidden className="h-3.5 w-3.5 invert" />
                </span>
              )}
              {section.label}
            </p>
          )}
          <ul className="flex flex-col">
            {section.orgs.map((org) => (
              <OrgAccordion key={org.id} org={org} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
