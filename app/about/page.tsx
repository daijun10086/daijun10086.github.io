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
          <p>I am Dai-Jun. I do research about vision and intelligence, writing about life and philosophy. Hope for better world and future.</p>
          <p>
            <Link href="mailto:jundai332@gmail.com">Email</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
