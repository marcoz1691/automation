"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Phone, Check, X, UserX } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

type Appointment = {
  id: string;
  datetimeStart: string;
  status: string;
  notes?: string | null;
  patient: { name: string; phone: string };
  dentist: { name: string };
  service: { name: string };
};

export function AppointmentCard({
  appointment,
  onAction,
  loading,
}: {
  appointment: Appointment;
  onAction: (id: string, action: string) => void;
  loading?: string | null;
}) {
  const date = new Date(appointment.datetimeStart);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-lg font-semibold text-primary">
            {format(date, "HH:mm")}
          </p>
          <p className="text-sm text-secondary">
            {format(date, "EEEE d MMM", { locale: es })}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="space-y-1 text-sm">
        <p className="font-medium text-primary">{appointment.patient.name}</p>
        <a
          href={`tel:${appointment.patient.phone}`}
          className="inline-flex items-center gap-1 text-accent hover:underline"
        >
          <Phone size={14} />
          {appointment.patient.phone}
        </a>
        <p className="text-secondary">{appointment.service.name}</p>
        <p className="text-secondary">{appointment.dentist.name}</p>
        {appointment.notes && (
          <p className="text-xs italic text-secondary">{appointment.notes}</p>
        )}
      </div>

      {appointment.status !== "CANCELADA" &&
        appointment.status !== "COMPLETADA" && (
          <div className="mt-4 flex flex-wrap gap-2">
            {appointment.status === "PENDIENTE" && (
              <button
                onClick={() => onAction(appointment.id, "confirm")}
                disabled={loading === appointment.id}
                className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                <Check size={14} /> Confirmar
              </button>
            )}
            <button
              onClick={() => onAction(appointment.id, "complete")}
              disabled={loading === appointment.id}
              className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              <Check size={14} /> Completada
            </button>
            <button
              onClick={() => onAction(appointment.id, "no_show")}
              disabled={loading === appointment.id}
              className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              <UserX size={14} /> No asistió
            </button>
            <button
              onClick={() => onAction(appointment.id, "cancel")}
              disabled={loading === appointment.id}
              className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              <X size={14} /> Cancelar
            </button>
          </div>
        )}
    </div>
  );
}
