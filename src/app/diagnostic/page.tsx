import { DiagnosticQuiz } from "@/components/DiagnosticQuiz";

export default async function DiagnosticPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const recalibration = mode === "recalibration";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {recalibration && (
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Progress check</h1>
          <p className="mt-1 text-slate-600">
            A short half-length diagnostic to measure your progress and recalibrate your plan.
          </p>
        </div>
      )}
      <DiagnosticQuiz mode={recalibration ? "recalibration" : "initial"} />
    </div>
  );
}
