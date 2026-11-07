import webchatThumb from "../assets/images/project-webchat.svg";
import portfolioThumb from "../assets/images/project-portfolio.svg";

// demo: null renders a disabled "Not deployed yet" link.
// tone: thumbnail background ("dark" | "light"), picks the contrasting round button.
export const projects = [
  {
    id: "webchat",
    thumbnail: webchatThumb,
    tone: "dark",
    tags: ["React", "TypeScript", "Node.js", "Socket.IO", "PostgreSQL", "Redis", "WebRTC", "Docker"],
    github: "https://github.com/Phanduylong708/webchat",
    demo: "https://my-webchat.duckdns.org/",
    content: {
      en: {
        title: "Webchat — Fullstack",
        summary:
          "Real-time chat app: add friends, message and video call. Optimistic UI, cursor-paginated history and WebRTC peer-to-peer calls.",
        thumbnailAlt: "Webchat project preview",
        highlights: [
          "Docker + CI/CD on AWS EC2 cut release time from 30 to 3 minutes.",
          "Zustand + TanStack Query with optimistic updates removed ~90% of perceived send delay.",
          "Redis session cache and INCR/TTL rate limiting against message spam.",
        ],
      },
    },
  },
  {
    id: "portfolio",
    thumbnail: portfolioThumb,
    tone: "light",
    tags: ["React", "React Router", "GSAP", "Three.js", "Vite"],
    github: "https://github.com/Phanduylong708/Portfolio",
    demo: "https://portfolio2-tau-ecru.vercel.app",
    content: {
      en: {
        title: "Personal Portfolio",
        summary:
          "This site: a data-driven React CV with GSAP route transitions, a WebGL hero, project filtering and a validated contact form.",
        thumbnailAlt: "Personal portfolio project preview",
        highlights: [
          "Two GSAP route transitions with interrupt, back/forward and reduced-motion handling.",
          "Content separated into data and i18n dictionaries, ready for a Vietnamese version.",
        ],
      },
    },
  },
];

export const projectTags = [...new Set(projects.flatMap((p) => p.tags))];
