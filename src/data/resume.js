// Resume timeline. Dates stay locale-independent; prose lives under content.<locale>.
export const education = [
  {
    id: "greenwich",
    start: "2022",
    end: "2026",
    gpa: "3.4",
    content: {
      en: {
        school: "University of Greenwich",
        major: "Bachelor of Science in Computer Science",
      },
    },
  },
];

export const experience = [
  {
    id: "odyssey",
    start: "08/2026",
    end: "11/2026",
    content: {
      en: {
        company: "Odyssey Software Company",
        role: "Frontend Developer Intern",
        location: "Ho Chi Minh City",
        points: [
          "Developed responsive web pages for an online education platform using React, JavaScript, HTML, CSS and Figma designs, so students can find and browse courses on any device.",
          "Built cart and user authentication flows by integrating RESTful APIs, using Claude AI to speed up development, so users sign in securely and buy courses in a few clicks.",
          "Worked in an Agile team with Jira, prioritising tickets and folding in founder feedback from weekly meetings to deliver features on schedule.",
        ],
      },
    },
  },
  {
    id: "fpt",
    start: "05/2026",
    end: "08/2026",
    content: {
      en: {
        company: "FPT Software",
        role: "Mobile Developer Intern",
        location: "Ho Chi Minh City",
        points: [
          "Built a cinema ticket booking app with Kotlin, RESTful APIs and OOP principles, letting users pick seats and buy tickets quickly on their phone.",
          "Worked daily with a team of 4 developers, using Git and GitHub pull requests and acting on senior feedback to fix bugs before merging.",
        ],
      },
    },
  },
];
