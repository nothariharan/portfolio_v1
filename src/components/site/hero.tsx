"use client";

import { motion } from "framer-motion";
import { SITE } from "./content";
import { Container, GitHubIcon, LinkedInIcon, MailIcon } from "./ui";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-14">
      {/* very subtle radial glow so the dark isn't flat */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #ebd67d 0%, transparent 70%)" }}
      />

      <Container className="relative">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="font-pixel text-[10px] tracking-[0.22em] text-portfolio-accent"
            >
              {SITE.role.toUpperCase()}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 font-serif text-6xl leading-[0.95] text-portfolio-text sm:text-7xl md:text-8xl"
            >
              {SITE.name}.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-portfolio-text/70 sm:text-xl"
            >
              {SITE.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex items-center gap-3"
            >
              <a
                href={SITE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-portfolio-text/70 transition-colors hover:border-portfolio-accent hover:text-portfolio-accent"
              >
                <GitHubIcon />
              </a>
              <a
                href={SITE.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-portfolio-text/70 transition-colors hover:border-portfolio-accent hover:text-portfolio-accent"
              >
                <LinkedInIcon />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-portfolio-text/70 transition-colors hover:border-portfolio-accent hover:text-portfolio-accent"
              >
                <MailIcon />
              </a>
            </motion.div>
          </div>

          {/* the pixel sprite sitting quietly — the only pixel art up here */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden justify-self-end md:block"
          >
            <motion.img
              src="/sprites/hari1.png"
              alt=""
              aria-hidden
              className="pixelated h-52 w-auto opacity-90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute bottom-8 left-6 flex items-center gap-3 text-portfolio-text/40 sm:left-8"
        >
          <span className="h-px w-10 bg-portfolio-text/30" />
          <span className="font-pixel text-[8px] tracking-widest">SCROLL</span>
        </motion.div>
      </Container>
    </section>
  );
}
