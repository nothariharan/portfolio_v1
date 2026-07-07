"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionHeading, ExpIcon } from "./ui";
import { WORK, EDUCATION, type ExpRow } from "./portfolio-data";

function RowList({ rows }: { rows: ExpRow[] }) {
  return (
    <ul className="flex flex-col">
      {rows.map((r) => (
        <li
          key={`${r.title}-${r.org}`}
          className="flex items-start gap-4 border-t border-portfolio-border/70 py-5 first:border-t-0"
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-portfolio-border bg-portfolio-card text-portfolio-muted">
            <ExpIcon name={r.icon} />
          </span>
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

export function Experience() {
  const [tab, setTab] = useState<"work" | "education">("work");

  return (
    <Section id="experience">
      <SectionHeading
        title="the journey so far"
        action={
          <div className="flex items-center gap-1 rounded-lg border border-portfolio-border bg-portfolio-border/40 p-1">
            {(["work", "education"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 text-[12px] font-medium capitalize transition-colors cursor-pointer ${
                  tab === t ? "bg-portfolio-bg text-portfolio-text" : "text-portfolio-muted hover:text-portfolio-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <RowList rows={tab === "work" ? WORK : EDUCATION} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
}
