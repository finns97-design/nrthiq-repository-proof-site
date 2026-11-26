import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ===========================================================================
// The content route's reader: one file under content/ is one page
// ===========================================================================
//
// The page file contract (NRTHIQ's docs/GIT_PAGE_CONTRACT.md):
//
//   title        the document's <title>, printed exactly
//   description  the meta description, printed exactly
//   path         the public path the page is served at
//   slug         informational
//   generatedBy  informational ("nrthiq" on a file NRTHIQ committed)
//
// and the body is Markdown with exactly one `#` heading, which is the page's
// one H1. Nothing here adds a heading, rewrites a title or invents a
// description: a file that lacks one is not served.
// ===========================================================================

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentPage = {
  /** The public path, normalised: leading slash, no trailing slash except the root. */
  path: string;
  title: string;
  description: string;
  /** The Markdown body, as committed. */
  body: string;
  /** Present on an article file. */
  byline: string | null;
  kind: string | null;
  /** Where the file is, relative to the repository root. */
  file: string;
};

function normalise(p: string): string {
  const trimmed = `/${p}`.replace(/\/+/g, "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(md|mdx)$/.test(entry.name) ? [full] : [];
  });
}

const text = (value: unknown): string | null => (typeof value === "string" && value.trim() !== "" ? value : null);

/** Every page the site serves. A file without a title, a description or a path is left out, never guessed. */
export function allPages(): ContentPage[] {
  const pages: ContentPage[] = [];
  for (const full of walk(CONTENT_DIR).sort()) {
    const parsed = matter(fs.readFileSync(full, "utf8"));
    const title = text(parsed.data.title);
    const description = text(parsed.data.description);
    const declared = text(parsed.data.path);
    if (!title || !description || !declared || !declared.startsWith("/")) continue;
    const page: ContentPage = {
      path: normalise(declared),
      title,
      description,
      body: parsed.content,
      byline: text(parsed.data.byline),
      kind: text(parsed.data.kind),
      file: path.relative(process.cwd(), full),
    };
    // ONE FILE FOR ONE ADDRESS: the first in file order holds it, and a second file naming the same path is not served.
    if (!pages.some((p) => p.path === page.path)) pages.push(page);
  }
  return pages;
}

export function pageAt(segments: string[] | undefined): ContentPage | null {
  const wanted = normalise((segments ?? []).join("/"));
  return allPages().find((p) => p.path === wanted) ?? null;
}
