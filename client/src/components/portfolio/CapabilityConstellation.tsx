import { motion } from "framer-motion";
import { useState } from "react";
import type { Capability } from "@/data/profile";
import { Reveal } from "./PortfolioPrimitives";

export function CapabilityConstellation({ capabilities }: { capabilities: Capability[] }) {
  const [activeId, setActiveId] = useState("strategy");
  const active = capabilities.find((capability) => capability.id === activeId) ?? capabilities[0];

  return (
    <div className="capability-layout">
      <Reveal className="constellation" delay={0.05}>
        <svg className="constellation__lines" viewBox="0 0 520 420" aria-hidden="true" preserveAspectRatio="none">
          <path d="M260 210 L104 92 M260 210 L260 64 M260 210 L416 92 M260 210 L438 246 M260 210 L356 362 M260 210 L164 362 M260 210 L82 246" />
        </svg>
        <div className="constellation__core">Business<br /><span>meets data</span></div>
        {capabilities.map((capability, index) => {
          const position = index === 0 ? "top-left" : index === 1 ? "top" : index === 2 ? "top-right" : index === 3 ? "right" : index === 4 ? "bottom-right" : index === 5 ? "bottom-left" : index === 6 ? "left" : "far-left";
          const selected = capability.id === activeId;
          return (
            <motion.button
              type="button"
              key={capability.id}
              className={`constellation__node constellation__node--${position}${selected ? " constellation__node--active" : ""}`}
              onClick={() => setActiveId(capability.id)}
              onFocus={() => setActiveId(capability.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              aria-pressed={selected}
            >
              <span className="constellation__node-dot" />
              <span>{capability.label}</span>
            </motion.button>
          );
        })}
      </Reveal>

      <Reveal className="capability-detail" delay={0.14}>
        <span className="data-label">Capability signal</span>
        <p className="capability-detail__group">{active.group}</p>
        <h3>{active.label}</h3>
        <p>{active.description}</p>
        <div className="capability-detail__rule" />
        <p className="capability-detail__note">The best work happens in the connection between these disciplines — not inside one isolated tool.</p>
      </Reveal>
    </div>
  );
}
