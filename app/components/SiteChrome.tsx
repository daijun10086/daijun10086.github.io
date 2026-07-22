import Link from "next/link";
import { DitherHeader } from "./DitherHeader";

export function SiteHeader() {
  return (
    <>
      <div className="visual-header">
        <DitherHeader />
      </div>
      <header className="site-header shell">
        <Link className="site-name" href="/" aria-label="Daijun, home">
          Daijun
        </Link>
        <nav aria-label="Primary navigation">
          <a href="/#research">research</a>
          <a href="/#blog">blog</a>
          <a href="/#about">about</a>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <p>Notes, projects, and unfinished questions.</p>
      <p>© {new Date().getFullYear()} Daijun.</p>
    </footer>
  );
}
