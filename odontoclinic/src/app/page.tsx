import Link from "next/link";
import { Calendar, Clock, Shield, Sparkles } from "lucide-react";
import { formatClinicHoursSummary } from "@/lib/constants";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    take: 6,
  });

  const settings = await prisma.clinicSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
              Clínica Odontológica
            </p>
            <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">
              Tu sonrisa merece atención profesional
            </h1>
            <p className="mt-4 text-lg text-secondary">
              Agenda tu cita en minutos. Sin llamadas, sin esperas. Confirmaciones automáticas
              por WhatsApp y asistente virtual disponible 24/7.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/reservar"
                className="rounded-xl bg-accent px-8 py-3 font-semibold text-white shadow-md hover:bg-blue-600"
              >
                Agendar cita
              </Link>
              <Link
                href="/mis-citas"
                className="rounded-xl border border-gray-200 px-8 py-3 font-semibold text-primary hover:bg-gray-50"
              >
                Mis citas
              </Link>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-card">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: "Reserva online", desc: "En menos de 2 minutos" },
                { icon: Clock, label: "Recordatorios", desc: "24h y 2h antes" },
                { icon: Shield, label: "Sin doble reserva", desc: "Agenda en tiempo real" },
                { icon: Sparkles, label: "OdontoBot IA", desc: "Asistente virtual" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
                  <Icon className="mb-2 text-accent" size={24} />
                  <p className="font-semibold text-primary">{label}</p>
                  <p className="text-xs text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-primary">Nuestros servicios</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-card"
            >
              <h3 className="font-semibold text-primary">{s.name}</h3>
              <p className="mt-1 text-sm text-secondary">{s.description}</p>
              <p className="mt-3 text-sm font-medium text-accent">
                {s.durationMin} min{s.price ? ` · $${s.price}` : ""}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-primary">Horarios de atención</h2>
              <ul className="mt-4 space-y-2 text-secondary">
                {formatClinicHoursSummary().split("\n").map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Contacto</h2>
              <ul className="mt-4 space-y-2 text-secondary">
                <li>{settings?.address}</li>
                <li>Tel: {settings?.phone}</li>
                <li>WhatsApp: {settings?.whatsapp}</li>
                <li>{settings?.email}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
