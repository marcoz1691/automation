import { BookingWizard } from "@/components/BookingWizard";

export default function ReservarPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">Agendar cita</h1>
        <p className="mt-2 text-secondary">
          Completa los pasos para reservar tu consulta en Odontoclinic
        </p>
      </div>
      <BookingWizard />
    </div>
  );
}
