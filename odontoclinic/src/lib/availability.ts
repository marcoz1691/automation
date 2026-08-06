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
import { CLINIC_HOURS, type DaySchedule } from "./constants";

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

function getDaySchedule(date: Date): DaySchedule {
  const key = DAY_KEYS[getDay(date)] as DayKey;
  return CLINIC_HOURS[key];
}

function getSlotsForPeriod(
  date: Date,
  period: { open: string; close: string },
  durationMin: number,
  bookedRanges: { start: Date; end: Date }[],
  slotInterval: number
): string[] {
  const [openH, openM] = period.open.split(":").map(Number);
  const [closeH, closeM] = period.close.split(":").map(Number);

  let cursor = setMinutes(setHours(startOfDay(date), openH), openM);
  const periodEnd = setMinutes(setHours(startOfDay(date), closeH), closeM);
  const slots: string[] = [];
  const now = new Date();

  while (addMinutes(cursor, durationMin) <= periodEnd) {
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

export function getAvailableSlots(
  date: Date,
  durationMin: number,
  bookedRanges: { start: Date; end: Date }[],
  slotInterval = 30
): string[] {
  const schedule = getDaySchedule(date);
  if (!schedule) return [];

  return schedule.periods.flatMap((period) =>
    getSlotsForPeriod(date, period, durationMin, bookedRanges, slotInterval)
  );
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
        specialty: dentist.specialty,
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

export function isWithinClinicHours(start: Date, end: Date): boolean {
  const schedule = getDaySchedule(start);
  if (!schedule) return false;

  const day = startOfDay(start);
  return schedule.periods.some((period) => {
    const [openH, openM] = period.open.split(":").map(Number);
    const [closeH, closeM] = period.close.split(":").map(Number);
    const periodStart = setMinutes(setHours(day, openH), openM);
    const periodEnd = setMinutes(setHours(day, closeH), closeM);
    return start >= periodStart && end <= periodEnd;
  });
}
