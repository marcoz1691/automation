import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const dentists = await prisma.dentist.findMany({
    where: { active: true },
    orderBy: [{ kind: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(dentists);
}
