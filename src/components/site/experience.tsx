"use client";

import { Container, Reveal, SectionHeading } from "./ui";
import { TIMELINE } from "../portfolio/data";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24 sm:py-32">
      <Container>
        <SectionHeading index="02" label="EXPERIENCE" title="The journey so far" />

        <div className="relative">
          {/* rail */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-white/10" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="relative pl-10">
                  {/* node */}
                  <span
                    className={`absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 ${
                      item.current
                        ? "border-portfolio-accent bg-portfolio-accent/25"
                        : "border-white/25 bg-portfolio-bg"
                    }`}
                  />
                  <span className="font-pixel text-[9px] tracking-wider text-portfolio-accent">
                    {item.period}
                  </span>
                  <h3 className="mt-2 text-xl text-portfolio-text">{item.title}</h3>
                  <p className="mt-1.5 max-w-lg text-portfolio-text/60">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
