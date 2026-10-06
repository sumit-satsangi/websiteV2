import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/data/profile";
import { ArrowLink, Reveal } from "./PortfolioPrimitives";

export function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <Reveal className={`case-study case-study--${study.accent}`} delay={index * 0.08}>
      <div className="case-study__visual" aria-hidden="true">
        <span className="case-study__number">{study.number}</span>
        <div className="case-study__bars">
          <span style={{ height: "42%" }} />
          <span style={{ height: "68%" }} />
          <span style={{ height: "54%" }} />
          <span style={{ height: "86%" }} />
          <span style={{ height: "63%" }} />
          <span style={{ height: "94%" }} />
        </div>
        <div className="case-study__orb" />
        <span className="case-study__axis-label">evidence / outcome</span>
      </div>
      <div className="case-study__content">
        <span className="data-label">{study.type}</span>
        <h3>{study.title}</h3>
        <div className="case-study__rows">
          <div><span>Challenge</span><p>{study.challenge}</p></div>
          <div><span>Approach</span><p>{study.approach}</p></div>
          <div><span>Role</span><p>{study.role}</p></div>
          <div><span>Outcome</span><p>{study.outcome}</p></div>
        </div>
        <div className="case-study__footer">
          <div className="tech-tags">
            {study.technology.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
          <ArrowLink href={study.href}>{study.hrefLabel}</ArrowLink>
        </div>
      </div>
      <ArrowUpRight className="case-study__corner" size={19} strokeWidth={1.5} aria-hidden="true" />
    </Reveal>
  );
}
