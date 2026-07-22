import Link from "next/link";
import { PostList } from "./components/PostList";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { blogPosts, researchPosts } from "../content/posts";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="shell home-main">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">Researcher · writer · observer</p>
          <h1 id="intro-title">Ideas deserve a place to breathe.</h1>
          <p className="intro-copy">
            A small home for research, working notes, and essays about the things
            that remain interesting after the formal work is done.
          </p>
          <a className="quiet-link" href="#research">
            Begin with the work <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="content-section" id="research" aria-labelledby="research-title">
          <div className="section-heading">
            <p className="section-number">01</p>
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 id="research-title">Research</h2>
            </div>
            <p className="section-note">
              Every project begins as a question and continues as an essay.
            </p>
          </div>
          <PostList posts={researchPosts} />
        </section>

        <section className="content-section" id="blog" aria-labelledby="blog-title">
          <div className="section-heading">
            <p className="section-number">02</p>
            <div>
              <p className="eyebrow">Recent entries</p>
              <h2 id="blog-title">Blog</h2>
            </div>
            <p className="section-note">
              Academic thoughts, ordinary observations, and occasional philosophy.
            </p>
          </div>
          <PostList posts={blogPosts} compact />
        </section>

        <section className="content-section about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="section-number">03</p>
            <div>
              <p className="eyebrow">A short introduction</p>
              <h2 id="about-title">About</h2>
            </div>
          </div>
          <div className="about-layout">
            <div className="about-mark" aria-hidden="true">
              <span>D</span>
            </div>
            <div className="about-copy">
              <p>
                I am Daijun. My work sits between research and writing: I use each
                to understand the other, and I keep this site as a public notebook
                for both.
              </p>
              <p>
                This introduction is deliberately brief. Replace it with two or
                three sentences about what you study, what you care about, and how
                someone can reach you.
              </p>
              <div className="about-links">
                <Link href="mailto:hello@example.com">Email</Link>
                <Link href="/#research">Research</Link>
                <Link href="/#blog">Writing</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
