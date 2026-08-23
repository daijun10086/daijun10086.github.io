import type { Metadata } from "next";
import { PostList } from "../components/PostList";
import { PublicationCalendar } from "../components/PublicationCalendar";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { publicationEntries, researchPosts } from "../../content/posts";

export const metadata: Metadata = {
  title: "Research",
  description: "Research projects by Dai-Jun.",
};

export default function ResearchPage() {
  return (
    <>
      <SiteHeader current="research" />
      <main className="shell index-page">
        <h1 className="sr-only">Research</h1>
        <PostList posts={researchPosts} />
        <PublicationCalendar entries={publicationEntries} />
      </main>
      <SiteFooter />
    </>
  );
}
