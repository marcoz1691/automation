import {
  addMinutes,
  format,
  isBefore,
  isAfter,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  addDays,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { prisma } from "./db";
import { CLINIC_HOURS } from "./constants";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

type DayKey = (typeof DAY_KEYS)[number];

function getDayHours(date: Date) {
  const key = DAY_KEYS[getDay(date)] as DayKey;
  return CLINIC_HOURS[key];
}

export function getAvailableSlots(
  date: Date,
  durationMin: number,
  bookedRanges: { start: Date; end: Date }[],
  slotInterval = 30
): string[] {
  const hours = getDayHours(date);
  if (!hours) return [];

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);

  let cursor = setMinutes(setHours(startOfDay(date), openH), openM);
  const dayEnd = setMinutes(setHours(startOfDay(date), closeH), closeM);
  const slots: string[] = [];
  const now = new Date();

  while (addMinutes(cursor, durationMin) <= dayEnd) {
    const slotEnd = addMinutes(cursor, durationMin);
    const overlaps = bookedRanges.some(
      (b) => cursor < b.end && slotEnd > b.start
    );
    const inPast = isBefore(slotEnd, now);

    if (!overlaps && !inPast) {
      slots.push(format(cursor, "HH:mm"));
    }
    cursor = addMinutes(cursor, slotInterval);
  }

  return slots;
}

export async function getAvailability(params: {
  date: string;
  serviceId: string;
  dentistId?: string;
}) {
  const date = parseISO(params.date);
  const service = await prisma.service.findUnique({
    where: { id: params.serviceId },
  });
  if (!service) return { slots: [], dentists: [] };

  const dentists = params.dentistId
    ? await prisma.dentist.findMany({
        where: { id: params.dentistId, active: true },
      })
    : await prisma.dentist.findMany({ where: { active: true } });

  const dayStart = startOfDay(date);
  const dayEnd = addDays(dayStart, 1);

  const results = await Promise.all(
    dentists.map(async (dentist) => {
      const appointments = await prisma.appointment.findMany({
        where: {
          dentistId: dentist.id,
          status: { notIn: ["CANCELADA"] },
          datetimeStart: { gte: dayStart, lt: dayEnd },
        },
      });

      const bookedRanges = appointments.map((a) => ({
        start: a.datetimeStart,
        end: a.datetimeEnd,
      }));

      const slots = getAvailableSlots(date, service.durationMin, bookedRanges);

      return {
        dentistId: dentist.id,
        dentistName: dentist.name,
        slots,
      };
    })
  );

  return { service, dentists: results };
}

export async function isSlotAvailable(
  dentistId: string,
  start: Date,
  end: Date,
  excludeAppointmentId?: string
) {
  const conflict = await prisma.appointment.findFirst({
    where: {
      dentistId,
      status: { notIn: ["CANCELADA"] },
      id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
      datetimeStart: { lt: end },
      datetimeEnd: { gt: start },
    },
  });
  return !conflict;
}

export function formatAppointmentDate(date: Date) {
  return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es });
}

export function formatAppointmentTime(date: Date) {
  return format(date, "HH:mm");
}

export function parseDateTime(dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

export function canModifyAppointment(
  appointmentStart: Date,
  policyHours: number
): boolean {
  const deadline = addMinutes(new Date(), policyHours * 60);
  return isAfter(appointmentStart, deadline);
}
