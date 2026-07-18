export type SectionKey = "ENGLISH" | "MATH" | "READING" | "SCIENCE";

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "ENGLISH", label: "English" },
  { key: "MATH", label: "Math" },
  { key: "READING", label: "Reading" },
  { key: "SCIENCE", label: "Science" },
];

export const SUBTOPICS: Record<SectionKey, { key: string; label: string }[]> = {
  ENGLISH: [
    { key: "punctuation", label: "Punctuation" },
    { key: "sentence-structure", label: "Sentence Structure & Grammar" },
    { key: "redundancy", label: "Redundancy & Wordiness" },
    { key: "transitions", label: "Transitions & Logic" },
    { key: "word-choice", label: "Word Choice & Idiom" },
  ],
  MATH: [
    { key: "pre-algebra", label: "Pre-Algebra & Number Sense" },
    { key: "algebra", label: "Algebra" },
    { key: "geometry", label: "Geometry" },
    { key: "trigonometry", label: "Trigonometry" },
  ],
  READING: [
    { key: "main-idea", label: "Main Idea & Purpose" },
    { key: "detail", label: "Detail & Evidence" },
    { key: "inference", label: "Inference" },
    { key: "vocab-in-context", label: "Vocabulary in Context" },
  ],
  SCIENCE: [
    { key: "data-representation", label: "Data Representation" },
    { key: "research-summary", label: "Research Summaries" },
    { key: "conflicting-viewpoints", label: "Conflicting Viewpoints" },
  ],
};

export function subtopicLabel(section: SectionKey, key: string): string {
  return SUBTOPICS[section].find((s) => s.key === key)?.label ?? key;
}

export function sectionLabel(section: SectionKey): string {
  return SECTIONS.find((s) => s.key === section)?.label ?? section;
}
