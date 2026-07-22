import Link from "next/link";
import type { Post } from "../../content/posts";

export function PostList({ posts, compact = false }: { posts: Post[]; compact?: boolean }) {
  return (
    <div className={compact ? "post-list post-list-compact" : "post-list"}>
      {posts.map((post) => (
        <article className="post-row" key={post.slug}>
          <time dateTime={post.date}>{post.displayDate}</time>
          <div className="post-main">
            <h3>
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </h3>
            <p>{post.summary}</p>
            {post.links && (
              <div className="resource-links" aria-label={`${post.title} resources`}>
                {post.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
