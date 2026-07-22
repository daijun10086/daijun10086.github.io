import Link from "next/link";
import { LogogramTitle } from "./LogogramTitle";
import { ThemeControl } from "./ThemeControl";

type Section = "research" | "blog" | "about";

export function SiteHeader({ current }: { current?: Section }) {
  const activeSection = current || "about";

  return (
    <>
      <LogogramTitle word={activeSection} />
      <header className="site-header shell">
        <Link className="site-name" href="/about" aria-label="Daijun, about home">
          Daijun
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/about" aria-current={current === "about" ? "page" : undefined}>
            about
          </Link>
          <Link href="/research" aria-current={current === "research" ? "page" : undefined}>
            research
          </Link>
          <Link href="/blog" aria-current={current === "blog" ? "page" : undefined}>
            blog
          </Link>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <p>© {new Date().getFullYear()} Daijun.</p>
      <ThemeControl />
    </footer>
  );
}
