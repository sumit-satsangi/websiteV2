import { ArrowLeft, Signal } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-page__grid" aria-hidden="true" />
      <div className="not-found-page__inner">
        <span className="data-label">SS / SIGNAL LOST</span>
        <div className="not-found-page__mark"><Signal size={30} strokeWidth={1.2} /></div>
        <p className="not-found-page__code">404</p>
        <h1>This page is not in the current model.</h1>
        <p className="not-found-page__copy">The route you followed does not resolve to a public page. Return to the portfolio and continue from the signal.</p>
        <a className="button button--solid" href="/"><ArrowLeft size={16} /> Return to the portfolio</a>
      </div>
    </main>
  );
}
