import type { Metadata } from "next";
import { PostList } from "../components/PostList";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { blogPosts } from "../../content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing by Daijun.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader current="blog" />
      <main className="shell index-page">
        <h1>Blog</h1>
        <PostList posts={blogPosts} />
      </main>
      <SiteFooter />
    </>
  );
}
