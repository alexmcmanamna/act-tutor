import { redirect } from "next/navigation";
import { getStudentIdFromCookies } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { SECTIONS, SUBTOPICS, sectionLabel } from "@/data/subtopics";
import { QuestionTypeSlides, type QuestionTypeSlide } from "@/components/QuestionTypeSlides";

export default async function OnboardingOverviewPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const slides: QuestionTypeSlide[] = [];
  for (const { key: section } of SECTIONS) {
    for (const s of SUBTOPICS[section]) {
      // Prefer an easy/medium example — this is a teaching preview, not a test.
      const question =
        (await prisma.question.findFirst({ where: { section, subtopic: s.key, difficulty: { lte: 2 } }, orderBy: { difficulty: "asc" } })) ??
        (await prisma.question.findFirst({ where: { section, subtopic: s.key } }));
      if (!question) continue;
      slides.push({
        section,
        sectionLabel: sectionLabel(section),
        subtopicLabel: s.label,
        passage: question.passage,
        prompt: question.prompt,
        choices: JSON.parse(question.choicesJson) as string[],
        correctIndex: question.correctIndex,
        explanation: question.explanation,
      });
    }
  }

  return <QuestionTypeSlides slides={slides} />;
}
