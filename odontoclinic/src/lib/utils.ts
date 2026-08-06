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
