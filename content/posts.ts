export type PostKind = "research" | "blog";

export type ResourceLink = {
  label: string;
  href: string;
};

export type Post = {
  slug: string;
  kind: PostKind;
  date: string;
  displayDate: string;
  title: string;
  summary: string;
  tags: string[];
  links?: ResourceLink[];
  body: string;
};

// This is the only file you need to edit when adding a new piece of writing.
// Add one object, write the body in Markdown, and the site applies the same
// index and article templates automatically.
export const posts: Post[] = [
  {
    slug: "research-as-a-living-argument",
    kind: "research",
    date: "2026-07-18",
    displayDate: "Jul 18, 2026",
    title: "Beyond the Paper: Research as a Living Argument",
    summary:
      "A working model for publishing the paper, process, media, and unfinished questions as one evolving research note.",
    tags: ["research practice", "publishing"],
    links: [
      { label: "Project", href: "/writing/research-as-a-living-argument" },
      { label: "PDF", href: "/writing/research-as-a-living-argument#paper" },
      { label: "Archive", href: "/writing/research-as-a-living-argument#materials" },
    ],
    body: String.raw`
Academic projects rarely fit inside a citation. A paper records the result, but the useful life of a project also includes the failed routes, visual experiments, conversations, and decisions that made the result possible.

This entry demonstrates the shared template for a research project. The project links remain visible near the title, while the rest reads like an essay rather than a database record.

## The central question

What would change if a research page were treated as a living argument rather than a frozen announcement? My working answer is that the page should make room for three layers at once:

1. the concise claim;
2. the evidence and formal outputs; and
3. the personal reasoning that connects them.

> A project page can be rigorous without pretending that the researcher disappeared from the process.

<figure class="media-frame">
  <div class="media-placeholder" role="img" aria-label="Placeholder for an embedded research video or interactive figure">
    <span>Embedded media</span>
    <strong>Video, talk, demo, or interactive figure</strong>
  </div>
  <figcaption>Multimedia belongs inside the argument, exactly where it becomes useful.</figcaption>
</figure>

<h2 id="paper">Paper</h2>

The final site can link a published PDF here while preserving the more readable web version above. References, appendices, and version notes can live directly beside it.

<h2 id="materials">Materials</h2>

Datasets, code, talks, notebooks, and archived versions can be collected here without turning the home page into a dense list of buttons.
`,
  },
  {
    slug: "interfaces-for-uncertain-knowledge",
    kind: "research",
    date: "2026-05-03",
    displayDate: "May 03, 2026",
    title: "Interfaces for Uncertain Knowledge",
    summary:
      "Notes toward a calmer visual language for evidence that is partial, changing, or genuinely unresolved.",
    tags: ["interface", "uncertainty"],
    links: [
      { label: "Project", href: "/writing/interfaces-for-uncertain-knowledge" },
      { label: "Methods", href: "/writing/interfaces-for-uncertain-knowledge#methods" },
    ],
    body: String.raw`
Most academic interfaces reward confidence. They foreground the final number, the decisive chart, and the clean conclusion. But many important questions are not clean, and their uncertainty is not a defect to hide.

This project asks what an interface might look like if it treated uncertainty as information rather than visual noise.

## A quieter hierarchy

The first design move is subtraction. Fewer containers, fewer badges, and fewer competing calls to action give the reader enough time to notice how a claim is qualified.

The second move is temporal: every conclusion should be allowed to show when it was made and what might cause it to change.

<h2 id="methods">Methods</h2>

The project combines close reading, interface prototyping, and interviews. Each phase will be documented here as a short entry so that the method remains visible alongside the eventual result.
`,
  },
  {
    slug: "the-quiet-value-of-keeping-notes",
    kind: "blog",
    date: "2026-06-27",
    displayDate: "Jun 27, 2026",
    title: "The Quiet Value of Keeping Notes",
    summary:
      "Writing as a way to notice what would otherwise pass through a day without leaving a trace.",
    tags: ["notes", "attention"],
    body: String.raw`
I used to think notes were valuable because they helped me remember. Increasingly, I think their greater value is that they help me notice.

The act of writing a sentence changes the quality of attention. An idea that felt complete in the mind reveals its missing joints on the page. A passing observation becomes specific enough to return to later.

## A commonplace, not a performance

This section of the site is meant to remain small and informal. Not every entry needs to announce a finished position. Some can simply preserve a question before it disappears.

The template is intentionally consistent so that publishing does not become a new design project every time. The useful ritual should be: write, read once more, publish.
`,
  },
  {
    slug: "against-performing-certainty",
    kind: "blog",
    date: "2026-04-11",
    displayDate: "Apr 11, 2026",
    title: "Against Performing Certainty",
    summary:
      "A small argument for leaving enough room in public writing to change one’s mind.",
    tags: ["thinking", "writing"],
    body: String.raw`
Public writing often turns uncertainty into a weakness. The pressure is to arrive with a position already polished, defended, and compressed into something that cannot be misunderstood.

But thought develops through revision. A useful notebook should allow an argument to have a date, a context, and the possibility of becoming something else.

I would rather leave a visible trail of honest corrections than maintain the illusion that every conclusion arrived whole.
`,
  },
  {
    slug: "a-small-practice-of-attention",
    kind: "blog",
    date: "2026-02-08",
    displayDate: "Feb 08, 2026",
    title: "A Small Practice of Attention",
    summary:
      "On walking without headphones, looking twice, and making ordinary life less disposable.",
    tags: ["life", "observation"],
    body: String.raw`
Attention is not only a resource to defend from distraction. It is also a way of deciding what deserves to become part of one’s life.

Once a day, I try to walk without filling the silence. Nothing dramatic happens. The same streets remain the same streets. But details return: a repaired wall, a change of light, the rhythm of people leaving work.

Perhaps a life becomes less abstract through many small acts of looking twice.
`,
  },
];

export const researchPosts = posts.filter((post) => post.kind === "research");
export const blogPosts = posts.filter((post) => post.kind === "blog");

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
