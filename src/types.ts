import type { SectionKey } from "@/data/subtopics";

export interface ClientQuestion {
  id: string;
  section: SectionKey;
  subtopic: string;
  difficulty: number;
  passage: string | null;
  prompt: string;
  choices: string[];
}
