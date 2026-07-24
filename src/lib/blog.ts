import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogPostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function isPublished(data: Record<string, unknown>) {
  // drafts: set published: false in frontmatter — they stay in the repo but never appear live
  return data.published !== false;
}

function readPostFile(filename: string): BlogPost | null {
  const slug = filename.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  if (!isPublished(data)) return null;

  const title = typeof data.title === "string" ? data.title : slug;
  const date = typeof data.date === "string" ? data.date : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === "string")
    : [];

  return {
    slug,
    title,
    date,
    excerpt,
    tags,
    content: content.trim(),
  };
}

function listMarkdownFiles() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .sort();
}

/** All published posts, newest first. */
export function getAllPosts(): BlogPostMeta[] {
  const posts = listMarkdownFiles()
    .map(readPostFile)
    .filter((p): p is BlogPost => p !== null);

  return posts
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Full post by slug, or null if missing / unpublished. */
export function getPostBySlug(slug: string): BlogPost | null {
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const mdx = path.join(BLOG_DIR, `${slug}.mdx`);
  const file = fs.existsSync(md) ? `${slug}.md` : fs.existsSync(mdx) ? `${slug}.mdx` : null;
  if (!file) return null;
  return readPostFile(file);
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Format ISO date string for display, e.g. "jul 22, 2026". */
export function formatPostDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toLowerCase();
}
