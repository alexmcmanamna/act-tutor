import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearStudentIdCookie, getStudentIdFromCookies } from "@/lib/session";

export async function GET() {
  const studentId = await getStudentIdFromCookies();
  if (!studentId) return NextResponse.json({ student: null });

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return NextResponse.json({ student: null });

  return NextResponse.json({ student });
}

export async function DELETE() {
  await clearStudentIdCookie();
  return NextResponse.json({ ok: true });
}
