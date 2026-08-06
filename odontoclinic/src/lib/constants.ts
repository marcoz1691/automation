export const CLINIC_HOURS = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "18:00" },
  saturday: { open: "08:00", close: "13:00" },
  sunday: null,
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
    insurance: "Sí, trabajamos con los principales seguros odontológicos. Consulta disponibilidad al agendar.",
    payment: "Aceptamos efectivo, tarjetas de crédito/débito y transferencia bancaria.",
    firstVisit: "Trae tu cédula, historial dental previo si lo tienes, y lista de medicamentos actuales.",
    emergencies: "Atendemos urgencias dentales en horario de consulta. Para dolor agudo, llama o escríbenos por WhatsApp.",
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
    name: "Dr. Roberto Zurita",
    role: "ODONTOLOGO" as const,
    dentistName: "Dr. Roberto Zurita",
  },
];
