import { generatedAisthesisResources, generatedPosts } from "./posts.generated";
import type { PublicationEntry } from "./post-types";

export type {
  AisthesisResource,
  Post,
  PostKind,
  PublicationEntry,
  ResourceLink,
} from "./post-types";

// The build generates these indexes from the individual Markdown files in
// content/research, content/blog, and content/aisthesis. Newer entries appear first automatically.
export const posts = [...generatedPosts].sort((a, b) => b.date.localeCompare(a.date));

export const researchPosts = posts.filter((post) => post.kind === "research");
export const blogPosts = posts.filter((post) => post.kind === "blog");
export const publicationEntries: PublicationEntry[] = posts.map(
  ({ slug, kind, date, displayDate, title }) => ({ slug, kind, date, displayDate, title }),
);
export const aisthesisResources = [...generatedAisthesisResources].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
