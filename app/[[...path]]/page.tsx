import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { allPages, pageAt } from "../../lib/content";

// Built from the files, once, at build time. An address no file names is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPages().map((page) => ({ path: page.path === "/" ? [] : page.path.slice(1).split("/") }));
}

type Params = { params: Promise<{ path?: string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = pageAt((await params).path);
  if (!page) return {};
  // THE TITLE AND THE DESCRIPTION ARE THE FILE'S OWN, printed exactly.
  return { title: { absolute: page.title }, description: page.description };
}

/** The pages filed under a section, for the two index pages: by the section's own path prefix. */
function listing(prefix: string) {
  return allPages()
    .filter((p) => p.path.startsWith(`${prefix}/`))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export default async function ContentRoute({ params }: Params) {
  const page = pageAt((await params).path);
  if (!page) notFound();
  const html = await marked.parse(page.body);
  const listed = page.path === "/services" || page.path === "/blog" ? listing(page.path) : [];
  return (
    <article>
      {/* The body's one `#` line is the page's one H1. Nothing above or below adds another. */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {page.byline ? <p style={{ color: "#5b6472", fontSize: 14 }}>By {page.byline}</p> : null}
      {listed.length > 0 ? (
        <ul>
          {listed.map((p) => (
            <li key={p.path}>
              <a href={p.path}>{p.title}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
