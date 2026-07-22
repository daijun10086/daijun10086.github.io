import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path) {
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

test("renders research as a focused standalone page", async () => {
  const response = await render("/research");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<h1 class="sr-only">Research<\/h1>/);
  assert.match(html, /animated particle logogram/);
  assert.match(html, /Color theme/);
  assert.match(html, /Beyond the Paper/);
  assert.match(html, />Project<\/a>/);
  assert.match(html, />PDF<\/a>/);
  assert.match(html, />Archive<\/a>/);
  assert.doesNotMatch(html, /Ideas deserve a place to breathe|Selected work|Every project begins/);
  assert.doesNotMatch(html, /A working model for publishing/);
});

test("renders blog as a separate page without previews", async () => {
  const response = await render("/blog");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<h1 class="sr-only">Blog<\/h1>/);
  assert.match(html, /The Quiet Value of Keeping Notes/);
  assert.doesNotMatch(html, /Recent entries|Academic thoughts|Writing as a way to notice/);
});

test("keeps content in one shared article system", async () => {
  const [content, articleTemplate, packageJson] = await Promise.all([
    readFile(new URL("../content/posts.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/writing/[slug]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(content, /export const posts/);
  assert.match(articleTemplate, /<ReactMarkdown/);
  assert.match(articleTemplate, /getPost\(slug\)/);
  assert.match(packageJson, /"react-markdown"/);
});
