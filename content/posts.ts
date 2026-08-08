import { generatedAisthesisResources, generatedPosts } from "./posts.generated";

export type { AisthesisResource, Post, PostKind, ResourceLink } from "./post-types";

// The build generates these indexes from the individual Markdown files in
// content/research, content/blog, and content/aisthesis. Newer entries appear first automatically.
export const posts = [...generatedPosts].sort((a, b) => b.date.localeCompare(a.date));

export const researchPosts = posts.filter((post) => post.kind === "research");
export const blogPosts = posts.filter((post) => post.kind === "blog");
export const aisthesisResources = [...generatedAisthesisResources].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
