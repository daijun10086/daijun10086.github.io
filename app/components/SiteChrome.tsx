import Link from "next/link";
import { LogogramTitle } from "./LogogramTitle";
import { ThemeControl } from "./ThemeControl";

type Section = "research" | "blog" | "about" | "aisthesis";

export function SiteHeader({ current }: { current?: Section }) {
  const activeSection = current || "about";

  return (
    <>
      <LogogramTitle word={activeSection} />
      <header className="site-header shell">
        <Link className="site-name" href="/about" aria-label="Dai-Jun, about home">
          Dai-Jun
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
          <Link href="/aisthesis" aria-current={current === "aisthesis" ? "page" : undefined}>
            Aisthesis
          </Link>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <p>© {new Date().getFullYear()} Dai-Jun.</p>
      <ThemeControl />
    </footer>
  );
}
