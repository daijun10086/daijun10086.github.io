import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);

async function outputFile(path) {
  const file = new URL(path, output);
  await access(file);
  return readFile(file, "utf8");
}

test("exports every primary page as a directory index", async () => {
  const [home, about, research, blog] = await Promise.all([
    outputFile("index.html"),
    outputFile("about/index.html"),
    outputFile("research/index.html"),
    outputFile("blog/index.html"),
  ]);

  assert.match(home, /<h1 class="sr-only">About<\/h1>/);
  assert.match(about, /<h1 class="sr-only">About<\/h1>/);
  assert.match(research, /Beyond the Paper/);
  assert.match(blog, /The Quiet Value of Keeping Notes/);
});

test("pre-renders writing routes and GitHub Pages support files", async () => {
  const article = await outputFile("writing/research-as-a-living-argument/index.html");

  assert.match(article, /Research as a Living Argument/);
  await access(new URL("404.html", output));
  await access(new URL(".nojekyll", output));
  await access(new URL("og-v3.png", output));
});
