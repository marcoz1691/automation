import { prisma } from "./db";
import { formatAppointmentDate, formatAppointmentTime } from "./availability";

type TemplateVars = Record<string, string>;

function renderTemplate(template: string, vars: TemplateVars): string {
  return template.replace(/\[(\w+)\]/g, (_, key) => vars[key] ?? `[${key}]`);
}

export const MESSAGE_TEMPLATES = {
  confirmation: `Hola [Nombre], te confirmamos tu cita en **Odontoclinic** 🦷
📅 [Fecha]
🕐 [Hora]
👨‍⚕️ [Odontologo]
📋 [Servicio]
📍 [Direccion]

Responde **CONFIRMO** o cancela aquí: [Link]
Si necesitas reprogramar, avísanos con al menos 24h.`,

  reminder24h: `Hola [Nombre], te recordamos tu cita mañana en Odontoclinic 🦷
📅 [Fecha] a las [Hora]
👨‍⚕️ [Odontologo] — [Servicio]

Por favor confirma tu asistencia respondiendo **CONFIRMO** o cancela: [Link]`,

  reminder2h: `Hola [Nombre], tu cita en Odontoclinic es en 2 horas ([Hora]).
Te esperamos en [Direccion]. ¡Hasta pronto! 🦷`,

  cancellation: `Hola [Nombre], tu cita del [Fecha] a las [Hora] ha sido cancelada.
Si deseas reagendar, contáctanos al [Telefono] o escribe por WhatsApp.`,

  rescheduled: `Hola [Nombre], tu cita ha sido reprogramada:
📅 Nueva fecha: [Fecha]
🕐 Nueva hora: [Hora]
👨‍⚕️ [Odontologo] — [Servicio]
📍 [Direccion]`,

  postVisit: `Gracias por visitarnos, [Nombre] 🦷
Esperamos que tu experiencia en Odontoclinic haya sido excelente.
¿Nos ayudas con una reseña? Tu opinión nos importa mucho.`,
};

export async function buildMessageVars(appointmentId: string): Promise<TemplateVars> {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      patient: true,
      dentist: true,
      service: true,
    },
  });
  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "default" },
  });

  if (!appointment) throw new Error("Cita no encontrada");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return {
    Nombre: appointment.patient.name.split(" ")[0],
    Fecha: formatAppointmentDate(appointment.datetimeStart),
    Hora: formatAppointmentTime(appointment.datetimeStart),
    Odontologo: appointment.dentist.name,
    Servicio: appointment.service.name,
    Direccion: settings?.address ?? "",
    Telefono: settings?.phone ?? "",
    Link: `${baseUrl}/mis-citas?phone=${encodeURIComponent(appointment.patient.phone)}`,
  };
}

export async function sendMessage(params: {
  appointmentId?: string;
  template: keyof typeof MESSAGE_TEMPLATES;
  channel?: "WHATSAPP" | "EMAIL" | "SMS";
  vars?: TemplateVars;
}) {
  const vars =
    params.vars ??
    (params.appointmentId
      ? await buildMessageVars(params.appointmentId)
      : {});

  const content = renderTemplate(MESSAGE_TEMPLATES[params.template], vars);

  const log = await prisma.messageLog.create({
    data: {
      appointmentId: params.appointmentId,
      channel: params.channel ?? "WHATSAPP",
      template: params.template,
      content,
      status: "MOCK",
    },
  });

  return { log, content };
}

export async function sendConfirmation(appointmentId: string) {
  return sendMessage({ appointmentId, template: "confirmation" });
}

export async function sendCancellationNotice(appointmentId: string) {
  return sendMessage({ appointmentId, template: "cancellation" });
}

export async function processScheduledNotifications() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const results: string[] = [];

  const pending24h = await prisma.appointment.findMany({
    where: {
      status: { in: ["PENDIENTE", "CONFIRMADA"] },
      reminderSent24h: false,
      datetimeStart: {
        gte: new Date(in24h.getTime() - 30 * 60 * 1000),
        lte: new Date(in24h.getTime() + 30 * 60 * 1000),
      },
    },
  });

  for (const apt of pending24h) {
    await sendMessage({ appointmentId: apt.id, template: "reminder24h" });
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent24h: true },
    });
    results.push(`24h reminder: ${apt.id}`);
  }

  const pending2h = await prisma.appointment.findMany({
    where: {
      status: "CONFIRMADA",
      reminderSent2h: false,
      datetimeStart: {
        gte: new Date(in2h.getTime() - 15 * 60 * 1000),
        lte: new Date(in2h.getTime() + 15 * 60 * 1000),
      },
    },
  });

  for (const apt of pending2h) {
    await sendMessage({ appointmentId: apt.id, template: "reminder2h" });
    await prisma.appointment.update({
      where: { id: apt.id },
      data: { reminderSent2h: true },
    });
    results.push(`2h reminder: ${apt.id}`);
  }

  const unconfirmed = await prisma.appointment.findMany({
    where: {
      status: "PENDIENTE",
      reminderSent24h: true,
      datetimeStart: {
        gte: now,
        lte: in24h,
      },
    },
  });

  return {
    processed: results,
    alertsForReception: unconfirmed.map((a) => ({
      id: a.id,
      message: `Cita sin confirmar — llamar al paciente (ID: ${a.id})`,
    })),
  };
}
