"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeading, ExpIcon, ArrowIcon } from "./ui";
import { WORK, EDUCATION, type ExpRow } from "./portfolio-data";
import { useTransition } from "@/hooks/use-transition";

function RowList({ rows }: { rows: ExpRow[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li
          key={`${r.title}-${r.org}`}
          className="flex items-start gap-4 border-t border-portfolio-border/70 py-5 first:border-t-0"
        >
          {r.logo ? (
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-portfolio-border bg-black">
              <img
                src={r.logo}
                alt=""
                aria-hidden
                className={`object-contain ${r.logo.endsWith(".png") ? "h-full w-full object-cover" : "h-[55%] w-[55%]"}`}
              />
            </span>
          ) : (
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-portfolio-border bg-portfolio-card text-portfolio-muted">
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

const TABS = [
  { id: "work", label: "work" },
  { id: "education", label: "education" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function Experience() {
  const [tab, setTab] = useState<Tab>("work");
  const { startTransition } = useTransition();

  return (
    <Section id="experience">
      <SectionHeading
        title="the journey so far"
        action={
          <button
            onClick={() => startTransition("/portfolio/experience")}
            className="inline-flex items-center gap-1 text-[13px] text-portfolio-muted transition-colors hover:text-portfolio-text cursor-pointer"
          >
            full breakdown <ArrowIcon className="h-3.5 w-3.5" />
          </button>
        }
      />

      <div className="mb-2 flex items-center gap-1 self-start rounded-lg border border-portfolio-border bg-portfolio-border/40 p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1 text-[12px] font-medium capitalize transition-colors cursor-pointer ${
              tab === t.id ? "bg-portfolio-bg text-portfolio-text" : "text-portfolio-muted hover:text-portfolio-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === "work" && <RowList rows={WORK} />}
            {tab === "education" && <RowList rows={EDUCATION} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => startTransition("/portfolio/experience")}
        className="group mt-5 flex w-full items-center justify-between gap-3 rounded-lg border border-portfolio-border bg-portfolio-card px-4 py-3 text-left transition-colors hover:border-white/20 cursor-pointer"
      >
        <span className="text-[13px] text-portfolio-muted">
          want the full story? roles, education, and every upstream pr.
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-portfolio-text">
          the journey <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>
    </Section>
  );
}
