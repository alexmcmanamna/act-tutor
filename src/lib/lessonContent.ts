import { getLesson, youtubeSearchUrl } from "@/data/lessons";
import { QUESTIONS, type SeedQuestion } from "@/data/questions";
import { sectionLabel, subtopicLabel, type SectionKey } from "@/data/subtopics";

export interface LessonStageContent {
  section: SectionKey;
  subtopic: string;
  title: string;
  sectionLabel: string;
  subtopicLabel: string;
  /** Stage 1 — "Learn": the mental model / what this question type is. */
  concept: string[];
  /** Stage 2 — "Example": one worked example pulled from the real question bank. */
  example: SeedQuestion | null;
  /** Stage 3 — "Rule": the concrete step-by-step approach to use on test day. */
  decisionRule: string[];
  /** Stage 4 — "Try it": lead-in copy before practice questions begin. */
  tryItIntro: string;
  youtubeUrl: string;
}

/**
 * Builds the reference app's 4-stage guided-lesson shape (Learn / Example /
 * Rule / Try it) out of our existing authored lesson content + real question
 * bank, rather than re-authoring 16 lessons from scratch. The concept comes
 * from the lesson body, the decision rule reuses its key takeaways (already
 * written as actionable rules), and the worked example is a real bank
 * question for this subtopic.
 */
export function buildLessonStages(section: SectionKey, subtopic: string): LessonStageContent | null {
  const lesson = getLesson(section, subtopic);
  if (!lesson) return null;

  const paragraphs = lesson.body.split("\n\n").filter(Boolean);

  const candidates = QUESTIONS.filter((q) => q.section === section && q.subtopic === subtopic).sort(
    (a, b) => a.difficulty - b.difficulty
  );
  const example = candidates[0] ?? null;

  return {
    section,
    subtopic,
    title: lesson.title,
    sectionLabel: sectionLabel(section),
    subtopicLabel: subtopicLabel(section, subtopic),
    concept: paragraphs,
    example,
    decisionRule: lesson.keyTakeaways,
    tryItIntro: `Now it's your turn — you'll get a short set of ${subtopicLabel(section, subtopic)} practice questions, ACT-style.`,
    youtubeUrl: youtubeSearchUrl(lesson.youtubeSearchQuery),
  };
}
