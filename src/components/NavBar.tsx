import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { StartOverButton } from "./StartOverButton";

export async function NavBar() {
  const studentId = await getStudentIdFromCookies();
  const student = studentId ? await prisma.student.findUnique({ where: { id: studentId } }) : null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            MK
          </span>
          <span>
            ACT Tutor <span className="font-normal text-slate-400">· with Mr. Kim</span>
          </span>
        </Link>
        {student?.onboardingComplete && (
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <Link href="/mr-kim" className="hover:text-indigo-600">
              Ask Mr. Kim
            </Link>
            <StartOverButton />
          </nav>
        )}
      </div>
    </header>
  );
}
