import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useState } from "react";
import type { CareerEntry } from "@/data/profile";
import { Reveal } from "./PortfolioPrimitives";

export function CareerTimeline({ entries }: { entries: CareerEntry[] }) {
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "");
  const active = entries.find((entry) => entry.id === activeId) ?? entries[0];

  if (!active) return null;

  return (
    <div className="career-intelligence">
      <div className="career-intelligence__timeline" role="group" aria-label="Career timeline">
        <div className="career-intelligence__track" aria-hidden="true" />
        {entries.map((entry, index) => {
          const selected = entry.id === active.id;
          return (
            <button
              key={entry.id}
              type="button"
              className={`career-node${selected ? " career-node--active" : ""}`}
              aria-pressed={selected}
              onClick={() => setActiveId(entry.id)}
              onFocus={() => setActiveId(entry.id)}
            >
              <span className="career-node__dot" />
              <span className="career-node__index">0{index + 1}</span>
              <span className="career-node__period">{entry.period}</span>
              <span className="career-node__label">{entry.category}</span>
            </button>
          );
        })}
      </div>

      <Reveal className="career-panel-wrap">
        <AnimatePresence mode="wait">
          <motion.article
            key={active.id}
            className="career-panel"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="career-panel__header">
              <div>
                <span className="data-label">Selected chapter</span>
                <h3>{active.role}</h3>
                <p className="career-panel__org">{active.organization}</p>
                {active.subRoles ? (
                  <div className="career-panel__subroles">
                    {active.subRoles.map((subRole) => <span key={subRole}>{subRole}</span>)}
                  </div>
                ) : null}
              </div>
              <span className="career-panel__period">{active.period}</span>
            </div>

            <div className="career-panel__body">
              <div>
                <span className="data-label">The brief</span>
                <p>{active.summary}</p>
              </div>
              <div>
                <span className="data-label">The signal</span>
                <p>{active.outcome}</p>
              </div>
            </div>

            <div className="career-panel__footer">
              <div className="career-panel__context">
                <span className="context-chip">{active.industry}</span>
                {active.location ? (
                  <span className="context-chip context-chip--muted">
                    <MapPin size={13} strokeWidth={1.7} /> {active.location}
                  </span>
                ) : null}
              </div>
              <div className="tech-tags" aria-label="Technologies used">
                {active.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>

            <a className="career-panel__link" href="#impact">
              Trace the impact <ArrowUpRight size={15} strokeWidth={1.7} />
            </a>
          </motion.article>
        </AnimatePresence>
      </Reveal>
    </div>
  );
}
