import type { Metadata } from "next";
import { PostList } from "../components/PostList";
import { PublicationCalendar } from "../components/PublicationCalendar";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { blogPosts, publicationEntries } from "../../content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing by Dai-Jun.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader current="blog" />
      <main className="shell index-page">
        <h1 className="sr-only">Blog</h1>
        <PostList posts={blogPosts} />
        <PublicationCalendar entries={publicationEntries} />
      </main>
      <SiteFooter />
    </>
  );
}
