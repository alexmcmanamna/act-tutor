import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { RoundCompleteClient } from "@/components/RoundCompleteClient";

export default async function RoundCompletePage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  const plan = await prisma.studyPlan.findFirst({
    where: { studentId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  const roundItems = plan?.items.filter((i) => i.round === student.currentRound) ?? [];
  const roundComplete = roundItems.length > 0 && roundItems.every((i) => i.status === "DONE");
  if (!roundComplete) redirect("/dashboard");

  return <RoundCompleteClient roundNumber={student.currentRound} />;
}
