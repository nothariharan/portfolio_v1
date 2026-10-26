"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SITE } from "./content";
import { useContactCard } from "./contact-card";
import { Container, GitHubIcon, LinkedInIcon, MailIcon } from "./ui";
// links sit in the note

const MARIO_GIFS =[
  "/sprites/gifs/mario-start.gif",
  "/sprites/gifs/mario-idle.gif",
  "/sprites/gifs/mario-dance.gif",
] as const;

const SONIC_GIFS =[
  "/sprites/gifs/sonic-thumbs.gif",
  "/sprites/gifs/sonic-wave.gif",
  "/sprites/gifs/sonic-logo.gif",
] as const;

const RANDOM_KEYS =["pikachu", "elmo", "the-end", "sonic"] as const;

const RANDOM_SRC: Record<Exclude<(typeof RANDOM_KEYS)[number], "sonic">, string> ={
  pikachu: "/sprites/gifs/pikachu.gif",
  elmo: "/sprites/gifs/elmo.gif",
  "the-end": "/sprites/gifs/the-end.gif",
};

const GIF_HOLD_MS =1_500;

type RandomKey =(typeof RANDOM_KEYS)[number];

type ReelState ={
  phase: "mario" | "random";
  marioIdx: number;
  bag: RandomKey[];
  bagIdx: number;
  sonicSrc: string;
};

function shuffleKeys(keys: RandomKey[]): RandomKey[] {
  const next =[...keys];
  for (let i =next.length - 1; i > 0; i--) {
    const j =Math.floor(Math.random() * (i + 1));
    const a =next[i];
    const b =next[j];
    if (a === undefined || b === undefined) continue;
    next[i] =b;
    next[j] =a;
  }
  return next;
}

function pickSonic(): string {
  return SONIC_GIFS[Math.floor(Math.random() * SONIC_GIFS.length)] ?? SONIC_GIFS[0];
}

function nextReel(state: ReelState): ReelState {
  if (state.phase === "mario") {
    if (state.marioIdx < MARIO_GIFS.length - 1) {
      return { ...state, marioIdx: state.marioIdx + 1 };
    }
    const bag =shuffleKeys([...RANDOM_KEYS]);
    return { phase: "random", marioIdx: 0, bag, bagIdx: 0, sonicSrc: pickSonic() };
  }
  if (state.bagIdx < state.bag.length - 1) {
    const bagIdx =state.bagIdx + 1;
    return {
      ...state,
      bagIdx,
      sonicSrc: state.bag[bagIdx] === "sonic" ? pickSonic() : state.sonicSrc,
    };
  }
  return { ...state, phase: "mario", marioIdx: 0 };
}

function reelSrc(state: ReelState): string {
  if (state.phase === "mario") {
    return MARIO_GIFS[state.marioIdx] ?? MARIO_GIFS[0];
  }
  const key =state.bag[state.bagIdx];
  if (key === "sonic") return state.sonicSrc;
  return RANDOM_SRC[key ?? "pikachu"];
}

function GifReel() {
  const [reel, setReel] =useState<ReelState>({
    phase: "mario",
    marioIdx: 0,
    bag: [...RANDOM_KEYS],
    bagIdx: 0,
    sonicSrc: SONIC_GIFS[0],
  });

  useEffect(() => {
    const id =window.setTimeout(() => setReel(nextReel), GIF_HOLD_MS);
    return () => window.clearTimeout(id);
  }, [reel]);

  const src =reelSrc(reel);

  return (
    <motion.button
      type="button"
      aria-label="next gif"
      onClick={() => setReel(nextReel)}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="hidden h-[22rem] w-[20rem] shrink-0 cursor-pointer items-end justify-center overflow-hidden rounded-xl border border-portfolio-border bg-gradient-to-b from-white/[0.05] to-transparent px-4 py-3 sm:flex"
    >
      <img key={src} src={src} alt="" className="pixelated h-[19rem] w-auto max-w-full object-contain object-bottom select-none" draggable={false} />
    </motion.button>
  );
}

const fade= {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const social =
  "flex h-9 w-9 items-center justify-center rounded-md border border-portfolio-border text-portfolio-muted transition-colors hover:border-white/25 hover:text-portfolio-text";

export function Hero() {
  const contact= useContactCard();

  return (
    <section id ="about" className= "scroll-mt-24 pt-10 pb-12 sm:pt-14">
      {/* icons stay on the tile */}
      <Container>
        <div className ="flex items-start justify-between gap-6">
          <div className= "min-w-0">
            <motion.div {...fade} transition ={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className= "mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-border bg-portfolio-border/30 px-3 py-1 font-mono text-[11px] text-portfolio-muted">
              <span className ="relative flex h-1.5 w-1.5">
                <span className= "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className ="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              open to internships &amp; collabs
            </motion.div>

            <motion.h1 {...fade} transition= {{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }} className ="font-display text-3xl font-semibold leading-tight tracking-tight text-portfolio-text sm:text-[2.7rem]">
              hey, i&apos;m {SITE.name.toLowerCase()}. <span className= "inline-block">👋</span>
            </motion.h1>

            <motion.p {...fade} transition ={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }} className= "mt-3 font-mono text-[13px] text-portfolio-muted">
              {SITE.role} · {SITE.location}
            </motion.p>

            <motion.p {...fade} transition ={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }} className= "mt-4 max-w-lg text-[15px] leading-relaxed text-portfolio-muted">
              {SITE.intro}
            </motion.p>

            <motion.div {...fade} transition ={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }} className= "mt-6 flex flex-wrap items-center gap-2.5">
              <button type ="button" data-contact-trigger onClick= {() => contact.toggle()} className ="inline-flex items-center gap-2 rounded-md bg-portfolio-text px-4 py-2 text-[13px] font-medium text-portfolio-bg transition-colors hover:bg-portfolio-text/90 cursor-pointer">
                <MailIcon className= "h-4 w-4" /> get in touch
              </button>
              <a href ={SITE.socials.github} target= "_blank" rel ="noopener noreferrer" aria-label= "GitHub" className ={social}>
                <GitHubIcon className= "h-[18px] w-[18px]" />
              </a>
              <a href ={SITE.socials.linkedin} target= "_blank" rel ="noopener noreferrer" aria-label= "LinkedIn" className ={social}>
                <LinkedInIcon className= "h-[18px] w-[18px]" />
              </a>
            </motion.div>
          </div>

          <GifReel />
        </div>

        {/* about */}
        <motion.div {...fade} transition ={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className= "mt-8 space-y-3 border-t border-portfolio-border/70 pt-6">
          {SITE.about.map((p) => (
            <p key ={p.slice(0, 24)} className= "max-w-2xl text-[14px] leading-relaxed text-portfolio-muted">
              {p}
            </p>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
