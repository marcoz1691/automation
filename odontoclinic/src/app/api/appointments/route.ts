import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const dentistId = searchParams.get("dentistId");

  const where: Record<string, unknown> = {};

  if (date) {
    const d = parseISO(date);
    where.datetimeStart = { gte: startOfDay(d), lte: endOfDay(d) };
  }

  if (status) where.status = status;
  if (dentistId) where.dentistId = dentistId;

  if (search) {
    where.patient = {
      OR: [
        { name: { contains: search } },
        { phone: { contains: search } },
      ],
    };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: true,
      dentist: true,
      service: true,
    },
    orderBy: { datetimeStart: "asc" },
  });

  return NextResponse.json(appointments);
}

const createSchema = z.object({
  patientName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  serviceId: z.string(),
  dentistId: z.string(),
  date: z.string(),
  time: z.string(),
  notes: z.string().optional(),
  reason: z.string().optional(),
  source: z.enum(["WEB", "RECEPCION", "IA", "WHATSAPP", "IMPORT"]).default("WEB"),
});

export async function POST(request: NextRequest) {
  try {
    const body = createSchema.parse(await request.json());
    const { parseDateTime, isSlotAvailable } = await import("@/lib/availability");
    const { sendConfirmation } = await import("@/lib/messages");
    const { normalizePhone } = await import("@/lib/utils");

    const start = parseDateTime(body.date, body.time);
    const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
    if (!service) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const end = new Date(start.getTime() + service.durationMin * 60 * 1000);
    const available = await isSlotAvailable(body.dentistId, start, end);
    if (!available) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
    }

    const phone = normalizePhone(body.phone);
    let patient = await prisma.patient.findFirst({
      where: { phone: { contains: phone.slice(-9) } },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: body.patientName,
          phone,
          email: body.email || undefined,
        },
      });
    } else if (body.patientName && patient.name !== body.patientName) {
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: { name: body.patientName, email: body.email || patient.email },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        dentistId: body.dentistId,
        serviceId: body.serviceId,
        datetimeStart: start,
        datetimeEnd: end,
        source: body.source,
        notes: body.notes,
        reason: body.reason,
        status: "PENDIENTE",
      },
      include: { patient: true, dentist: true, service: true },
    });

    await sendConfirmation(appointment.id);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Error al crear cita" }, { status: 500 });
  }
}
