import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);

async function outputFile(path) {
  const file = new URL(path, output);
  await access(file);
  return readFile(file, "utf8");
}

async function contentSlugs(kind) {
  const files = await readdir(new URL(`../content/${kind}/`, import.meta.url));
  return files
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => file.slice(0, -3));
}

test("exports every primary page as a directory index", async () => {
  const [home, about, research, blog, aisthesis] = await Promise.all([
    outputFile("index.html"),
    outputFile("about/index.html"),
    outputFile("research/index.html"),
    outputFile("blog/index.html"),
    outputFile("aisthesis/index.html"),
  ]);

  assert.match(home, /<h1 class="sr-only">About<\/h1>/);
  assert.match(home, /I am Dai-Jun/);
  assert.match(home, /href="https:\/\/wandell\.github\.io\/FOV-1995\/"/);
  assert.match(home, /href="https:\/\/en\.wikipedia\.org\/wiki\/Intelligence"/);
  assert.match(home, /rel="icon"/);
  assert.match(home, /tab-logo\.svg/);
  assert.match(about, /<h1 class="sr-only">About<\/h1>/);
  assert.match(about, /id="about-links-title">Links<\/h2>/);
  assert.match(about, /dai-jun-cv-of-failure-template\.pdf/);
  assert.match(about, /href="https:\/\/github\.com\/daijun10086"/);
  assert.match(about, /<span class="about-link-name">CV<\/span>/);
  assert.match(about, /<span class="about-link-detail">coming soon<\/span>/);
  assert.match(research, /Beyond the Paper/);
  assert.match(research, /id="publication-calendar-title">Publishing history<\/h2>/);
  assert.match(blog, /id="publication-calendar-title">Publishing history<\/h2>/);
  assert.match(blog, /Research and Blog · last 26 weeks/);
  assert.match(aisthesis, /<h1 class="sr-only">Aisthesis<\/h1>/);
  const aisthesisFiles = (await readdir(new URL("../content/aisthesis/", import.meta.url))).filter(
    (file) => file.endsWith(".md") && !file.startsWith("_"),
  );
  assert.equal(
    (aisthesis.match(/<li class="visual-resource">/g) || []).length,
    aisthesisFiles.length,
  );
  if (aisthesisFiles.length === 0) {
    assert.match(aisthesis, /This shelf is ready for its first entry\./);
  } else {
    assert.doesNotMatch(aisthesis, /This shelf is ready for its first entry\./);
  }
  assert.doesNotMatch(aisthesis, /The Moon Camera/);
  for (const slug of await contentSlugs("blog")) {
    assert.ok(blog.includes(`/writing/${slug}/`));
  }
});

test("pre-renders writing routes and GitHub Pages support files", async () => {
  const slugs = [...(await contentSlugs("research")), ...(await contentSlugs("blog"))];
  const articles = await Promise.all(slugs.map((slug) => outputFile(`writing/${slug}/index.html`)));
  const happinessArticle = await outputFile("writing/towards-happiness/index.html");

  for (const article of articles) assert.match(article, /<article>/);
  assert.match(
    happinessArticle,
    /src="\.\.\/\.\.\/assets\/blog\/towards-happiness\/zen\.png"/,
  );
  await access(new URL("404.html", output));
  await access(new URL(".nojekyll", output));
  await access(new URL("og-v3.png", output));
  await access(new URL("tab-logo.svg", output));
  await access(new URL("assets/blog/towards-happiness/zen.png", output));
  await access(new URL("documents/dai-jun-cv-of-failure-template.pdf", output));
});
