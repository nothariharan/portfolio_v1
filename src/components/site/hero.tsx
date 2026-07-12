"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "./content";
import { STATS } from "./portfolio-data";
import { Container, GitHubIcon, LinkedInIcon, MailIcon } from "./ui";

// sitting loop for the portfolio hero — frames are already lined up on the feet
// s1 typing / s2 typing shift / s3 grab coffee / s4 sip / s5 back to typing
const SIT_FRAMES = [
  "/sprites/sit-norm/s1.png",
  "/sprites/sit-norm/s2.png",
  "/sprites/sit-norm/s3.png",
  "/sprites/sit-norm/s4.png",
  "/sprites/sit-norm/s5.png",
];
// type for a bit, reach for coffee, sip twice, then back to work
const SIT_SEQ = [0, 0, 0, 1, 1, 2, 3, 3, 4, 4, 0];
const SIT_MS = 750;

function SittingSprite() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), SIT_MS);
    return () => clearInterval(id);
  }, []);

  const src = SIT_FRAMES[SIT_SEQ[tick % SIT_SEQ.length]];

  return (
    <img
      src={src}
      alt="Hariharan"
      className="pixelated h-52 w-auto object-contain object-bottom select-none"
      draggable={false}
    />
  );
}

const fade = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const social =
  "flex h-9 w-9 items-center justify-center rounded-md border border-portfolio-border text-portfolio-muted transition-colors hover:border-white/25 hover:text-portfolio-text";

export function Hero() {
  return (
    <section id="about" className="scroll-mt-24 pt-10 pb-12 sm:pt-14">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <motion.div
              {...fade}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-border bg-portfolio-border/30 px-3 py-1 font-mono text-[11px] text-portfolio-muted"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              open to internships &amp; collabs
            </motion.div>

            <motion.h1
              {...fade}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl font-semibold leading-tight tracking-tight text-portfolio-text sm:text-[2.7rem]"
            >
              hey, i&apos;m {SITE.name.toLowerCase()}. <span className="inline-block">👋</span>
            </motion.h1>

            <motion.p
              {...fade}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 font-mono text-[13px] text-portfolio-muted"
            >
              {SITE.role} · dual-degree cs · {SITE.location} 🇮🇳
            </motion.p>

            <motion.p
              {...fade}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-lg text-[15px] leading-relaxed text-portfolio-muted"
            >
              {SITE.intro}
            </motion.p>

            <motion.div
              {...fade}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-portfolio-text px-4 py-2 text-[13px] font-medium text-portfolio-bg transition-colors hover:bg-portfolio-text/90"
              >
                <MailIcon className="h-4 w-4" /> get in touch
              </a>
              <a href={SITE.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={social}>
                <GitHubIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={SITE.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={social}>
                <LinkedInIcon className="h-[18px] w-[18px]" />
              </a>
            </motion.div>
          </div>

          {/* framed pixel portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="hidden shrink-0 rounded-xl border border-portfolio-border bg-gradient-to-b from-white/[0.05] to-transparent p-3 sm:block"
          >
            <SittingSprite />
          </motion.div>
        </div>

        {/* about + stats */}
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 space-y-3 border-t border-portfolio-border/70 pt-6"
        >
          {SITE.about.map((p) => (
            <p key={p.slice(0, 24)} className="max-w-2xl text-[14px] leading-relaxed text-portfolio-muted">
              {p}
            </p>
          ))}
        </motion.div>

        <motion.dl
          {...fade}
          transition={{ duration: 0.6, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 grid max-w-md grid-cols-3 gap-3"
        >
          {STATS.map((s) => (
            <div key={s.label} className="rounded-lg border border-portfolio-border bg-portfolio-card px-3 py-3">
              <dt className="font-display text-xl font-semibold text-portfolio-text">{s.value}</dt>
              <dd className="mt-0.5 font-mono text-[10px] leading-tight text-portfolio-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  );
}
