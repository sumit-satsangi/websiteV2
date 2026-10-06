export type CareerEntry = {
  id: string;
  period: string;
  role: string;
  organization: string;
  category: string;
  industry: string;
  location?: string;
  subRoles?: string[];
  technologies: string[];
  summary: string;
  outcome: string;
};

export type Capability = {
  id: string;
  label: string;
  description: string;
  group: string;
};

export type CaseStudy = {
  number: string;
  title: string;
  type: string;
  challenge: string;
  approach: string;
  technology: string[];
  role: string;
  outcome: string;
  href: string;
  hrefLabel: string;
  accent: string;
};

export const profile = {
  name: "Sumit Satsangi",
  shortName: "SS",
  eyebrow: "Data & Analytics Leader · Business Consultant · Power BI Architect",
  headline: "Turning Data Into Decisions.",
  intro:
    "I work where business questions, analytics systems, and delivery leadership meet — translating operational complexity into clear decisions and measurable execution.",
  sourceNote: "Based in Pune, India · 20+ years across data, analytics & operations",
  email: "sumit.satsangi@aol.com",
  links: {
    linkedin: "https://www.linkedin.com/in/sumitsatsangi",
    github: "https://github.com/sumit-satsangi",
    tableau: "https://public.tableau.com/app/profile/sumitsatsangi",
    twitter: "https://twitter.com/sumit_satsangi",
    posts: "https://www.sumitsatsangi.com/posts/",
  },
};

export const career: CareerEntry[] = [
  {
    id: "astraa",
    period: "Mar 2022 — now",
    role: "Product Manager",
    organization: "Astraa · a Saama brand",
    category: "Leadership",
    industry: "Analytics delivery",
    location: "Pune, India",
    technologies: ["Jira", "Confluence", "Power BI", "Data operations"],
    summary:
      "Owns the translation of CXO-level requirements into clear delivery stories, product documentation, and coordinated execution.",
    outcome:
      "Leads a cross-functional team of 5 data engineers, 3 quality analysts, and 1 business analyst for predictable day-to-day delivery.",
  },
  {
    id: "genpact-analytics",
    period: "Aug 2012 — Mar 2022",
    role: "Strategy & Analytics / Business Intelligence",
    organization: "Genpact",
    category: "Analytics",
    industry: "Operations & business intelligence",
    location: "Jaipur, India",
    subRoles: [
      "Manager Strategy & Analytics · May 2021 — Mar 2022",
      "Assistant Manager / Senior Business Analyst · Jun 2017 — May 2021",
      "Resident Expert / Business Productivity Analyst · Apr 2014 — Jun 2017",
      "SME / Loan Portfolio Analyst · Aug 2012 — Apr 2014",
    ],
    technologies: ["Power BI", "Tableau", "R", "SQL", "Alteryx", "DAX"],
    summary:
      "Built productivity, income leakage, service-level, BSA/MSA, and operational metrics while leading analysts and senior analysts.",
    outcome:
      "Turned stakeholder questions into tangible inferences, predictive analysis, dashboards, and automated standard work.",
  },
  {
    id: "training",
    period: "Sep 2007 — Jul 2012",
    role: "Independent Training Professional",
    organization: "Infosys · Bank of America · Genpact · others",
    category: "Enablement",
    industry: "Learning & capability building",
    technologies: ["Advanced Excel", "Soft skills", "Personality development"],
    summary:
      "Delivered training across soft skills, personality development, competency-based learning, and Advanced Excel.",
    outcome:
      "Worked across client and community contexts as a vendor and independent training professional.",
  },
  {
    id: "genpact-banking",
    period: "Sep 2005 — Apr 2007",
    role: "Subject Matter Expert",
    organization: "Genpact · formerly GE Capital International Services",
    category: "Banking",
    industry: "Commercial lending operations",
    location: "Jaipur, India",
    technologies: ["Excel", "ACBS", "Siebel 8.1.1", "Webcash", "CTX+"],
    summary:
      "Supported UK merchant account opening and maintained productivity reports and process one-pagers for stakeholder review.",
    outcome:
      "Earned two bronze awards and one silver award, progressed quickly, and contributed to the Lean Team.",
  },
];

export const capabilities: Capability[] = [
  { id: "strategy", label: "Business strategy", description: "Clarifying the question before choosing the metric.", group: "Business" },
  { id: "analytics", label: "Analytics", description: "Moving from descriptive signals to useful inference.", group: "Insight" },
  { id: "bi", label: "Business intelligence", description: "Designing reporting that supports operating rhythm.", group: "Insight" },
  { id: "powerbi", label: "Power BI", description: "Building decision-ready dashboards and models.", group: "Delivery" },
  { id: "engineering", label: "Data engineering", description: "Creating the dependable flow behind the visible result.", group: "Delivery" },
  { id: "ai", label: "AI & automation", description: "Reducing manual effort through repeatable systems.", group: "Systems" },
  { id: "leadership", label: "Team leadership", description: "Giving cross-functional teams a clear route to done.", group: "People" },
  { id: "consulting", label: "Consulting", description: "Bridging executive intent and delivery detail.", group: "Business" },
];

export const impactSignals = [
  {
    value: "20+",
    label: "years in the field",
    detail: "A career spanning data, analytics, operations, training, banking, healthcare, insurance, consulting, and more.",
  },
  {
    value: "7",
    label: "public distinctions & credentials",
    detail: "Lean Ace, Green Belt, CSM, SAFe Scrum Master, Google BI, ETL Testing, and Certificate of Merit.",
  },
  {
    value: "4",
    label: "career chapters",
    detail: "Banking operations, independent training, strategy and analytics, and product leadership.",
  },
  {
    value: "2",
    label: "public analytics case studies",
    detail: "Maven Toys and Maven Restaurant projects, linked to public GitHub and Tableau work.",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    number: "01",
    title: "Maven Toys Challenge",
    type: "Expansion planning · Power BI visualization",
    challenge: "Formulate an expansion plan with reasons and supporting data.",
    approach: "Structured the challenge around the evidence a decision-maker would need before choosing where to expand.",
    technology: ["Power BI", "Data analysis", "Visualization"],
    role: "Analytics challenge contestant",
    outcome: "A public analysis that makes the expansion question legible through supporting data.",
    href: "https://github.com/sumit-satsangi/MavenChallenges/tree/2021.05-Toy-Challenge",
    hrefLabel: "View the GitHub work",
    accent: "amber",
  },
  {
    number: "02",
    title: "Maven Restaurant Challenge",
    type: "Investment criteria · Tableau visualization",
    challenge: "Outline what to look for in a restaurant investment and support the recommendation with data.",
    approach: "Translated the investment question into a visual analysis of the signals that could inform a decision.",
    technology: ["Tableau", "Statistics", "Data storytelling"],
    role: "Analytics challenge contestant",
    outcome: "A public dashboard that turns restaurant investment criteria into an explorable story.",
    href: "https://public.tableau.com/app/profile/sumitsatsangi/viz/Maven_Restaurant_Challenge_Sumit/Dashboard",
    hrefLabel: "Open the Tableau dashboard",
    accent: "sage",
  },
];

export const technologyGroups = [
  { label: "Decision layer", note: "Make the signal visible", items: ["Power BI", "Tableau", "AWS QuickSight"] },
  { label: "Model & automate", note: "Reduce repetitive work", items: ["DAX", "M Query", "Alteryx", "Power Query", "VBA"] },
  { label: "Query & cleanse", note: "Shape the underlying evidence", items: ["SQL", "R", "Advanced Excel"] },
  { label: "Operational context", note: "Work where the business operates", items: ["OBIEE", "Spotfire", "Box", "ACBS", "Siebel", "Webcash", "CTX+"] },
];

export const accomplishments = [
  "Lean Ace · 7 Star Lean Certification",
  "Green Belt Certification",
  "Certificate of Merit · Ministry of HRD, Government of India",
  "Google · Foundations of Business Intelligence",
  "ETL Testing · From Beginner to Expert",
  "CSM® Certification",
  "Certified SAFe® 6 Scrum Master",
];

export const education = [
  {
    degree: "Bachelor in Science",
    institution: "University of Rajasthan · Maharaja’s College",
    period: "2001 — 2004",
    note: "Grade: 69%",
  },
  {
    degree: "High School",
    institution: "Central Academy · Rajasthan Board of Secondary Education",
    period: "2000 — 2001",
    note: "Grade: 72% · Physics, Chemistry, Mathematics",
  },
];
