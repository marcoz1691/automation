import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "phone requerido" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  const patient = await prisma.patient.findFirst({
    where: { phone: { contains: normalized.slice(-9) } },
  });

  if (!patient) {
    return NextResponse.json({ appointments: [], patient: null });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { dentist: true, service: true },
    orderBy: { datetimeStart: "desc" },
  });

  return NextResponse.json({ appointments, patient });
}
