import type { ContactChannel } from "../types/content";

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    value: "hanselkristanzen@gmail.com",
    href: "mailto:hanselkristanzen@gmail.com",
  },
  {
    id: "academic-email",
    label: "Academic",
    value: "hansel.siswanto@binus.ac.id",
    href: "mailto:hansel.siswanto@binus.ac.id",
  },
  {
    id: "phone",
    label: "Phone",
    value: "822-2350-8383",
    href: "tel:+6282223508383",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "in/hanselkristanzen",
    href: "https://www.linkedin.com/in/hanselkristanzen",
    external: true,
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@hanselkristanzen",
    href: "https://www.instagram.com/hanselkristanzen",
    external: true,
  },
];
