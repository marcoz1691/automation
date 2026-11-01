import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

const SESSION_COOKIE = "odontoclinic_session";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { dentist: true },
  });
}

export async function requireStaff(roles?: ("ADMIN" | "RECEPCIONISTA" | "ODONTOLOGO")[]) {
  const user = await getSessionUser();
  if (!user) return null;
  if (roles && !roles.includes(user.role as (typeof roles)[number])) return null;
  return user;
}
