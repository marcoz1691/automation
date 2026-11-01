import { getDay } from "date-fns";
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

export type DentistScheduleInfo = {
  kind: string;
  schedule: string;
};

export function getDentistDaySchedule(
  dentist: DentistScheduleInfo,
  date: Date
): DaySchedule {
  const dayKey = DAY_KEYS[getDay(date)] as DayKey;

  if (dentist.kind !== "EXTERNO" || dentist.schedule === "default") {
    return CLINIC_HOURS[dayKey] ?? null;
  }

  try {
    const custom = JSON.parse(dentist.schedule) as Partial<
      Record<DayKey, DaySchedule>
    >;
    return custom[dayKey] ?? null;
  } catch {
    return CLINIC_HOURS[dayKey] ?? null;
  }
}

export function describeDentistVisitDays(scheduleJson: string): string {
  if (scheduleJson === "default") return "Lun–Vie";

  try {
    const custom = JSON.parse(scheduleJson) as Record<string, DaySchedule>;
    const labels: Record<string, string> = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mié",
      thursday: "Jue",
      friday: "Vie",
      saturday: "Sáb",
    };
    const days = Object.keys(custom)
      .filter((k) => custom[k]?.periods?.length)
      .map((k) => labels[k] ?? k);
    return days.length ? days.join(", ") : "Consultar recepción";
  } catch {
    return "Consultar recepción";
  }
}
