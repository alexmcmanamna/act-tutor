import { redirect } from "next/navigation";
import { getStudentIdFromCookies } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { QuestionTypeChoiceButtons } from "@/components/QuestionTypeChoiceButtons";
import { MrKimMessageCard } from "@/components/MrKimMessageCard";

export default async function QuestionTypesChoicePage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mb-8 grid h-14 w-14 mx-auto place-items-center rounded-2xl bg-indigo-600 text-lg font-bold text-white">
        MK
      </div>
      <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-left">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-indigo-500">Mr. Kim says</p>
        <MrKimMessageCard endpoint="/api/mrkim/question-types-message" />
      </div>
      <QuestionTypeChoiceButtons />
    </div>
  );
}
