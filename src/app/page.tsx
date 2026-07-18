import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { OnboardingWizard } from "@/components/OnboardingWizard";

export default async function Home() {
  const studentId = await getStudentIdFromCookies();
  const student = studentId ? await prisma.student.findUnique({ where: { id: studentId } }) : null;

  if (student) {
    if (student.onboardingComplete) redirect("/dashboard");
    redirect("/diagnostic");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Let&apos;s build your ACT study plan</h1>
        <p className="mt-2 text-slate-600">
          Answer a few quick questions and Mr. Kim will build you a personalized, adaptive plan.
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
