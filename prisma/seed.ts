import { PrismaClient } from "@prisma/client";
import { QUESTIONS } from "../src/data/questions";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.question.count();
  if (existing > 0) {
    console.log(`Question bank already has ${existing} questions; clearing and reseeding.`);
    await prisma.questionAttempt.deleteMany();
    await prisma.question.deleteMany();
  }

  for (const q of QUESTIONS) {
    await prisma.question.create({
      data: {
        section: q.section,
        subtopic: q.subtopic,
        difficulty: q.difficulty,
        passage: q.passage,
        prompt: q.prompt,
        choicesJson: JSON.stringify(q.choices),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        inDiagnostic: q.inDiagnostic,
      },
    });
  }

  console.log(`Seeded ${QUESTIONS.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
