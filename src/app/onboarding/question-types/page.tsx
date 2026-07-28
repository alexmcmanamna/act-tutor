import { redirect } from "next/navigation";
import { getStudentIdFromCookies } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { QuestionTypeChoiceButtons } from "@/components/QuestionTypeChoiceButtons";
import { MrKimMessageCard } from "@/components/MrKimMessageCard";
import { MrKimBubble } from "@/components/MrKimBubble";
import { MrKimAvatar } from "@/components/MrKimAvatar";

export default async function QuestionTypesChoicePage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) redirect("/");

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <MrKimAvatar size={56} />
      </div>
      <div className="mb-8">
        <MrKimBubble>
          <MrKimMessageCard endpoint="/api/mrkim/question-types-message" />
        </MrKimBubble>
      </div>
      <QuestionTypeChoiceButtons />
    </div>
  );
}
