"use client";

import { useState } from "react";
import { format, addMinutes, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "@/components/StatusBadge";

function canCancel(appointmentStart: Date, policyHours = 24) {
  return isAfter(appointmentStart, addMinutes(new Date(), policyHours * 60));
}

type Appointment = {
  id: string;
  datetimeStart: string;
  status: string;
  dentist: { name: string };
  service: { name: string };
};

export default function MisCitasPage() {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function search() {
    setLoading(true);
    setSearched(true);
    const res = await fetch(`/api/patients?phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    setAppointments(data.appointments ?? []);
    setPatientName(data.patient?.name ?? "");
    setLoading(false);
  }

  async function cancelAppointment(id: string) {
    const apt = appointments.find((a) => a.id === id);
    if (!apt) return;

    if (!canCancel(new Date(apt.datetimeStart), 24)) {
      alert("Cancelación requiere mínimo 24 horas de anticipación. Llama a la clínica.");
      return;
    }

    const reason = prompt("Motivo de cancelación (opcional):") ?? "";
    setActionLoading(id);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "cancel",
        cancelReason: reason,
        cancelledBy: "patient",
      }),
    });
    await search();
    setActionLoading(null);
  }

  async function confirmAppointment(id: string) {
    setActionLoading(id);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirm" }),
    });
    await search();
    setActionLoading(null);
  }

  const upcoming = appointments.filter(
    (a) =>
      a.status !== "CANCELADA" &&
      a.status !== "COMPLETADA" &&
      new Date(a.datetimeStart) >= new Date()
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary">Mis citas</h1>
      <p className="mt-2 text-secondary">
        Consulta, confirma o cancela tus citas con tu número de teléfono
      </p>

      <div className="mt-6 flex gap-2">
        <input
          placeholder="Tu teléfono / WhatsApp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3"
        />
        <button
          onClick={search}
          disabled={!phone || loading}
          className="rounded-xl bg-accent px-6 py-3 text-white disabled:opacity-50"
        >
          Buscar
        </button>
      </div>

      {searched && !loading && (
        <div className="mt-8">
          {patientName && (
            <p className="mb-4 text-secondary">
              Paciente: <span className="font-medium text-primary">{patientName}</span>
            </p>
          )}

          {upcoming.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-6 text-center text-secondary">
              No tienes citas activas.{" "}
              <a href="/reservar" className="text-accent hover:underline">
                Agendar nueva cita
              </a>
            </p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-primary">{apt.service.name}</p>
                      <p className="text-sm text-secondary">{apt.dentist.name}</p>
                      <p className="mt-2 text-primary">
                        {format(new Date(apt.datetimeStart), "EEEE d MMMM, HH:mm", {
                          locale: es,
                        })}
                      </p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    {apt.status === "PENDIENTE" && (
                      <button
                        onClick={() => confirmAppointment(apt.id)}
                        disabled={actionLoading === apt.id}
                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                      >
                        Confirmar asistencia
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      disabled={actionLoading === apt.id}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700"
                    >
                      Cancelar cita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {appointments.filter((a) => a.status === "COMPLETADA" || a.status === "CANCELADA")
            .length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 font-semibold text-primary">Historial</h2>
              <div className="space-y-2">
                {appointments
                  .filter((a) => a.status === "COMPLETADA" || a.status === "CANCELADA")
                  .map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm"
                    >
                      <span>
                        {format(new Date(apt.datetimeStart), "d/M/yyyy HH:mm")} —{" "}
                        {apt.service.name}
                      </span>
                      <StatusBadge status={apt.status} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
