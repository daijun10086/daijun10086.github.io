import type { Metadata } from "next";
import { PostList } from "../components/PostList";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { researchPosts } from "../../content/posts";

export const metadata: Metadata = {
  title: "Research",
  description: "Research projects by Daijun.",
};

export default function ResearchPage() {
  return (
    <>
      <SiteHeader current="research" />
      <main className="shell index-page">
        <h1>Research</h1>
        <PostList posts={researchPosts} />
      </main>
      <SiteFooter />
    </>
  );
}
