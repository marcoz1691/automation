import { BookingWizard } from "@/components/BookingWizard";

export default function NuevaCitaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-primary">Agendar cita — Recepción</h1>
      <p className="mb-6 text-secondary">
        La asistente usa el mismo proceso que el paciente en línea
      </p>
      <BookingWizard mode="reception" />
    </div>
  );
}
