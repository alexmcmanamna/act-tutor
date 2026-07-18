import { redirect } from "next/navigation";
import { getStudentIdFromCookies } from "@/lib/session";
import { MrKimChat } from "@/components/MrKimChat";

export default async function MrKimPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Ask Mr. Kim</h1>
      <p className="mb-6 text-slate-600">
        Ask about any ACT concept, strategy, or question type. Mr. Kim knows your goal score and weak areas.
      </p>
      <MrKimChat />
    </div>
  );
}
