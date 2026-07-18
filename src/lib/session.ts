import { cookies } from "next/headers";

const COOKIE_NAME = "act_tutor_student_id";

export async function getStudentIdFromCookies(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function setStudentIdCookie(id: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearStudentIdCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
