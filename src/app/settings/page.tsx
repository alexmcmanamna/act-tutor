import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";
import { ReminderSettingsForm } from "@/components/ReminderSettingsForm";
import { AccessibilitySettings } from "@/components/AccessibilitySettings";

export default async function SettingsPage() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) redirect("/");

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student || !student.onboardingComplete) redirect("/");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mb-6 text-slate-600">Manage daily reminders for your study plan.</p>
      <ReminderSettingsForm
        initial={{
          reminderEmailEnabled: student.reminderEmailEnabled,
          reminderSmsEnabled: student.reminderSmsEnabled,
          reminderEmail: student.reminderEmail ?? "",
          reminderPhone: student.reminderPhone ?? "",
          reminderTime: student.reminderTime,
        }}
      />

      <div className="mt-10">
        <h2 className="mb-1 text-lg font-bold text-slate-900">Accessibility</h2>
        <p className="mb-4 text-sm text-slate-600">
          These preferences are saved on this device and apply across the whole app immediately.
        </p>
        <AccessibilitySettings />
      </div>
    </div>
  );
}
