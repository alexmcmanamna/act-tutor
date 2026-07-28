import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { OnboardingWizard } from "@/components/OnboardingWizard";
import { MrKimAvatar } from "@/components/MrKimAvatar";

export default async function Home() {
  const studentId = await getStudentIdFromCookies();
  const student = studentId ? await prisma.student.findUnique({ where: { id: studentId } }) : null;

  if (student) {
    if (student.onboardingComplete && !student.tourCompleted) redirect("/onboarding/reveal");
    if (student.onboardingComplete) redirect("/dashboard");
    redirect("/diagnostic");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <MrKimAvatar size={64} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Hey, I&apos;m Mr. Kim 👋</h1>
        <p className="mt-2 text-slate-600">Let&apos;s build you a personalized ACT study plan — just a few quick questions.</p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
