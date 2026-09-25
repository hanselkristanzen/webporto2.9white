import type { OrganizationEntry } from "../types/content";

export const organizations: OrganizationEntry[] = [
  {
    id: "b-preneur",
    name: "B-Preneur",
    fullName: "Binus Entrepreneur",
    roles: [{ id: "member", title: "Member", start: "Sep 2024", end: "Present" }],
  },
  {
    id: "himti",
    name: "HIMTI",
    fullName: "HIMTI BINUS University",
    roles: [
      {
        id: "publication-documentation",
        title: "Publication & Documentation Committee",
        start: "Sep 2024",
        end: "Sep 2025",
      },
      {
        id: "hishot-sponsorship",
        title: "Sponsorship Committee — HISHOT",
        start: "Jun 2025",
        end: "Jun 2025",
      },
    ],
  },
  {
    id: "kolese-loyola",
    name: "Kolese Loyola",
    fullName: "SMA Kolese Loyola — Student Committees",
    roles: [
      {
        id: "yearbook-fundraising",
        title: "Class Yearbook Fundraising Coordinator",
        start: "Aug 2023",
        end: "Jun 2024",
      },
      {
        id: "guest-reception",
        title: "Guest Reception Committee",
        start: "Jan 2024",
        end: "Feb 2024",
      },
      {
        id: "losaac-sponsorship",
        title: "Sponsorship Committee — LOSAAC Fest 2023",
        start: "Jan 2023",
        end: "May 2023",
      },
      {
        id: "bioskop-loyola-sponsorship",
        title: "Event Sponsorship Committee — Bioskop Loyola 2023",
        start: "Aug 2022",
        end: "Feb 2023",
      },
      {
        id: "malsos-equipment",
        title: "Event Equipment Committee — Malsos 2022",
        start: "Jan 2022",
        end: "Jul 2022",
      },
    ],
  },
];
