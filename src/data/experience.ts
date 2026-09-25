import type { ExperienceEntry } from "../types/content";

/**
 * Primary professional experience. Organizational / committee involvement
 * (HIMTI, Kolese Loyola) lives in `organizations.ts` — kept separate so the
 * Experience timeline stays focused on employment, per the site's
 * information hierarchy (Experience = primary, Organizations = secondary).
 * Sorted reverse-chronologically via `sortKey`.
 */
const rawExperience: ExperienceEntry[] = [
  {
    id: "store-assistant",
    role: "Store Assistant",
    organization: "CV Bumi Gemilang Karya",
    start: "Mar 2026",
    end: "Apr 2026",
    location: "Riau, Indonesia",
    mode: "On-site",
    sortKey: "2026-04",
  },
  {
    id: "business-assistant",
    role: "Business Assistant",
    organization: "PT Harpazo Megah Eka Jaya",
    start: "Feb 2025",
    end: "Feb 2025",
    location: "Jakarta, Indonesia",
    mode: "On-site",
    sortKey: "2025-02",
    image: "/images/experience/pt-harpazo.jpg",
    imageAlt: "Hansel on-site at a PT Harpazo Megah Eka Jaya construction project in Jakarta",
  },
  {
    id: "plantation-operations-assistant",
    role: "Plantation Operations Assistant",
    organization: "Independent Oil Palm Plantation",
    start: "May 2024",
    end: "Jun 2024",
    location: "Riau, Indonesia",
    mode: "On-site",
    sortKey: "2024-06",
    image: "/images/experience/oil-palm-plantation.jpg",
    imageAlt: "Hansel standing at an oil palm plantation in Riau, Indonesia",
  },
];

export const experience: ExperienceEntry[] = [...rawExperience].sort((a, b) =>
  a.sortKey < b.sortKey ? 1 : -1
);
