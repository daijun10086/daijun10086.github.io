import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

type VisualResource = {
  title: string;
  href: string;
  category: string;
  note: string;
};

const visualResources: VisualResource[] = [
  {
    title: "The Moon Camera",
    href: "https://www.youtube.com/watch?v=Ytkkl917paM",
    category: "Computational photography",
    note: "A piece of computational-photography “black magic” that makes the invisible visible—and the kind of idea I wish I had imagined.",
  },
];

export const metadata: Metadata = {
  title: "Aisthesis",
  description: "A personal collection of visual art and image-making resources by Dai-Jun.",
};

export default function AisthesisPage() {
  return (
    <>
      <SiteHeader current="aisthesis" />
      <main className="shell index-page aisthesis-page">
        <h1 className="sr-only">Aisthesis</h1>

        <header className="aisthesis-intro">
          <p>
            A personal shelf for visual art, image-making, rendering, and anything that changes
            how I see.
          </p>
          <p className="aisthesis-note">A small collection for now, and a growing one.</p>
        </header>

        <ol className="visual-resource-list" aria-label="Favorite visual art resources">
          {visualResources.map((resource) => (
            <li className="visual-resource" key={resource.href}>
              <p className="visual-resource-category">{resource.category}</p>
              <div className="visual-resource-main">
                <h2>
                  <a href={resource.href} target="_blank" rel="noreferrer">
                    {resource.title}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </h2>
                <p>{resource.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </>
  );
}
