import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";

export async function POST(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { acknowledgeUnrealisticGoal } = (await req.json().catch(() => ({}))) as {
    acknowledgeUnrealisticGoal?: boolean;
  };

  await prisma.student.update({
    where: { id: studentId },
    data: {
      tourCompleted: true,
      ...(acknowledgeUnrealisticGoal ? { goalRealismAcknowledged: true } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
