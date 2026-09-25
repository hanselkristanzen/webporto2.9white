export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectVisual {
  /** Path (under /public) to a real screenshot of the shipped product. */
  image: string;
  imageAlt: string;
  /** Where the browser-chrome mockup opens to when clicked. */
  href: string;
  /**
   * Short caption shown above the mockup — e.g. "Figma Prototype", "Live
   * Website". Only rendered when set, so a project with a single,
   * unambiguous visual (the common case) doesn't grow a label it doesn't
   * need.
   */
  label?: string;
  /**
   * Text shown in the mockup's address-bar pill. Defaults to a bare version
   * of `href` (matches what a real browser chrome would show) — set this
   * explicitly when `href` isn't itself a good address to display verbatim
   * (a long design-tool URL with query params, say).
   */
  addressLabel?: string;
}

export interface Project {
  slug: string;
  title: string;
  year?: string;
  role: string;
  category: string;
  description: string;
  /**
   * Case-study narrative fields, shown under "Why it matters" / "Technically
   * interesting" when present. Optional: a project can ship with just the
   * fields it has real, specific answers for.
   */
  whyItMatters?: string;
  technicallyInteresting?: string;
  technologies: string[];
  link?: string;
  github?: string;
  featured: boolean;
  tags: string[];
  metrics?: ProjectMetric[];
  /**
   * One or more clickable previews of the shipped product, rendered as
   * browser-chrome mockups. Most projects have exactly one; a project can
   * supply several (e.g. a design-tool prototype alongside the live site) —
   * each renders as its own tile, labelled when `label` is set. Omit
   * entirely for a project with no visual yet ("Preview coming soon").
   */
  visuals?: ProjectVisual[];
}

export interface ModelResult {
  id: string;
  name: string;
  shortName: string;
  methodology: string;
  accuracy: number | null;
  latencyMs: number | null;
  robustnessDropPp: number | null;
  note?: string;
}

export interface ResearchAuthor {
  name: string;
  isMe?: boolean;
}

export interface ResearchProject {
  slug: string;
  title: string;
  venue: string;
  status: string;
  year: string;
  summary: string;
  authors: ResearchAuthor[];
  dataset: {
    size: number;
    intentCategories: number;
    language: string;
    domains: string[];
    characteristics: string[];
  };
  models: ModelResult[];
  limitation: string;
}

export type WorkMode = "On-site" | "Remote" | "Hybrid";

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  start: string;
  end: string;
  location: string;
  mode: WorkMode;
  sortKey: string; // YYYY-MM, used for chronological ordering
  description?: string;
  /** Path (under /public) to a photo from this role, if available. */
  image?: string;
  imageAlt?: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  focus?: string;
  start: string;
  end: string;
  location: string;
  distinction?: string;
}

export interface OrgRole {
  id: string;
  title: string;
  start: string;
  end: string;
}

export interface OrganizationEntry {
  id: string;
  name: string;
  fullName?: string;
  roles: OrgRole[];
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  imageAlt?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: string[];
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}
