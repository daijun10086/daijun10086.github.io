import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

type AboutPhoto = {
  src: string;
  alt: string;
  position?: string;
};

const aboutPhotos: AboutPhoto[] = [
  // Add three or four photos from public/assets/about-images here.
  // Example:
  // { src: "/assets/about-images/photo-1.jpg", alt: "Dai-Jun outdoors" },
  // { src: "/assets/about-images/photo-2.jpg", alt: "Dai-Jun at work", position: "center 35%" },
];

export const metadata: Metadata = {
  title: "About",
  description: "About Dai-Jun.",
};

export default function AboutPage() {
  const visiblePhotos = aboutPhotos.slice(0, 4);

  return (
    <>
      <SiteHeader current="about" />
      <main className="shell index-page about-page">
        <h1 className="sr-only">About</h1>
        <div className="about-copy">
          <p>
            I am Dai-Jun. I do research and engineering about{" "}
            <Link href="https://wandell.github.io/FOV-1995/">vision</Link> and{" "}
            <Link href="https://en.wikipedia.org/wiki/Intelligence">intelligence</Link>, writing
            about life and philosophy. Hoping for a better world and future.
          </p>
          <p>
            <Link href="mailto:jundai332@gmail.com">jundai332@gmail.com</Link>
          </p>
        </div>
        <div className="about-divider" aria-hidden="true" />
        {visiblePhotos.length > 0 ? (
          <section
            className="about-gallery"
            data-count={visiblePhotos.length}
            aria-label="Photographs of Dai-Jun"
          >
            {visiblePhotos.map((photo) => (
              <figure className="about-photo" key={photo.src}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: photo.position ?? "center" }}
                />
              </figure>
            ))}
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
