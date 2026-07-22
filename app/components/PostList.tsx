import Link from "next/link";
import type { Post } from "../../content/posts";

export function PostList({ posts }: { posts: Post[] }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-row" key={post.slug}>
          <time dateTime={post.date}>{post.displayDate}</time>
          <div className="post-main">
            <h3>
              <Link href={`/writing/${post.slug}`}>{post.title}</Link>
            </h3>
            {post.links && (
              <div className="resource-links" aria-label={`${post.title} resources`}>
                {post.links.map((link) => (
                  <Link href={link.href} key={link.label}>
                    {link.label}
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
