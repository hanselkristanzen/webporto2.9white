import type { Project } from "../types/content";

export const projects: Project[] = [
  {
    slug: "stairslife",
    title: "StairsLife",
    role: "Frontend Development",
    category: "Product Engineering",
    description:
      "A freelancer marketplace platform that connects university students with UMKM clients seeking digital services.",
    whyItMatters:
      "It gives students a real channel to apply their skills professionally, while giving small businesses a practical way to access digital services.",
    technicallyInteresting:
      "Built with React and TypeScript as a two-sided marketplace interface — balancing discovery for business clients with a usable listing flow for student freelancers.",
    technologies: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Git"],
    link: "https://stairslife.com",
    featured: true,
    tags: ["CASE STUDY", "LIVE PROJECT", "FRONTEND"],
    visuals: [
      {
        image: "/images/projects/stairslife-app.webp",
        imageAlt: "StairsLife landing page — \"Work on Real Projects. Build Your Portfolio.\"",
        href: "https://stairslife.com",
      },
    ],
  },
  {
    slug: "mrcoffee",
    title: "MR.COFFEE",
    role: "UI/UX Design & Frontend Development",
    category: "Web Development / Product Design",
    description:
      "A coffee ordering website designed and developed as a complete digital coffee experience, including product discovery, filtering, add-ons, cart management, rewards, customer ordering, and responsive layouts.",
    whyItMatters:
      "It works as a complete ordering flow rather than a static menu — product discovery, per-item add-ons, and cart management all feed into a validated checkout, the way a real coffee shop's ordering site would need to.",
    technicallyInteresting:
      "Designed in Figma end to end before being built, with a cart that persists to localStorage across pages and browser sessions, per-item add-on modals that recalculate price live, and strict, regex-validated order-form input paired with a custom notification system in place of the browser's built-in alerts.",
    technologies: ["HTML", "CSS", "JavaScript", "Figma"],
    link: "https://mrcoffee-xi.vercel.app/",
    featured: true,
    tags: ["CASE STUDY", "LIVE PROJECT", "UI/UX DESIGN", "FRONTEND"],
    visuals: [
      {
        image: "/images/projects/mrcoffee-figma-hero.webp",
        imageAlt: "MR.COFFEE Figma design file — homepage hero, \"Where Every Sip Brews a Connection.\"",
        href: "https://www.figma.com/proto/uPHjGGQIDgnAvh2Uoy24cr/MR.-COFFEE?node-id=15-2&p=f&t=8LnSSVL9qLtTtrV6-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=15%3A2",
        label: "Figma Prototype",
        addressLabel: "figma.com",
      },
      {
        image: "/images/projects/mrcoffee-web-hero.webp",
        imageAlt: "MR.COFFEE live website — homepage hero, \"Where Every Sip Brews a Connection.\"",
        href: "https://mrcoffee-xi.vercel.app/",
        label: "Live Website",
      },
    ],
  },
];

/**
 * Future projects can be appended here without touching any presentation
 * code — the Projects section renders directly from this array.
 */
export const projectsComingSoon = true;
