import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function normalizePhone(phone: string): string {
  const digits = formatPhone(phone);
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function formatZodIssues(
  issues: { path: PropertyKey[]; message: string }[]
): string {
  const labels: Record<string, string> = {
    patientName: "Nombre",
    phone: "Teléfono",
    email: "Email",
    serviceId: "Servicio",
    dentistId: "Odontólogo",
    date: "Fecha",
    time: "Hora",
  };

  return issues
    .map((issue) => {
      const field = issue.path[0]?.toString() ?? "campo";
      const label = labels[field] ?? field;
      return `${label}: ${issue.message}`;
    })
    .join(". ");
}

export function parseApiError(data: unknown, fallback = "Error al procesar la solicitud"): string {
  if (!data || typeof data !== "object") return fallback;
  const err = (data as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (Array.isArray(err)) {
    return formatZodIssues(err as { path: PropertyKey[]; message: string }[]);
  }
  return fallback;
}
