"use client";

import { useState, useEffect } from "react";
import { BarChart3, MessageSquare, Calendar, DollarSign, type LucideIcon } from "lucide-react";

type Reports = {
  total: number;
  byStatus: Record<string, number>;
  byService: Record<string, number>;
  peakHours: { hour: string; count: number }[];
  confirmationRate: number;
  estimatedRevenue: number;
  aiConversations: number;
  automatedMessages: number;
};

export default function AdminPage() {
  const [reports, setReports] = useState<Reports | null>(null);

  useEffect(() => {
    fetch("/api/reports").then((r) => r.json()).then(setReports);
  }, []);

  async function runNotifications() {
    const res = await fetch("/api/notifications/process", { method: "POST" });
    const data = await res.json();
    alert(`Procesadas: ${data.processed?.length ?? 0} notificaciones`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Panel Admin</h1>
          <p className="text-secondary">Reportes y configuración — Odontoclinic</p>
        </div>
        <button
          onClick={runNotifications}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Ejecutar recordatorios
        </button>
      </div>

      {reports && (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Calendar} label="Citas del mes" value={reports.total} />
            <StatCard
              icon={BarChart3}
              label="Tasa confirmación"
              value={`${reports.confirmationRate}%`}
            />
            <StatCard
              icon={DollarSign}
              label="Ingresos estimados"
              value={`$${reports.estimatedRevenue}`}
            />
            <StatCard
              icon={MessageSquare}
              label="Conversaciones IA"
              value={reports.aiConversations}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="mb-4 font-semibold text-primary">Por estado</h2>
              <div className="space-y-2">
                {Object.entries(reports.byStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="text-secondary">{status}</span>
                    <span className="font-medium text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="mb-4 font-semibold text-primary">Servicios más solicitados</h2>
              <div className="space-y-2">
                {Object.entries(reports.byService)
                  .sort(([, a], [, b]) => b - a)
                  .map(([service, count]) => (
                    <div key={service} className="flex justify-between text-sm">
                      <span className="text-secondary">{service}</span>
                      <span className="font-medium text-primary">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="mb-4 font-semibold text-primary">Horas pico</h2>
              <div className="space-y-2">
                {reports.peakHours.map(({ hour, count }) => (
                  <div key={hour} className="flex justify-between text-sm">
                    <span className="text-secondary">{hour}</span>
                    <span className="font-medium text-primary">{count} citas</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-card">
              <h2 className="mb-4 font-semibold text-primary">Automatización</h2>
              <p className="text-sm text-secondary">
                Mensajes automáticos enviados (modo demo):{" "}
                <span className="font-medium text-primary">{reports.automatedMessages}</span>
              </p>
              <p className="mt-2 text-sm text-secondary">
                Conversaciones con OdontoBot:{" "}
                <span className="font-medium text-primary">{reports.aiConversations}</span>
              </p>
            </div>
          </div>
        </>
      )}

      <div className="mt-8 rounded-xl bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-primary">Plantillas WhatsApp</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            "confirmation",
            "reminder24h",
            "reminder2h",
            "cancellation",
            "rescheduled",
            "postVisit",
          ].map((t) => (
            <div key={t} className="rounded-lg bg-gray-50 p-4">
              <p className="font-medium capitalize text-primary">{t}</p>
              <p className="mt-1 text-xs text-secondary">
                Ver docs/PLANTILLAS-WHATSAPP.md
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <Icon className="mb-2 text-accent" size={24} />
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-sm text-secondary">{label}</p>
    </div>
  );
}
