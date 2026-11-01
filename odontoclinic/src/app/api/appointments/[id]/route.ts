import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { canModifyAppointment, isSlotAvailable, parseDateTime } from "@/lib/availability";
import { sendCancellationNotice, sendMessage } from "@/lib/messages";
import { z } from "zod";

const updateSchema = z.object({
  action: z.enum(["confirm", "cancel", "complete", "no_show", "reschedule", "update"]),
  cancelReason: z.string().optional(),
  cancelledBy: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  dentistId: z.string().optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = updateSchema.parse(await request.json());
    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: { service: true, patient: true, dentist: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
    }

    const settings = await prisma.clinicSettings.findUnique({ where: { id: "default" } });
    const policyHours = settings?.cancellationPolicyHours ?? 24;

    if (body.action === "confirm") {
      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: { status: "CONFIRMADA", confirmedAt: new Date() },
        include: { patient: true, dentist: true, service: true },
      });
      return NextResponse.json(updated);
    }

    if (body.action === "cancel") {
      if (!canModifyAppointment(appointment.datetimeStart, policyHours) && body.cancelledBy === "patient") {
        return NextResponse.json(
          { error: `Cancelación requiere ${policyHours}h de anticipación` },
          { status: 403 }
        );
      }

      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: {
          status: "CANCELADA",
          cancelledAt: new Date(),
          cancelReason: body.cancelReason,
          cancelledBy: body.cancelledBy ?? "staff",
        },
        include: { patient: true, dentist: true, service: true },
      });

      await sendCancellationNotice(updated.id);

      const waitlist = await prisma.waitlistEntry.findFirst({
        where: { serviceId: appointment.serviceId, notified: false },
        include: { patient: true },
      });

      if (waitlist) {
        await sendMessage({
          template: "confirmation",
          vars: {
            Nombre: waitlist.patient.name.split(" ")[0],
            Fecha: "Próxima disponibilidad",
            Hora: "Contáctanos",
            Odontologo: appointment.dentist.name,
            Servicio: appointment.service.name,
            Direccion: settings?.address ?? "",
            Telefono: settings?.phone ?? "",
            Link: "/reservar",
          },
        });
        await prisma.waitlistEntry.update({
          where: { id: waitlist.id },
          data: { notified: true },
        });
      }

      return NextResponse.json(updated);
    }

    if (body.action === "complete") {
      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: { status: "COMPLETADA" },
        include: { patient: true, dentist: true, service: true },
      });
      await sendMessage({ appointmentId: updated.id, template: "postVisit" });
      return NextResponse.json(updated);
    }

    if (body.action === "no_show") {
      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: { status: "NO_SHOW" },
        include: { patient: true, dentist: true, service: true },
      });
      return NextResponse.json(updated);
    }

    if (body.action === "reschedule" && body.date && body.time) {
      const start = parseDateTime(body.date, body.time);
      const end = new Date(start.getTime() + appointment.service.durationMin * 60 * 1000);
      const dentistId = body.dentistId ?? appointment.dentistId;

      const available = await isSlotAvailable(dentistId, start, end, params.id);
      if (!available) {
        return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
      }

      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: {
          datetimeStart: start,
          datetimeEnd: end,
          dentistId,
          status: "PENDIENTE",
          confirmedAt: null,
          reminderSent24h: false,
          reminderSent2h: false,
        },
        include: { patient: true, dentist: true, service: true },
      });

      await sendMessage({ appointmentId: updated.id, template: "rescheduled" });
      return NextResponse.json(updated);
    }

    if (body.action === "update") {
      const updated = await prisma.appointment.update({
        where: { id: params.id },
        data: { notes: body.notes },
        include: { patient: true, dentist: true, service: true },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar cita" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const appointment = await prisma.appointment.findUnique({
    where: { id: params.id },
    include: { patient: true, dentist: true, service: true, messagesLog: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Cita no encontrada" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}
