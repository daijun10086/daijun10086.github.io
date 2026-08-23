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

export type PublicationEntry = Pick<
  Post,
  "slug" | "kind" | "date" | "displayDate" | "title"
>;

export type AisthesisResource = {
  slug: string;
  date: string;
  displayDate: string;
  title: string;
  href: string;
  category: string;
  previewImage?: string;
  note: string;
};
