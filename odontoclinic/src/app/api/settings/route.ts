import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "default" },
  });
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = await prisma.clinicSettings.update({
    where: { id: "default" },
    data: body,
  });
  return NextResponse.json(settings);
}
