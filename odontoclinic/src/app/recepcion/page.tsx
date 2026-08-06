"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Search,
  Download,
  Upload,
  RefreshCw,
  Plus,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { AppointmentCard } from "@/components/AppointmentCard";

type Appointment = {
  id: string;
  datetimeStart: string;
  status: string;
  notes?: string | null;
  patient: { name: string; phone: string };
  dentist: { name: string };
  service: { name: string };
};

export default function RecepcionPage() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<{ id: string; message: string }[]>([]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ date });
    if (search) params.set("search", search);
    const res = await fetch(`/api/appointments?${params}`);
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  }, [date, search]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  useEffect(() => {
    fetch("/api/notifications/process").then((r) => r.json()).then((data) => {
      setAlerts(data.alertsForReception ?? []);
    });
  }, []);

  async function handleAction(id: string, action: string) {
    setActionLoading(id);
    await fetch(`/api/appointments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, cancelledBy: "staff" }),
    });
    await loadAppointments();
    setActionLoading(null);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/import", { method: "POST", body: formData });
    const data = await res.json();
    setImportResult(
      `Importadas: ${data.imported}, omitidas: ${data.skipped}${data.errors?.length ? `, errores: ${data.errors.length}` : ""}`
    );
    await loadAppointments();
  }

  const pending = appointments.filter((a) => a.status === "PENDIENTE");
  const confirmed = appointments.filter((a) => a.status === "CONFIRMADA");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary md:text-3xl">
            Recepción — Hoy
          </h1>
          <p className="text-secondary">
            {format(new Date(date + "T12:00:00"), "EEEE d MMMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/recepcion/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            <Plus size={16} /> Agendar cita (asistente)
          </Link>
          <a
            href={`/api/export?date=${date}`}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-primary"
          >
            <Download size={16} /> Exportar Excel
          </a>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-primary">
            <Upload size={16} /> Importar Excel
            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </label>
          <button
            onClick={loadAppointments}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
          >
            <RefreshCw size={16} /> Actualizar
          </button>
        </div>
      </div>

      {importResult && (
        <div className="mb-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {importResult}
        </div>
      )}

      {alerts.length > 0 && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 font-medium text-amber-800">
            <AlertTriangle size={18} /> Citas sin confirmar — llamar paciente
          </div>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            {alerts.map((a) => (
              <li key={a.id}>{a.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-2xl font-bold text-primary">{appointments.length}</p>
          <p className="text-sm text-secondary">Total hoy</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
          <p className="text-sm text-secondary">Pendientes</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-card">
          <p className="text-2xl font-bold text-blue-600">{confirmed.length}</p>
          <p className="text-sm text-secondary">Confirmadas</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-2"
        />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input
            placeholder="Buscar por nombre o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-4"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-secondary">Cargando agenda...</p>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl bg-gray-50 p-12 text-center text-secondary">
          No hay citas para este día
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onAction={handleAction}
              loading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
