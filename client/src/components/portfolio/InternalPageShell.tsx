import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { SignalMark } from "./PortfolioPrimitives";

export function InternalPageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="internal-page site-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Sumit Satsangi home">
          <SignalMark compact />
          <span className="wordmark__text"><strong>SS</strong><small>DATA / DECISIONS</small></span>
        </a>
        <nav className="site-nav internal-page__nav" aria-label="Primary navigation">
          <a className="site-nav__link" href="/"><span>00</span>Home</a>
          <a className="site-nav__link" href="/projects"><span>01</span>Projects</a>
          <a className="site-nav__link" href="/blogs"><span>02</span>Blogs</a>
          <a className="site-nav__link" href="/podcast"><span>03</span>Podcast</a>
          <a className="site-nav__cta" href="/#contact">Let&apos;s Talk <ArrowUpRight size={14} /></a>
        </nav>
      </header>
      <main>
        <section className="internal-hero section-shell">
          <a className="internal-hero__back" href="/"><ArrowLeft size={15} /> Back to the portfolio</a>
          <span className="data-label">W5 / {eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
        </section>
        {children}
      </main>
      <footer className="site-footer"><div className="site-footer__brand"><SignalMark compact /><span>Sumit Satsangi / W5</span></div><div className="site-footer__links"><a href="/">Home</a><a href="/projects">Projects</a><a href="/blogs">Blogs</a><a href="/podcast">Podcast</a></div><span className="site-footer__note">Source-grounded archive · {new Date().getFullYear()}</span></footer>
    </div>
  );
}
