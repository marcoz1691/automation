import { addDays, format } from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "@/lib/db";
import {
  getAvailability,
  parseDateTime,
  isSlotAvailable,
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/lib/availability";
import { sendConfirmation } from "@/lib/messages";
import { normalizePhone } from "@/lib/utils";
import { formatClinicHoursSummary } from "@/lib/constants";

export const ODONTOBOT_SYSTEM_PROMPT = `Eres OdontoBot, el asistente virtual de Odontoclinic — Clínica Odontológica.

PERSONALIDAD: Cálido, profesional, claro. Español latinoamericano. Emojis moderados (🦷 📅 ✅).

REGLAS ESTRICTAS:
- NO diagnosticar ni recetar medicamentos
- NO dar precios exactos sin tabla oficial
- Ante síntomas o dolor agudo: recomendar consulta presencial o escalar a humano
- Disclaimer: "Soy asistente virtual, no reemplazo la opinión de un odontólogo"

CAPACIDADES:
- Informar horarios, ubicación, servicios
- Agendar, cancelar y reprogramar citas (verificando identidad)
- Responder FAQ sobre seguros, pagos, primera visita, urgencias

Firma: Odontoclinic — Clínica Odontológica`;

type ChatMessage = { role: "user" | "assistant"; content: string };

interface BotContext {
  phone?: string;
  conversationId?: string;
}

function formatHoursSummary(): string {
  return formatClinicHoursSummary();
}

async function getSettings() {
  return (
    (await prisma.clinicSettings.findUnique({ where: { id: "default" } })) ??
    null
  );
}

async function getServicesList(): Promise<string> {
  const services = await prisma.service.findMany({
    where: { active: true },
  });
  return services
    .map((s) => `• ${s.name} (${s.durationMin} min${s.price ? ` — $${s.price}` : ""})`)
    .join("\n");
}

function detectIntent(message: string): string {
  const m = message.toLowerCase();
  if (/hola|buenos|buenas|saludos/.test(m)) return "greeting";
  if (/horario|hora|abierto|atienden|cuando/.test(m)) return "hours";
  if (/direccion|ubicacion|donde|mapa/.test(m)) return "location";
  if (/servicio|tratamiento|limpieza|extraccion|endodon|ortodon|blanque|urgencia|consulta/.test(m))
    return "services";
  if (/seguro|aseguradora/.test(m)) return "insurance";
  if (/pago|tarjeta|efectivo|transferencia/.test(m)) return "payment";
  if (/primera visita|que traer|documento/.test(m)) return "firstVisit";
  if (/urgencia|emergencia|dolor fuerte|dolor agudo/.test(m)) return "emergency";
  if (/cancelar|anular/.test(m)) return "cancel";
  if (/reprogramar|cambiar cita|mover cita/.test(m)) return "reschedule";
  if (/disponib|libre|turno|agenda/.test(m)) return "availability";
  if (/cita|agendar|reservar|turno/.test(m)) return "book";
  if (/mis citas|ver cita|consultar cita/.test(m)) return "myAppointments";
  if (/humano|persona|recepcion| llamar/.test(m)) return "escalate";
  return "general";
}

async function findPatientByPhone(phone: string) {
  const normalized = normalizePhone(phone);
  return prisma.patient.findFirst({
    where: { phone: { contains: normalized.slice(-9) } },
  });
}

async function getUpcomingAppointments(phone: string) {
  const patient = await findPatientByPhone(phone);
  if (!patient) return [];

  return prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      status: { notIn: ["CANCELADA", "COMPLETADA"] },
      datetimeStart: { gte: new Date() },
    },
    include: { service: true, dentist: true },
    orderBy: { datetimeStart: "asc" },
    take: 5,
  });
}

export async function processOdontoBotMessage(
  message: string,
  context: BotContext = {}
): Promise<{ reply: string; escalated: boolean; conversationId?: string }> {
  const settings = await getSettings();
  const intent = detectIntent(message);
  let reply = "";
  let escalated = false;

  if (intent === "emergency") {
    escalated = true;
    reply = `Entiendo que puedes estar con molestias. 🦷

Por tu seguridad, no puedo evaluar síntomas por chat. Te recomiendo:
1. Llamar a la clínica al ${settings?.phone ?? "+593 4 200 1234"}
2. O escribir por WhatsApp: ${settings?.whatsapp ?? ""}

Si es una urgencia fuera de horario, busca atención de emergencias.

_Soy asistente virtual, no reemplazo la opinión de un odontólogo._`;
  } else if (intent === "greeting") {
    reply = `¡Hola! Soy OdontoBot de Odontoclinic 🦷

¿En qué puedo ayudarte hoy?
• Agendar una cita
• Consultar horarios o ubicación
• Conocer nuestros servicios
• Cancelar o reprogramar

_Escribe tu consulta y te ayudo._`;
  } else if (intent === "hours") {
    reply = `Nuestros horarios de atención:\n\n${formatHoursSummary()}\n\n¿Te gustaría agendar una cita? 📅`;
  } else if (intent === "location") {
    reply = `📍 **Odontoclinic — Clínica Odontológica**
${settings?.address ?? "Guayaquil, Ecuador"}

Tel: ${settings?.phone ?? ""}
WhatsApp: ${settings?.whatsapp ?? ""}

¿Deseas reservar tu cita?`;
  } else if (intent === "services") {
    const list = await getServicesList();
    reply = `Estos son nuestros servicios:\n\n${list}\n\n¿Cuál te interesa? Puedo ayudarte a ver disponibilidad. 🦷`;
  } else if (intent === "insurance") {
    const faq = settings?.faqJson ? JSON.parse(settings.faqJson) : {};
    reply = faq.insurance ?? "Trabajamos con seguros odontológicos. Confirma cobertura al agendar.";
  } else if (intent === "payment") {
    reply = `Formas de pago: ${settings?.paymentMethods ?? "Efectivo, tarjeta y transferencia"}`;
  } else if (intent === "firstVisit") {
    const faq = settings?.faqJson ? JSON.parse(settings.faqJson) : {};
    reply = faq.firstVisit ?? "Trae tu cédula e historial dental si lo tienes.";
  } else if (intent === "availability" || intent === "book") {
    const services = await prisma.service.findMany({ where: { active: true } });
    const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd");
    const firstService = services[0];
    if (firstService) {
      const avail = await getAvailability({
        date: tomorrow,
        serviceId: firstService.id,
      });
      const slotsPreview = avail.dentists
        .flatMap((d) => d.slots.slice(0, 3).map((s) => `${d.dentistName}: ${s}`))
        .slice(0, 6)
        .join("\n");

      reply = `Para agendar, necesito:
1. **Servicio** (ej: limpieza, consulta)
2. **Fecha preferida**
3. **Tu nombre y teléfono**

Disponibilidad para mañana (${format(addDays(new Date(), 1), "d/M", { locale: es })}):
${slotsPreview || "Consulta otras fechas en /reservar"}

También puedes reservar en: /reservar 📅`;
    }
  } else if (intent === "myAppointments" && context.phone) {
    const appointments = await getUpcomingAppointments(context.phone);
    if (appointments.length === 0) {
      reply = "No encontré citas activas con tu número. ¿Deseas agendar una nueva? 📅";
    } else {
      reply =
        "Tus próximas citas:\n\n" +
        appointments
          .map(
            (a, i) =>
              `${i + 1}. ${formatAppointmentDate(a.datetimeStart)} — ${formatAppointmentTime(a.datetimeStart)}\n   ${a.service.name} con ${a.dentist.name} (${a.status})`
          )
          .join("\n\n") +
        "\n\nPara cancelar o reprogramar, escribe 'cancelar cita' o visita /mis-citas";
    }
  } else if (intent === "cancel") {
    reply = `Para cancelar tu cita necesito verificar tu identidad:
• Nombre completo
• Teléfono
• Fecha de la cita

También puedes cancelar en /mis-citas (mínimo ${settings?.cancellationPolicyHours ?? 24}h de anticipación).`;
  } else if (intent === "escalate") {
    escalated = true;
    reply = `Te conectaré con recepción. Por favor llama al ${settings?.phone ?? ""} o escribe al WhatsApp ${settings?.whatsapp ?? ""}.

Horario: ${formatHoursSummary()}`;
  } else {
    reply = `Gracias por tu mensaje. Puedo ayudarte con:
• Horarios y ubicación
• Servicios y agendamiento
• Cancelaciones

¿Qué necesitas? 🦷

_Soy asistente virtual, no reemplazo la opinión de un odontólogo._`;
  }

  let conversationId = context.conversationId;
  const messages: ChatMessage[] = [{ role: "user", content: message }, { role: "assistant", content: reply }];

  if (conversationId) {
    const conv = await prisma.aiConversation.findUnique({ where: { id: conversationId } });
    if (conv) {
      const existing = JSON.parse(conv.messagesJson) as ChatMessage[];
      messages.unshift(...existing.slice(-18));
    }
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: {
        messagesJson: JSON.stringify(messages.slice(-20)),
        escalated: escalated || undefined,
      },
    });
  } else {
    const conv = await prisma.aiConversation.create({
      data: {
        patientPhone: context.phone,
        messagesJson: JSON.stringify(messages),
        escalated,
      },
    });
    conversationId = conv.id;
  }

  return { reply, escalated, conversationId };
}

export async function bookViaAI(params: {
  patientName: string;
  phone: string;
  serviceId: string;
  dentistId: string;
  date: string;
  time: string;
}) {
  const start = parseDateTime(params.date, params.time);
  const service = await prisma.service.findUnique({ where: { id: params.serviceId } });
  if (!service) throw new Error("Servicio no encontrado");

  const end = new Date(start.getTime() + service.durationMin * 60 * 1000);
  const available = await isSlotAvailable(params.dentistId, start, end);
  if (!available) throw new Error("Horario no disponible");

  let patient = await findPatientByPhone(params.phone);
  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        name: params.patientName,
        phone: normalizePhone(params.phone),
      },
    });
  }

  const appointment = await prisma.appointment.create({
    data: {
      patientId: patient.id,
      dentistId: params.dentistId,
      serviceId: params.serviceId,
      datetimeStart: start,
      datetimeEnd: end,
      source: "IA",
      status: "PENDIENTE",
    },
    include: { patient: true, dentist: true, service: true },
  });

  await sendConfirmation(appointment.id);
  return appointment;
}
