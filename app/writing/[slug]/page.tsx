import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { getPost, posts } from "../../../content/posts";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

function transformContentUrl(url: string) {
  const localPublicPrefix = "../../public/";
  const siteUrl = url.startsWith(localPublicPrefix)
    ? `../../${url.slice(localPublicPrefix.length)}`
    : url;

  return defaultUrlTransform(siteUrl);
}

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

  return (
    <>
      <SiteHeader current={post.kind} />
      <main className="shell article-page" id="article">
        <Link className="back-link" href={`/${post.kind}`}>
          <span aria-hidden="true">←</span> Back to {post.kind}
        </Link>

        <article>
          <header className="article-header">
            <div className="article-meta">
              <time dateTime={post.date}>{post.displayDate}</time>
            </div>
            <h1>{post.title}</h1>

            {post.links && (
              <div className="article-resources" aria-label="Project resources">
                {post.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="article-body">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              urlTransform={transformContentUrl}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          <footer className="article-end">
            <span aria-hidden="true">✦</span>
          </footer>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
