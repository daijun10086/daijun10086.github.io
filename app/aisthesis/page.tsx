import type { Metadata } from "next";
import { aisthesisResources } from "../../content/posts";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

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

        {aisthesisResources.length > 0 ? (
          <ol className="visual-resource-list" aria-label="Favorite visual art resources">
            {aisthesisResources.map((resource) => (
              <li className="visual-resource" key={resource.href}>
                <p className="visual-resource-category">{resource.category}</p>
                <a
                  className={`visual-resource-bookmark${resource.previewImage ? " has-preview" : ""}`}
                  href={resource.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="visual-resource-main">
                    <h2>
                      {resource.title}
                      <span aria-hidden="true"> ↗</span>
                    </h2>
                    <p>{resource.note}</p>
                    <span className="visual-resource-domain">
                      {new URL(resource.href).hostname.replace(/^www\./, "")}
                    </span>
                  </div>
                  {resource.previewImage ? (
                    <span className="visual-resource-preview" aria-hidden="true">
                      <img src={resource.previewImage} alt="" loading="lazy" decoding="async" />
                    </span>
                  ) : null}
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <p className="aisthesis-empty">This shelf is ready for its first entry.</p>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
