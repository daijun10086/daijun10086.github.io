import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description: "About Dai-Jun.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="about" />
      <main className="shell index-page about-page">
        <h1 className="sr-only">About</h1>
        <div className="about-copy">
          <p>
            I am Dai-Jun. I do research about{" "}
            <Link href="https://wandell.github.io/FOV-1995/">vision</Link> and{" "}
            <Link href="https://en.wikipedia.org/wiki/Intelligence">intelligence</Link>, writing
            about life and philosophy. Hope for a better world and future.
          </p>
          <p>
            <Link href="mailto:jundai332@gmail.com">Email</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
