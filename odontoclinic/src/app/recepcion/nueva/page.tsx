import { BookingWizard } from "@/components/BookingWizard";

export default function NuevaCitaPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Nueva cita — Recepción</h1>
      <BookingWizard />
    </div>
  );
}
