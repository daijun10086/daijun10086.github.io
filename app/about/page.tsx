import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description: "About Daijun.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="about" />
      <main className="shell index-page about-page">
        <h1 className="sr-only">About</h1>
        <div className="about-copy">
          <p>I am Daijun. I research, write, and keep notes here.</p>
          <p>
            <Link href="mailto:hello@example.com">Email</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
