# my portfolio — developer card edition

this is my personal portfolio site and it's a bit different from the usual scroll-down-resume thing

you land on a **pokemon-style developer card** first — gba vibes, pixel fonts, the whole trainer card energy — and if you flip it and dig in you get to a **clean minimal portfolio** behind a white flash transition like you're walking into a battle

one site, two moods. menu screen and then the actual game

---

## what's on here

### the developer card (front)

the landing page at `/` is a flip-able card that looks like those old firered/leafgreen trainer cards but it's about me as a dev

- **name + sprite** — hariharan, pixel mascot on the right
- **focus row** — four attached slanted cards (ai/ml, web app, devops, exploring) with simple retro pixel icons baked into square tiles
- **stack** — core + infra tech logos in little 8-bit bordered squares
- **exp + currently** — experience readout and a desk-scene banner with progress bars for what i'm working on
- **footer badges** — earned gym badge slots (yc starter school in the first one, rest locked for now)

the card also **tilts on hover**, **floats idle**, and you can **zoom it** with +/- controls in the corner

### the data file (back)

flip the card and you get four slanted columns — projects, experience, honors, skills

hover a column and the readout panel below updates with real content pulled from my work. each section has links out to github, live demos, linkedin etc. there's a button to jump straight into the full portfolio on any tab

### main portfolio

`/portfolio` is the serious side — dark, typography-first, minimal. inspired by portfolios like ratneshc.com and abhiishekrathore.com

sections:
- hero + about
- projects (with a dedicated `/portfolio/projects` page too)
- skills
- experience
- achievements
- footer with a way back to the card

clicking through from the card runs a **white flash transition** — framer motion + a full viewport overlay that makes the page change feel intentional instead of just... navigating

there's also a skip button top-right if someone just wants the portfolio without the card theatrics. no judgment

---

## tech stack

| thing | why |
|---|---|
| **next.js 16** (app router) | routing, server stuff, easy deploy |
| **tailwind v4** | styling both the pixel card world and the minimal portfolio |
| **framer motion** | card flip, tilt, float, transition flash, scroll animations |
| **press start 2p + pokemon ds font** | authentic retro card typography |
| **typescript** | because i like my types |

deploy target is **vercel** — push to main and it goes live

---

## project structure (the useful bits)

```text
public/
  sprites/          pixel art for the card (mascot, focus icons, panel art)
  logos/            tech stack svg logos (thesvg.org via npm run sync:icons)

src/
  app/
    page.tsx                    trainer card landing
    portfolio/page.tsx          main portfolio
    portfolio/projects/page.tsx all projects view
  components/
    card/                       card front, back, badges, slots
    site/                       portfolio sections (hero, projects, skills...)
    transition/                 white flash overlay
  hooks/
    use-card-tilt.ts            mouse tracking for holographic tilt
    use-transition.tsx          flash animation + navigation
```

---

## run it locally

```bash
npm install
npm run dev
```

open [http://localhost:3000](http://localhost:3000)

card is at `/`, portfolio at `/portfolio`

### other commands

```bash
npm run build    # production build
npm run start    # run the built version
npm run lint     # eslint
```

---

## how the card front works (quick note)

the **focus icons** in `public/sprites/focus_*.png` are square pixel tiles — icon centered with matching pastel background color so they sit cleanly inside the slanted parallelogram cards without weird cropping

the **borders** on focus cards and footer badge slots use a stacked pixel border (colored inner ring → white highlight → dark outer edge → drop shadow) so they feel like actual gba ui elements not flat divs

---

## credits & inspo

- pokemon firered/leafgreen/emerald trainer card ui — the whole card concept
- [ratneshc.com](https://ratneshc.com/) and [abhiishekrathore.com](https://www.abhiishekrathore.com/) — minimal portfolio energy
- my obsidian second brain for the actual content about me

---

built by **hariharan** — if you're reading this you probably clicked through the card. hope the transition was fun
