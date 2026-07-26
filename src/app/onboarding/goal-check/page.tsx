import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { buildMasteryTable } from "@/lib/studyPlan";
import { checkGoalRealism } from "@/lib/goalRealism";
import { generateGoalCheckMessage } from "@/lib/mrKimMessages";
import { GoalCheckClient } from "@/components/GoalCheckClient";

// testDate is stored as a UTC-midnight Date parsed from a plain "YYYY-MM-DD"
// input value with no timezone — read it back with the UTC getters (not
// local ones) so it round-trips to the same calendar date instead of
// shifting a day in timezones behind UTC.
function toDateInputValue(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default async function GoalCheckPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  const masteryTable = await buildMasteryTable(student);
  const realism = checkGoalRealism(student, masteryTable, student.studyDaysPerWeek, student.minutesPerSession);
  const { text } = await generateGoalCheckMessage(student, realism);

  return (
    <GoalCheckClient
      message={text}
      realism={realism}
      initialTestDate={student.testDate ? toDateInputValue(student.testDate) : null}
      initialStudyDaysPerWeek={student.studyDaysPerWeek}
      initialMinutesPerSession={student.minutesPerSession}
    />
  );
}
