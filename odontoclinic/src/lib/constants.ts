export type TimePeriod = { open: string; close: string };
export type DaySchedule = { periods: TimePeriod[] } | null;

export const CLINIC_HOURS: Record<string, DaySchedule> = {
  monday: {
    periods: [
      { open: "09:00", close: "12:00" },
      { open: "15:00", close: "19:00" },
    ],
  },
  tuesday: {
    periods: [
      { open: "09:00", close: "12:00" },
      { open: "15:00", close: "19:00" },
    ],
  },
  wednesday: {
    periods: [
      { open: "09:00", close: "12:00" },
      { open: "15:00", close: "19:00" },
    ],
  },
  thursday: {
    periods: [
      { open: "09:00", close: "12:00" },
      { open: "15:00", close: "19:00" },
    ],
  },
  friday: {
    periods: [
      { open: "09:00", close: "12:00" },
      { open: "15:00", close: "19:00" },
    ],
  },
  saturday: null,
  sunday: null,
};

export const CLINIC_HOURS_SUMMARY =
  "Lunes a Viernes: 9:00 – 12:00 y 15:00 – 19:00";

export function formatClinicHoursSummary(): string {
  return `${CLINIC_HOURS_SUMMARY}\nSábado y Domingo: Cerrado`;
}

export const DENTISTS = {
  robertoZurita: {
    name: "Dr. Roberto Zurita",
    specialty: "Rehabilitación oral",
  },
  robertoZuritaProano: {
    name: "Dr. Roberto Zurita Proaño",
    specialty: "Odontología general",
  },
} as const;

export const DEFAULT_SETTINGS = {
  clinicName: "Odontoclinic",
  tagline: "Clínica Odontológica",
  address: "Av. Principal y Calle Secundaria, Guayaquil, Ecuador",
  phone: "+593 4 200 1234",
  whatsapp: "+593 99 123 4567",
  email: "citas@odontoclinic.com",
  timezone: "America/Guayaquil",
  cancellationPolicyHours: 24,
  acceptsInsurance: true,
  paymentMethods: "Efectivo, tarjeta de crédito/débito, transferencia",
  hoursJson: JSON.stringify(CLINIC_HOURS),
  faqJson: JSON.stringify({
    insurance:
      "Sí, trabajamos con los principales seguros odontológicos. Consulta disponibilidad al agendar.",
    payment: "Aceptamos efectivo, tarjetas de crédito/débito y transferencia bancaria.",
    firstVisit:
      "Trae tu cédula, historial dental previo si lo tienes, y lista de medicamentos actuales.",
    emergencies:
      "Atendemos urgencias dentales en horario de consulta. Para dolor agudo, llama o escríbenos por WhatsApp.",
  }),
};

export const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADA: "Confirmada",
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  NO_SHOW: "No asistió",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-800",
  CONFIRMADA: "bg-blue-100 text-blue-800",
  COMPLETADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-gray-100 text-gray-600",
  NO_SHOW: "bg-red-100 text-red-800",
};

export const DEMO_USERS = [
  {
    email: "admin@odontoclinic.com",
    password: "admin123",
    name: "Administrador",
    role: "ADMIN" as const,
  },
  {
    email: "recepcion@odontoclinic.com",
    password: "recepcion123",
    name: "María Recepción",
    role: "RECEPCIONISTA" as const,
  },
  {
    email: "dr.zurita@odontoclinic.com",
    password: "doctor123",
    name: DENTISTS.robertoZurita.name,
    role: "ODONTOLOGO" as const,
    dentistKey: "robertoZurita" as const,
  },
  {
    email: "dr.proano@odontoclinic.com",
    password: "doctor123",
    name: DENTISTS.robertoZuritaProano.name,
    role: "ODONTOLOGO" as const,
    dentistKey: "robertoZuritaProano" as const,
  },
];
