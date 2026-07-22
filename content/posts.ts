import { generatedPosts } from "./posts.generated";

export type { Post, PostKind, ResourceLink } from "./post-types";

// The build generates this index from the individual Markdown files in
// content/research and content/blog. Newer entries appear first automatically.
export const posts = [...generatedPosts].sort((a, b) => b.date.localeCompare(a.date));

export const researchPosts = posts.filter((post) => post.kind === "research");
export const blogPosts = posts.filter((post) => post.kind === "blog");

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
