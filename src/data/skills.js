// Proficiency runs 1–3; labels live in the i18n dictionary (skills.levels).
export const SKILL_LEVEL_MAX = 3;

export const technicalSkills = [
  {
    id: "language",
    items: [
      { name: "JavaScript / TypeScript", level: 3 },
      { name: "HTML", level: 3 },
      { name: "CSS", level: 3 },
    ],
  },
  {
    id: "frontend",
    items: [
      { name: "ReactJS", level: 3 },
      { name: "TanStack Query", level: 2 },
      { name: "Zustand", level: 2 },
      { name: "TailwindCSS", level: 2 },
      { name: "WebRTC", level: 1 },
    ],
  },
  {
    id: "backend",
    items: [
      { name: "Node.js", level: 2 },
      { name: "Express.js", level: 2 },
      { name: "Socket.IO", level: 2 },
      { name: "PostgreSQL", level: 2 },
      { name: "Prisma ORM", level: 2 },
      { name: "Redis", level: 1 },
    ],
  },
  {
    id: "tools",
    items: [
      { name: "Git & GitHub", level: 3 },
      { name: "Docker", level: 1 },
      { name: "AWS EC2 · CI/CD", level: 1 },
      { name: "Figma", level: 2 },
      { name: "Jira", level: 2 },
    ],
  },
];

export const softSkills = {
  content: {
    en: [
      { name: "Teamwork", note: "Shipped features in Agile teams of 4+ with code review." },
      { name: "Communication", note: "Turned weekly founder feedback into scoped tickets." },
      { name: "Self-learning", note: "Picked up WebRTC, Redis and Docker for my own project." },
      { name: "Problem solving", note: "Traced re-render and reconnect issues down to their cause." },
    ],
  },
};

export const languages = [
  {
    id: "english",
    content: { en: { name: "English", level: "VSTEP B2 — upper-intermediate" } },
  },
  {
    id: "vietnamese",
    content: { en: { name: "Vietnamese", level: "Native" } },
  },
];
