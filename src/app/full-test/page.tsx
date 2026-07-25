import { redirect } from "next/navigation";
import { getStudentIdFromCookies } from "@/lib/session";
import { FullLengthTest } from "@/components/FullLengthTest";

export default async function FullTestPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Full-Length Practice Test</h1>
        <p className="mt-1 text-slate-600">
          All four sections, back to back. Take this any time you want a realistic checkpoint.
        </p>
      </div>
      <FullLengthTest />
    </div>
  );
}
