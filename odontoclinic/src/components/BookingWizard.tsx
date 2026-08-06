"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Check } from "lucide-react";
import Link from "next/link";
import { parseApiError, formatPhone } from "@/lib/utils";
import { describeDentistVisitDays } from "@/lib/dentist-schedule";

type Service = { id: string; name: string; durationMin: number; price?: number | null };
type Dentist = {
  id: string;
  name: string;
  specialty?: string | null;
  kind?: string;
  schedule?: string;
};

type BookingWizardProps = {
  mode?: "public" | "reception";
  onSuccess?: () => void;
};

export function BookingWizard({ mode = "public", onSuccess }: BookingWizardProps) {
  const isReception = mode === "reception";

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [availability, setAvailability] = useState<
    { dentistId: string; dentistName: string; slots: string[]; kind?: string }[]
  >([]);

  const [serviceId, setServiceId] = useState("");
  const [dentistId, setDentistId] = useState("");
  const [date, setDate] = useState(format(addDays(new Date(), 0), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [autoConfirm, setAutoConfirm] = useState(isReception);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const internalDentists = dentists.filter((d) => d.kind !== "EXTERNO");
  const externalDentists = dentists.filter((d) => d.kind === "EXTERNO");

  useEffect(() => {
    Promise.all([
      fetch("/api/services").then((r) => r.json()),
      fetch("/api/dentists").then((r) => r.json()),
    ]).then(([s, d]) => {
      setServices(s);
      setDentists(d);
    });
  }, []);

  useEffect(() => {
    if (!serviceId || !date) return;
    fetch(
      `/api/availability?date=${date}&serviceId=${serviceId}${dentistId ? `&dentistId=${dentistId}` : ""}`
    )
      .then((r) => r.json())
      .then((data) => setAvailability(data.dentists ?? []));
  }, [serviceId, date, dentistId]);

  async function submitBooking() {
    setLoading(true);
    setError("");

    const phoneDigits = formatPhone(phone);
    if (phoneDigits.length < 8) {
      setError("Teléfono: ingresa al menos 8 dígitos (ej. 0991234567)");
      setLoading(false);
      return;
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Email: formato no válido. Déjalo vacío si no tienes.");
      setLoading(false);
      return;
    }

    try {
      const selectedDentist =
        dentistId ||
        availability.find((a) => a.slots.includes(time))?.dentistId;

      if (!selectedDentist) {
        setError("Selecciona odontólogo y horario");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phone,
          email: email.trim() || undefined,
          serviceId,
          dentistId: selectedDentist,
          date,
          time,
          reason: reason.trim() || undefined,
          notes: internalNotes.trim() || undefined,
          source: isReception ? "RECEPCION" : "WEB",
          autoConfirm: isReception && autoConfirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(parseApiError(data, "Error al reservar"));
        return;
      }

      setSuccess(true);
      onSuccess?.();
    } catch {
      setError("No se pudo conectar. Revisa tu internet e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function renderDentistButton(d: Dentist) {
    return (
      <button
        key={d.id}
        onClick={() => {
          setDentistId(d.id);
          setStep(3);
        }}
        className="w-full rounded-xl border border-gray-200 p-4 text-left hover:border-accent"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-primary">{d.name}</p>
            {d.specialty && <p className="text-sm text-secondary">{d.specialty}</p>}
            {d.kind === "EXTERNO" && d.schedule && (
              <p className="mt-1 text-xs text-secondary">
                Atiende: {describeDentistVisitDays(d.schedule)}
              </p>
            )}
          </div>
          {d.kind === "EXTERNO" && (
            <span className="shrink-0 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700">
              Externo
            </span>
          )}
        </div>
      </button>
    );
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-primary">¡Cita registrada!</h2>
        <p className="mt-2 text-secondary">
          {isReception
            ? "La cita quedó en la agenda de recepción."
            : "Te enviamos confirmación por WhatsApp (modo demo). Revisa Mis citas para gestionarla."}
        </p>
        {isReception && (
          <Link
            href="/recepcion"
            className="mt-6 inline-block rounded-xl bg-accent px-6 py-3 font-medium text-white"
          >
            Volver a recepción
          </Link>
        )}
      </div>
    );
  }

  const steps = ["Servicio", "Profesional", "Fecha y hora", isReception ? "Paciente" : "Tus datos"];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card md:p-8">
      {isReception && (
        <div className="mb-4 rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-800">
          Modo asistente — mismo flujo que el paciente, registrado por recepción
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step > i + 1
                  ? "bg-accent text-white"
                  : step === i + 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-secondary"
              }`}
            >
              {i + 1}
            </div>
            <span className="mt-1 hidden text-xs text-secondary sm:block">{label}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-primary">Selecciona el servicio</h2>
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setServiceId(s.id);
                setStep(2);
              }}
              className={`w-full rounded-xl border p-4 text-left transition hover:border-accent ${
                serviceId === s.id ? "border-accent bg-blue-50" : "border-gray-200"
              }`}
            >
              <p className="font-medium text-primary">{s.name}</p>
              <p className="text-sm text-secondary">
                {s.durationMin} min{s.price ? ` · $${s.price}` : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Elige profesional</h2>
          <button
            onClick={() => {
              setDentistId("");
              setStep(3);
            }}
            className="w-full rounded-xl border border-gray-200 p-4 text-left hover:border-accent"
          >
            <p className="font-medium text-primary">Cualquier disponible</p>
            <p className="text-sm text-secondary">El sistema asigna según horario</p>
          </button>

          {internalDentists.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">Equipo permanente</p>
              {internalDentists.map(renderDentistButton)}
            </div>
          )}

          {externalDentists.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">Especialistas externos</p>
              {externalDentists.map(renderDentistButton)}
            </div>
          )}

          <button onClick={() => setStep(1)} className="text-sm text-accent">
            ← Volver
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Fecha y hora</h2>
          <input
            type="date"
            value={date}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availability.flatMap((d) =>
              d.slots.map((slot) => (
                <button
                  key={`${d.dentistId}-${slot}`}
                  onClick={() => {
                    setTime(slot);
                    if (!dentistId) setDentistId(d.dentistId);
                  }}
                  className={`rounded-lg border px-2 py-2 text-sm ${
                    time === slot
                      ? "border-accent bg-blue-50 text-accent"
                      : "border-gray-200 hover:border-accent"
                  }`}
                  title={d.dentistName}
                >
                  {slot}
                  {!dentistId && (
                    <span className="block truncate text-[10px] text-secondary">
                      {d.dentistName.split(" ").slice(-1)[0]}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
          {availability.every((a) => a.slots.length === 0) && (
            <p className="text-sm text-secondary">
              No hay horarios este día. Los especialistas externos solo atienden ciertos días.
            </p>
          )}
          <div className="flex justify-between">
            <button onClick={() => setStep(2)} className="text-sm text-accent">
              ← Volver
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={!time}
              className="rounded-xl bg-accent px-6 py-2 text-white disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">
            {isReception ? "Datos del paciente" : "Tus datos"}
          </h2>
          <input
            placeholder="Nombre completo *"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          <input
            placeholder="Teléfono / WhatsApp *"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          <p className="text-xs text-secondary">Mínimo 8 dígitos. Ej: 0991234567</p>
          <input
            placeholder="Email (opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
          />
          <textarea
            placeholder="Motivo de consulta (opcional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-3"
            rows={2}
          />
          {isReception && (
            <>
              <textarea
                placeholder="Notas internas recepción (opcional)"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                rows={2}
              />
              <label className="flex items-center gap-2 text-sm text-primary">
                <input
                  type="checkbox"
                  checked={autoConfirm}
                  onChange={(e) => setAutoConfirm(e.target.checked)}
                  className="rounded"
                />
                Confirmar cita al guardar
              </label>
            </>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-between">
            <button onClick={() => setStep(3)} className="text-sm text-accent">
              ← Volver
            </button>
            <button
              onClick={submitBooking}
              disabled={loading || !patientName || !phone}
              className="rounded-xl bg-primary px-6 py-3 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Guardando..." : isReception ? "Guardar cita" : "Confirmar cita"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
