export interface Project {
  id: string;
  category: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

export interface Skill {
  name: string;
  category: string;
}
