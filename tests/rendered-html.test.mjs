import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the research, blog, and about home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Daijun — Research &amp; Notes/);
  assert.match(html, /Ideas deserve a place to breathe/);
  assert.match(html, /id="research"/);
  assert.match(html, /id="blog"/);
  assert.match(html, /id="about"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("uses one content source and one shared article template", async () => {
  const [content, articleTemplate, packageJson] = await Promise.all([
    readFile(new URL("../content/posts.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/writing/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(content, /export const posts/);
  assert.match(content, /kind: "research"/);
  assert.match(content, /kind: "blog"/);
  assert.match(articleTemplate, /<ReactMarkdown/);
  assert.match(articleTemplate, /getPost\(slug\)/);
  assert.match(packageJson, /"react-markdown"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
