import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SignalMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`signal-mark${compact ? " signal-mark--compact" : ""}`} aria-hidden="true">
      <span className="signal-mark__bar signal-mark__bar--one" />
      <span className="signal-mark__bar signal-mark__bar--two" />
      <span className="signal-mark__bar signal-mark__bar--three" />
    </span>
  );
}

export function SectionIntro({
  number,
  eyebrow,
  title,
  children,
  align = "left",
}: {
  number: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className={`section-intro section-intro--${align}`}>
      <div className="section-intro__meta">
        <span className="eyebrow-number">{number}</span>
        <span className="eyebrow-line" />
        <span className="eyebrow-label">{eyebrow}</span>
      </div>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`arrow-link ${className}`} href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowUpRight size={15} strokeWidth={1.7} />
    </a>
  );
}

export function VerifiedLabel({ children }: { children: ReactNode }) {
  return (
    <span className="verified-label">
      <Check size={12} strokeWidth={2.2} />
      {children}
    </span>
  );
}

export function ExternalBadge() {
  return <ExternalLink size={14} strokeWidth={1.8} aria-hidden="true" />;
}
