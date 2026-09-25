import type { SkillGroup } from "../types/content";

export const skillGroups: SkillGroup[] = [
  {
    id: "development",
    label: "Development",
    skills: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Git", "GitHub"],
  },
  {
    id: "software-engineering",
    label: "Software Engineering",
    skills: [
      "Software Design",
      "Frontend Development",
      "Testing",
      "Version Control",
      "API Integration",
      "Problem Solving",
    ],
  },
  {
    id: "creative",
    label: "Creative",
    skills: ["UI Design", "Interaction Design", "Visual Design", "Prototyping"],
  },
];
