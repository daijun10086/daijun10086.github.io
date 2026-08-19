import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
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
  assert.match(html, /rel="icon"/);
  assert.match(html, /tab-logo\.svg/);
  assert.match(html, />Dai-Jun<\/a>/);
  assert.match(html, /<p>© .*Dai-Jun\.<\/p>/);
  assert.match(html, /animated particle logogram/);
  assert.match(html, /Color theme/);
  assert.match(html, /Beyond the Paper/);
  assert.match(html, />Project<\/a>/);
  assert.match(html, />PDF<\/a>/);
  assert.match(html, />Archive<\/a>/);
  assert.doesNotMatch(html, /Ideas deserve a place to breathe|Selected work|Every project begins/);
  assert.doesNotMatch(html, /A working model for publishing/);

  const aboutPosition = html.indexOf('href="/about"');
  const researchPosition = html.indexOf('href="/research"', aboutPosition + 1);
  const blogPosition = html.indexOf('href="/blog"');
  const aisthesisPosition = html.indexOf('href="/aisthesis"');
  assert.ok(
    aboutPosition >= 0 &&
      aboutPosition < researchPosition &&
      researchPosition < blogPosition &&
      blogPosition < aisthesisPosition,
  );
});

test("renders Aisthesis as a visual resource collection", async () => {
  const response = await render("/aisthesis");
  assert.equal(response.status, 200);
  const html = await response.text();
  const resourceFiles = (await readdir(new URL("../content/aisthesis/", import.meta.url))).filter(
    (file) => file.endsWith(".md") && !file.startsWith("_"),
  );

  assert.match(html, /<h1 class="sr-only">Aisthesis<\/h1>/);
  assert.match(html, /aria-current="page"[^>]*>Aisthesis<\/a>/);
  assert.equal((html.match(/<li class="visual-resource">/g) || []).length, resourceFiles.length);
  if (resourceFiles.length === 0) {
    assert.match(html, /This shelf is ready for its first entry\./);
  } else {
    assert.match(html, /Favorite visual art resources/);
    assert.doesNotMatch(html, /This shelf is ready for its first entry\./);
    assert.match(html, /visual-resource-bookmark/);
  }
  assert.doesNotMatch(html, /The Moon Camera/);
});

test("renders blog as a separate page without previews", async () => {
  const response = await render("/blog");
  assert.equal(response.status, 200);
  const html = await response.text();
  const blogFiles = (await readdir(new URL("../content/blog/", import.meta.url))).filter(
    (file) => file.endsWith(".md") && !file.startsWith("_"),
  );

  assert.match(html, /<h1 class="sr-only">Blog<\/h1>/);
  assert.equal((html.match(/<article class="post-row">/g) || []).length, blogFiles.length);
  for (const file of blogFiles) {
    assert.ok(html.includes(`/writing/${file.slice(0, -3)}`));
  }
  assert.doesNotMatch(html, /Recent entries|Academic thoughts/);
});

test("maps Markdown-preview public paths to deployed asset URLs", async () => {
  const response = await render("/writing/towards-happiness");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /src="\.\.\/\.\.\/assets\/blog\/towards-happiness\/zen\.png"/);
  assert.doesNotMatch(html, /src="\.\.\/\.\.\/public\/assets\//);
});

test("renders the About resource links without broken placeholders", async () => {
  const response = await render("/about");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /id="about-links-title">Links<\/h2>/);
  assert.match(html, /href="\/documents\/dai-jun-cv-of-failure-template\.pdf"/);
  assert.match(html, /href="https:\/\/github\.com\/daijun10086"/);
  assert.match(html, /<span class="about-link-name">CV<\/span>/);
  assert.match(html, /<span class="about-link-detail">coming soon<\/span>/);
  assert.doesNotMatch(html, /href="\/documents\/dai-jun-cv\.pdf"/);
});

test("builds one shared content system from individual Markdown files", async () => {
  const [content, generator, articleTemplate, blogFiles, researchFiles, aisthesisFiles] =
    await Promise.all([
    readFile(new URL("../content/posts.ts", import.meta.url), "utf8"),
    readFile(new URL("../scripts/generate-posts.mjs", import.meta.url), "utf8"),
    readFile(new URL("../app/writing/[slug]/page.tsx", import.meta.url), "utf8"),
    readdir(new URL("../content/blog/", import.meta.url)),
    readdir(new URL("../content/research/", import.meta.url)),
    readdir(new URL("../content/aisthesis/", import.meta.url)),
  ]);

  assert.match(content, /export const posts/);
  assert.match(content, /generatedPosts/);
  assert.match(generator, /gray-matter/);
  assert.ok(blogFiles.some((file) => file.endsWith(".md") && !file.startsWith("_")));
  assert.ok(researchFiles.some((file) => file.endsWith(".md") && !file.startsWith("_")));
  assert.ok(aisthesisFiles.includes("_template.md"));
  assert.match(content, /aisthesisResources/);
  assert.match(generator, /readAisthesisResources/);
  assert.match(articleTemplate, /<ReactMarkdown/);
  assert.match(articleTemplate, /getPost\(slug\)/);
});
