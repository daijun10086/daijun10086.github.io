import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getPost, posts } from "../../../content/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function WritingPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const related = posts
    .filter((candidate) => candidate.slug !== post.slug && candidate.kind === post.kind)
    .slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main className="shell article-page" id="article">
        <Link className="back-link" href={`/#${post.kind === "research" ? "research" : "blog"}`}>
          <span aria-hidden="true">←</span> Back to {post.kind}
        </Link>

        <article>
          <header className="article-header">
            <div className="article-meta">
              <span>{post.kind}</span>
              <time dateTime={post.date}>{post.displayDate}</time>
            </div>
            <h1>{post.title}</h1>
            <p className="article-dek">{post.summary}</p>

            {post.links && (
              <div className="article-resources" aria-label="Project resources">
                {post.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="article-body">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.body}</ReactMarkdown>
          </div>

          <footer className="article-end">
            <p>Filed under {post.tags.join(" · ")}</p>
            <span aria-hidden="true">✦</span>
          </footer>
        </article>

        {related.length > 0 && (
          <aside className="related" aria-labelledby="related-title">
            <p className="eyebrow">Continue reading</p>
            <h2 id="related-title">Related notes</h2>
            <div className="related-grid">
              {related.map((item) => (
                <Link href={`/writing/${item.slug}`} key={item.slug}>
                  <time dateTime={item.date}>{item.displayDate}</time>
                  <strong>{item.title}</strong>
                  <span aria-hidden="true">Read →</span>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
