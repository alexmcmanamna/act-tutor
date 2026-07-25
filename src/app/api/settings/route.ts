import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";

interface SettingsBody {
  reminderEmailEnabled?: boolean;
  reminderSmsEnabled?: boolean;
  reminderEmail?: string | null;
  reminderPhone?: string | null;
  reminderTime?: string;
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function PATCH(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const body = (await req.json()) as SettingsBody;

  if (body.reminderEmailEnabled && !body.reminderEmail) {
    return NextResponse.json({ error: "reminderEmail is required to enable email reminders." }, { status: 400 });
  }
  if (body.reminderSmsEnabled && !body.reminderPhone) {
    return NextResponse.json({ error: "reminderPhone is required to enable SMS reminders." }, { status: 400 });
  }
  if (body.reminderTime && !TIME_RE.test(body.reminderTime)) {
    return NextResponse.json({ error: "reminderTime must be in HH:MM 24-hour format." }, { status: 400 });
  }

  const student = await prisma.student.update({
    where: { id: studentId },
    data: {
      ...(body.reminderEmailEnabled !== undefined && { reminderEmailEnabled: body.reminderEmailEnabled }),
      ...(body.reminderSmsEnabled !== undefined && { reminderSmsEnabled: body.reminderSmsEnabled }),
      ...(body.reminderEmail !== undefined && { reminderEmail: body.reminderEmail }),
      ...(body.reminderPhone !== undefined && { reminderPhone: body.reminderPhone }),
      ...(body.reminderTime !== undefined && { reminderTime: body.reminderTime }),
    },
  });

  return NextResponse.json({ student });
}
