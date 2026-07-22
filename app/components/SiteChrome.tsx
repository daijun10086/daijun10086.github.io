import Link from "next/link";

type Section = "research" | "blog" | "about";

export function SiteHeader({ current }: { current?: Section }) {
  return (
    <>
      <div className="visual-header" aria-hidden="true">
        <img src="/enso-dither.png" alt="" fetchPriority="high" />
      </div>
      <header className="site-header shell">
        <Link className="site-name" href="/research" aria-label="Daijun, research home">
          Daijun
        </Link>
        <nav aria-label="Primary navigation">
          <Link href="/research" aria-current={current === "research" ? "page" : undefined}>
            research
          </Link>
          <Link href="/blog" aria-current={current === "blog" ? "page" : undefined}>
            blog
          </Link>
          <Link href="/about" aria-current={current === "about" ? "page" : undefined}>
            about
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
    </footer>
  );
}
