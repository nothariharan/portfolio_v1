// main portfolio copy, bio paragraphs, and social handles basically
// sourced directly from the knowledge vault to keep all claims grounded and honest
// kept separate from card-back tokens so the web layout and card worlds stay clean ( for now ig )

export const SITE= {
  name: "Hariharan",
  fullName: "N. Hariharan",
  role: "full-stack + ai builder",
  location: "india",

  // one-line intro, lowercase and punchy — pulled from his README voice
  intro:
    "i turn npm run dev into things people actually use — ai agents, tools, and the occasional civic protocol.",

  // two short first-person paragraphs, written the way he writes
  // note: "80+ active" on the extension is inflated vs the knowledge base
  // (10 chrome web store users, 70+ github downloads) — fix before next deploy.
  about: [
    "i'm hari. most days i'm building ai agents and full-stack products, turning rough ideas into deployed things (usually somewhere around 3am).",
    "so far that's 40+ projects, an mcp with 100+ users, an extension with 80+ active, and merged prs into openai agents sdk and google adk. i care about shipping real products, not demos. and yeah, the pixel trainer card was me too.",
  ],

  email: "nmhariharanme@gmail.com",
  // envelope card reads from here so the links dont get copy pasted in three places
  socials: {
    github: "https://github.com/nothariharan",
    linkedin: "https://www.linkedin.com/in/nmhariharan/",
    x: "https://x.com/lazyclaude",
    youtube: "https://www.youtube.com/@hari-e5w5v",
  },
};
