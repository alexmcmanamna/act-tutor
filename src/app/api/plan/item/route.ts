import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudentIdFromCookies } from "@/lib/session";

export async function PATCH(req: Request) {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ error: "No active student session." }, { status: 401 });

  const { itemId, status } = (await req.json()) as { itemId: string; status: "PENDING" | "DONE" };

  const item = await prisma.studyPlanItem.findUnique({ where: { id: itemId }, include: { plan: true } });
  if (!item || item.plan.studentId !== studentId) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  const updated = await prisma.studyPlanItem.update({ where: { id: itemId }, data: { status } });
  return NextResponse.json({ item: updated });
}
