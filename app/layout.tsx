import type { ReactNode } from "react";
import type { Metadata } from "next";
import { site } from "../lib/site";

export const metadata: Metadata = {
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

// THE LAYOUT PRINTS NO HEADING OF ITS OWN. A page's one H1 is its file's one `#` line.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif", color: "#0e1420", background: "#ffffff" }}>
        <p role="note" style={{ margin: 0, padding: "10px 16px", background: "#fff4d6", borderBottom: "1px solid #e6c766", fontSize: 14, lineHeight: 1.5 }}>
          {site.notice}
        </p>
        <header style={{ padding: "16px", borderBottom: "1px solid #e8eef7" }}>
          <nav aria-label="Main" style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 15 }}>
            <a href="/" style={{ fontWeight: 700, color: "#0e1420", textDecoration: "none" }}>{site.name}</a>
            <a href="/services">Services</a>
            <a href="/blog">Articles</a>
            <a href="/about">About</a>
          </nav>
        </header>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 64px", lineHeight: 1.65, fontSize: 17 }}>{children}</main>
      </body>
    </html>
  );
}
