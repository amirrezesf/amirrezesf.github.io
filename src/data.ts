import { Project } from "./types";

export const projects: Project[] = [
  {
    id: "project-1",
    category: "Fintech",
    title: "Finance App Design",
    description: "A comprehensive mobile finance dashboard built with Flutter. Features real-time tracking, expense analytics, and glassmorphism UI components.",
    techStack: ["Flutter", "Dart", "Firebase"],
    githubUrl: "https://github.com/amirrezesf/Finance-App",
    liveUrl: "#",
  },
  {
    id: "project-2",
    category: "SaaS",
    title: "Maze CRM Dashboard",
    description: "An enterprise-grade CRM dashboard for managing customer relationships and sales pipelines. High-performance data visualization with clean responsive views.",
    techStack: ["Vue.js", "Vuex", "Sass"],
    githubUrl: "https://github.com/amirrezesf/Maze-CRM",
  },
  {
    id: "project-3",
    category: "Real-time",
    title: "Chat Application",
    description: "End-to-end encrypted messaging application featuring real-time socket communication, adaptive screen state, and dynamic user status tracking.",
    techStack: ["React", "Node.js", "Socket.io"],
    githubUrl: "https://github.com/amirrezesf/Chat-App",
    liveUrl: "#",
  },
  {
    id: "project-4",
    category: "E-Commerce",
    title: "Food Delivery App",
    description: "Modern food ordering platform with integrated maps, payment gateways, and a custom delivery path tracking algorithm.",
    techStack: ["React Native", "Django", "PostgreSQL"],
    githubUrl: "https://github.com/amirrezesf/Food-App",
  },
];

export const skills: string[] = [
  "React / Next.js",
  "Vue.js",
  "TypeScript",
  "Django",
  "Python",
  "Node.js",
  "Flutter",
  "Docker",
  "Three.js",
  "PostgreSQL",
];
