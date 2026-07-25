import { prisma } from "./prisma";

/**
 * Daily reminder scaffold. This wires up the data model, opt-in settings, and
 * the query for "who's due right now" — but does NOT actually send email/SMS.
 * Wiring in a real provider needs credentials the app doesn't have:
 *
 *   - Email: an API key for a transactional email provider (e.g. Resend,
 *     Postmark, SendGrid). Plug it into `sendEmailReminder` below.
 *   - SMS: an API key/account SID for a provider (e.g. Twilio). Plug it into
 *     `sendSmsReminder` below.
 *
 * Once credentials are available, call `dispatchDueReminders()` from a
 * scheduled job (e.g. a cron-triggered route, or a platform cron like Vercel
 * Cron) roughly once every 15-60 minutes.
 */

export interface ReminderCandidate {
  studentId: string;
  email: string | null;
  phone: string | null;
  emailEnabled: boolean;
  smsEnabled: boolean;
  reminderTime: string;
}

/** Students whose reminderTime ("HH:MM") matches the current hour:minute window and who have opted into at least one channel. */
export async function getStudentsDueForReminder(now: Date = new Date()): Promise<ReminderCandidate[]> {
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const students = await prisma.student.findMany({
    where: {
      OR: [{ reminderEmailEnabled: true }, { reminderSmsEnabled: true }],
      reminderTime: hhmm,
    },
    select: {
      id: true,
      reminderEmail: true,
      reminderPhone: true,
      reminderEmailEnabled: true,
      reminderSmsEnabled: true,
      reminderTime: true,
    },
  });

  return students.map((s) => ({
    studentId: s.id,
    email: s.reminderEmail,
    phone: s.reminderPhone,
    emailEnabled: s.reminderEmailEnabled,
    smsEnabled: s.reminderSmsEnabled,
    reminderTime: s.reminderTime,
  }));
}

/** Placeholder — requires an email provider API key. Currently just logs. */
async function sendEmailReminder(email: string): Promise<void> {
  console.log(`[reminders] Would send email reminder to ${email} (no email provider configured yet).`);
}

/** Placeholder — requires an SMS provider (e.g. Twilio) API key. Currently just logs. */
async function sendSmsReminder(phone: string): Promise<void> {
  console.log(`[reminders] Would send SMS reminder to ${phone} (no SMS provider configured yet).`);
}

/** Entry point for a scheduled job. Safe to call repeatedly (no-ops until a provider is wired in above). */
export async function dispatchDueReminders(now: Date = new Date()): Promise<{ notified: number }> {
  const due = await getStudentsDueForReminder(now);
  for (const candidate of due) {
    if (candidate.emailEnabled && candidate.email) await sendEmailReminder(candidate.email);
    if (candidate.smsEnabled && candidate.phone) await sendSmsReminder(candidate.phone);
  }
  return { notified: due.length };
}
