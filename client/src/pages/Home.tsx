import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Github,
  Linkedin,
  Mail,
  Menu,
  MousePointer2,
  Quote,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CareerTimeline } from "@/components/portfolio/CareerTimeline";
import { CaseStudyCard } from "@/components/portfolio/CaseStudyCard";
import { CapabilityConstellation } from "@/components/portfolio/CapabilityConstellation";
import { ArrowLink, Reveal, SectionIntro, SignalMark, VerifiedLabel } from "@/components/portfolio/PortfolioPrimitives";
import {
  accomplishments,
  capabilities,
  career,
  caseStudies,
  education,
  impactSignals,
  profile,
  technologyGroups,
} from "@/data/profile";
import { podcastEpisodes, podcastShow } from "@/data/content";

const navItems = [
  { id: "home", label: "Home", href: "#home" },
  { id: "about", label: "About", href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "impact", label: "Impact", href: "#impact" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "blogs", label: "Blogs", href: "/blogs", internal: true },
  { id: "podcast", label: "Podcast", href: "/podcast", internal: true },
  { id: "contact", label: "Contact", href: "#contact" },
];

function useActiveSection() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -62%", threshold: [0.12, 0.4, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

function SiteNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setOpen(false);
  };

  return (
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={() => scrollTo("home")} aria-label="Sumit Satsangi, back to top">
        <SignalMark compact />
        <span className="wordmark__text"><strong>SS</strong><small>DATA / DECISIONS</small></span>
      </a>
      <button className="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen((value) => !value)}>
        {open ? <X size={19} /> : <Menu size={19} />}
        <span className="sr-only">{open ? "Close" : "Open"} navigation</span>
      </button>
      <nav id="site-navigation" className={`site-nav${open ? " site-nav--open" : ""}`} aria-label="Primary navigation">
        {navItems.map((item, index) => (
          <a
            key={item.id}
            className={active === item.id ? "site-nav__link site-nav__link--active" : "site-nav__link"}
            href={item.href}
            onClick={(event) => { if (!item.internal) { event.preventDefault(); scrollTo(item.id); } }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>{item.label}
          </a>
        ))}
        <a className="site-nav__cta" href="#contact" onClick={(event) => { event.preventDefault(); scrollTo("contact"); }}>
          Let&apos;s Talk <ArrowUpRight size={14} />
        </a>
      </nav>
    </header>
  );
}

function HeroSignal() {
  return (
    <div className="hero-signal" aria-label="A visual summary of Sumit Satsangi's career journey">
      <div className="hero-signal__topline"><span>CAREER INTELLIGENCE / 01</span><span>2005 — NOW</span></div>
      <div className="hero-signal__grid" aria-hidden="true">
        <span className="hero-signal__axis hero-signal__axis--vertical" />
        <span className="hero-signal__axis hero-signal__axis--horizontal" />
        <span className="hero-signal__ring hero-signal__ring--one" />
        <span className="hero-signal__ring hero-signal__ring--two" />
        <span className="hero-signal__dot hero-signal__dot--one" />
        <span className="hero-signal__dot hero-signal__dot--two" />
        <span className="hero-signal__dot hero-signal__dot--three" />
        <span className="hero-signal__dot hero-signal__dot--four" />
        <span className="hero-signal__path" />
      </div>
      <div className="hero-signal__readout">
        <span className="data-label">Current readout</span>
        <strong>Context → Signal → Decision</strong>
        <span>Product leadership · analytics systems · stakeholder clarity</span>
      </div>
      <div className="hero-signal__legend"><span><i className="legend-dot legend-dot--active" /> active focus</span><span><i className="legend-dot" /> prior chapter</span></div>
    </div>
  );
}

function MetricCard({ value, label, detail, index }: { value: string; label: string; detail: string; index: number }) {
  return (
    <Reveal className="metric-card" delay={index * 0.05}>
      <motion.span className="metric-card__value" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.07, duration: 0.5 }}>{value}</motion.span>
      <span className="metric-card__label">{label}</span>
      <p>{detail}</p>
    </Reveal>
  );
}

export default function Home() {
  const activeSection = useActiveSection();
  const [showAllCredentials, setShowAllCredentials] = useState(false);
  const visibleCredentials = showAllCredentials ? accomplishments : accomplishments.slice(0, 4);
  const domainCount = useMemo(() => 7, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteNav active={activeSection} />
      <main id="main-content">
        <section id="home" className="hero section-shell">
          <div className="hero__copy">
            <div className="hero__eyebrow"><span className="status-dot" /> AVAILABLE FOR THE RIGHT PROBLEM</div>
            <p className="hero__kicker">Senior Manager Analytics <span>·</span> Business Consultant <span>·</span> Power BI Architect</p>
            <h1>{profile.headline}</h1>
            <p className="hero__intro">{profile.intro}</p>
            <div className="hero__actions">
              <a className="button button--solid" href="#projects">Explore My Work <ArrowRight size={16} /></a>
              <a className="button button--quiet" href="#contact">Let&apos;s Connect <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero__source"><span>{profile.sourceNote}</span><span className="hero__source-line" /><span>Public profile / source-grounded</span></div>
          </div>
          <HeroSignal />
          <div className="hero__scroll-cue"><ArrowDown size={15} /> <span>Scroll to read the signal</span></div>
        </section>

        <section id="about" className="section-shell section-shell--rule about-section">
          <SectionIntro number="01" eyebrow="Positioning" title="Where business meets data.">
            The dashboard is never the whole story. The useful work happens between the question a leader is asking, the system that can answer it, and the team that can carry the answer into the operating rhythm.
          </SectionIntro>
          <div className="about-grid">
            <Reveal className="about-statement">
              <Quote size={30} strokeWidth={1.2} />
              <p>I work across business strategy, analytics, business intelligence, Power BI, data engineering, automation, and delivery leadership — with enough context to see the system, and enough detail to make it move.</p>
              <span className="about-signoff">— Sumit Satsangi / Data & Analytics Leader</span>
            </Reveal>
            <Reveal className="about-notes" delay={0.08}>
              <div className="about-note"><span>01</span><div><strong>Ask the useful question</strong><p>Translate stakeholder intent into a measurable, workable brief.</p></div></div>
              <div className="about-note"><span>02</span><div><strong>Build the signal</strong><p>Shape the data, model the logic, and make the result legible.</p></div></div>
              <div className="about-note"><span>03</span><div><strong>Lead the outcome</strong><p>Connect the delivery team, operating rhythm, and decision-maker.</p></div></div>
              <div className="about-domains"><span className="data-label">Source coverage</span><strong>{domainCount}</strong><p>domains and operating contexts referenced across the public profile.</p></div>
            </Reveal>
          </div>
          <CapabilityConstellation capabilities={capabilities} />
        </section>

        <section id="experience" className="section-shell section-shell--dark">
          <SectionIntro number="02" eyebrow="Experience" title="A career built in the middle of complexity.">
            From commercial lending operations to analytics leadership and product delivery, the through-line is the same: turn an unclear operating problem into something a team can see, act on, and improve.
          </SectionIntro>
          <CareerTimeline entries={career} />
        </section>

        <section id="impact" className="section-shell section-shell--rule impact-section">
          <div className="impact-heading">
            <SectionIntro number="03" eyebrow="Selected impact" title="The proof is in the pattern." />
            <p className="impact-heading__note">These signals are drawn from the public source material — not inflated with unverified claims.</p>
          </div>
          <div className="metrics-grid">
            {impactSignals.map((signal, index) => <MetricCard key={signal.label} {...signal} index={index} />)}
          </div>
          <div className="impact-footnote"><span className="impact-footnote__mark">+</span><p>Every number has a source. Every outcome has context. The work is to make both useful.</p><span className="impact-footnote__line" /></div>
        </section>

        <section id="projects" className="section-shell projects-section">
          <div className="projects-heading">
            <SectionIntro number="04" eyebrow="Selected work" title="Two questions. Two different signals.">
              Public analytics work is a useful window into the way I think: start with the decision, then build the evidence around it.
            </SectionIntro>
            <div className="projects-heading__side"><MousePointer2 size={18} /><span>Hover the evidence<br />to read the outcome</span></div>
          </div>
          <div className="case-study-list">
            {caseStudies.map((study, index) => <CaseStudyCard key={study.title} study={study} index={index} />)}
          </div>
        </section>

        <section className="section-shell podcast-spotlight" aria-labelledby="podcast-spotlight-heading">
          <div className="podcast-spotlight__art"><img src={podcastShow.artwork} alt={`${podcastShow.title} album art`} loading="lazy" /></div>
          <div className="podcast-spotlight__copy"><span className="data-label">New / Podcast</span><h2 id="podcast-spotlight-heading">Productivity Playbook.</h2><p>{podcastShow.description}</p><span className="podcast-spotlight__latest">Latest: {podcastEpisodes[0].title}</span><a className="text-link" href="/podcast">Explore the podcast archive <ArrowUpRight size={15} /></a></div>
        </section>

        <section id="technology" className="section-shell section-shell--dark technology-section">
          <div className="technology-heading"><SectionIntro number="05" eyebrow="Power BI & analytics" title="The technology landscape is a system, not a list." /><div className="technology-heading__signal">{[1, 2, 3, 4, 5, 6].map((bar) => <span key={bar} style={{ height: `${20 + bar * 11}%` }} />)}</div></div>
          <div className="technology-groups">
            {technologyGroups.map((group, index) => (
              <Reveal key={group.label} className="technology-group" delay={index * 0.06}>
                <div className="technology-group__head"><span className="eyebrow-number">0{index + 1}</span><div><h3>{group.label}</h3><p>{group.note}</p></div></div>
                <div className="technology-group__items">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="leadership" className="section-shell section-shell--rule leadership-section">
          <SectionIntro number="06" eyebrow="Leadership" title="More than a technical specialist.">
            Senior work lives in the translation layer: between a CXO request and a Jira story, between a metric and a decision, between a team and the outcome it owns.
          </SectionIntro>
          <div className="leadership-grid">
            <Reveal className="leadership-lead"><span className="data-label">Operating belief</span><h3>Clarity is a leadership tool.</h3><p>Good requirements, visible operating metrics, and a dependable delivery cadence give teams the space to do better work.</p><a className="text-link" href="#contact">Start a conversation <ArrowUpRight size={15} /></a></Reveal>
            <div className="leadership-list">
              {["Stakeholder management", "Team leadership", "Agile / Scrum / SAFe", "Requirements & strategy", "Executive communication", "Operational governance", "Training & enablement", "Transformation & process improvement"].map((item, index) => <Reveal key={item} className="leadership-item" delay={index * 0.04}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><Check size={15} /></Reveal>)}
            </div>
          </div>
        </section>

        <section id="thought-leadership" className="section-shell thought-section">
          <div className="thought-heading"><SectionIntro number="07" eyebrow="Thought leadership" title="An ongoing body of work."><span>Not a row of social icons. A set of public places where the thinking can be seen.</span></SectionIntro><Sparkles size={24} strokeWidth={1.2} /></div>
          <div className="thought-links">
            <a href={profile.links.posts} target="_blank" rel="noreferrer" className="thought-link"><span className="thought-link__index">01</span><div><strong>Articles & notes</strong><p>Long-form reflections, analytics concepts, and practical learning.</p></div><ArrowUpRight size={18} /></a>
            <a href={profile.links.tableau} target="_blank" rel="noreferrer" className="thought-link"><span className="thought-link__index">02</span><div><strong>Tableau Public</strong><p>Visual work that makes a business question easier to explore.</p></div><ArrowUpRight size={18} /></a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="thought-link"><span className="thought-link__index">03</span><div><strong>GitHub</strong><p>Challenge work and public analytics experiments.</p></div><ArrowUpRight size={18} /></a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="thought-link"><span className="thought-link__index">04</span><div><strong>LinkedIn</strong><p>Professional context, working notes, and conversations.</p></div><ArrowUpRight size={18} /></a>
          </div>
        </section>

        <section className="section-shell section-shell--rule credentials-section" aria-labelledby="credentials-heading">
          <div className="credentials-heading"><div><span className="data-label">Verified credentials</span><h2 id="credentials-heading">Signals of continuous learning.</h2></div><button type="button" className="text-button" onClick={() => setShowAllCredentials((value) => !value)}>{showAllCredentials ? "Show less" : "View all"}<ChevronDown className={showAllCredentials ? "rotate-180" : ""} size={16} /></button></div>
          <div className="credential-list">{visibleCredentials.map((item, index) => <Reveal key={item} className="credential-item" delay={index * 0.04}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><VerifiedLabel>Source-listed</VerifiedLabel></Reveal>)}</div>
          <div className="education-strip">
            <div className="education-strip__heading"><span className="data-label">Education</span><p>Formal foundations behind the operating context.</p></div>
            <div className="education-strip__items">
              {education.map((item) => <div className="education-item" key={item.degree}><span className="education-item__period">{item.period}</span><div><strong>{item.degree}</strong><p>{item.institution}</p><span>{item.note}</span></div></div>)}
            </div>
          </div>
        </section>

        <section className="section-shell beyond-section" aria-labelledby="beyond-heading">
          <div className="beyond-copy"><span className="data-label">Beyond the resume</span><h2 id="beyond-heading">Curiosity is part of the job.</h2><p>Continuous learning, productivity, technology, and leadership are not separate interests here. They are the habits that keep the work useful as the tools and questions change.</p></div>
          <div className="beyond-orbit" aria-hidden="true"><span>LEARN</span><span>BUILD</span><span>LEAD</span><SignalMark /></div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-section__grid" aria-hidden="true" />
          <div className="contact-section__inner section-shell">
            <span className="data-label">08 / Contact</span>
            <h2>Have an interesting problem?</h2>
            <p>If the work sits somewhere between a business question, an analytics system, and a team that needs to deliver — let&apos;s talk.</p>
            <div className="contact-actions"><a className="button button--solid" href={`mailto:${profile.email}`}>Email Sumit <Mail size={16} /></a><a className="button button--outline-light" href={profile.links.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <Linkedin size={16} /></a></div>
            <div className="contact-intents"><span>Consulting</span><span>Analytics leadership</span><span>Power BI</span><span>Data transformation</span><span>Speaking / podcast</span><span>Collaboration</span></div>
          </div>
        </section>
      </main>
      <footer className="site-footer"><div className="site-footer__brand"><SignalMark compact /><span>Sumit Satsangi / Turning Data Into Decisions</span></div><div className="site-footer__links"><a href={`mailto:${profile.email}`}><Mail size={14} /> Email</a><a href={profile.links.github} target="_blank" rel="noreferrer"><Github size={14} /> GitHub</a><a href={profile.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={14} /> LinkedIn</a><a href="/admin">Admin</a></div><span className="site-footer__note">Built around public source material · {new Date().getFullYear()}</span></footer>
    </div>
  );
}
