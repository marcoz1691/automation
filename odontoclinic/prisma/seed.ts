import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes } from "date-fns";
import { DEFAULT_SETTINGS, DEMO_USERS, DENTISTS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🦷 Seeding Odontoclinic database...");

  await prisma.messageLog.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.dentist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.clinicSettings.deleteMany();

  await prisma.clinicSettings.create({
    data: {
      id: "default",
      ...DEFAULT_SETTINGS,
    },
  });

  const scheduleJson = DEFAULT_SETTINGS.hoursJson;

  const dentist1 = await prisma.dentist.create({
    data: {
      name: DENTISTS.robertoZurita.name,
      specialty: DENTISTS.robertoZurita.specialty,
      schedule: scheduleJson,
    },
  });

  const dentist2 = await prisma.dentist.create({
    data: {
      name: DENTISTS.robertoZuritaProano.name,
      specialty: DENTISTS.robertoZuritaProano.specialty,
      schedule: scheduleJson,
    },
  });

  const dentistByKey = {
    robertoZurita: dentist1,
    robertoZuritaProano: dentist2,
  };

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Consulta general / evaluación",
        durationMin: 30,
        price: 25,
        description: "Evaluación inicial y diagnóstico",
      },
    }),
    prisma.service.create({
      data: {
        name: "Limpieza dental",
        durationMin: 45,
        price: 35,
        description: "Profilaxis y limpieza profesional",
      },
    }),
    prisma.service.create({
      data: {
        name: "Extracción",
        durationMin: 45,
        price: 40,
        description: "Extracción dental simple",
      },
    }),
    prisma.service.create({
      data: {
        name: "Endodoncia",
        durationMin: 60,
        price: 120,
        description: "Tratamiento de conducto",
      },
    }),
    prisma.service.create({
      data: {
        name: "Ortodoncia (control)",
        durationMin: 30,
        price: 30,
        description: "Control de brackets o alineadores",
      },
    }),
    prisma.service.create({
      data: {
        name: "Blanqueamiento",
        durationMin: 60,
        price: 80,
        description: "Blanqueamiento dental profesional",
      },
    }),
    prisma.service.create({
      data: {
        name: "Urgencia dental",
        durationMin: 30,
        price: 35,
        description: "Atención de urgencias en horario de consulta",
      },
    }),
    prisma.service.create({
      data: {
        name: "Rehabilitación oral",
        durationMin: 60,
        price: 150,
        description: "Evaluación y plan de rehabilitación oral",
      },
    }),
  ]);

  for (const demo of DEMO_USERS) {
    const dentistId =
      "dentistKey" in demo
        ? dentistByKey[demo.dentistKey as keyof typeof dentistByKey]?.id
        : undefined;

    await prisma.user.create({
      data: {
        email: demo.email,
        passwordHash: await bcrypt.hash(demo.password, 10),
        name: demo.name,
        role: demo.role,
        dentistId,
      },
    });
  }

  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        name: "Carlos Mendoza",
        phone: "0991234567",
        email: "carlos@email.com",
      },
    }),
    prisma.patient.create({
      data: {
        name: "Laura Vega",
        phone: "0987654321",
        email: "laura@email.com",
      },
    }),
    prisma.patient.create({
      data: {
        name: "Pedro Salinas",
        phone: "0976543210",
      },
    }),
    prisma.patient.create({
      data: {
        name: "María Torres",
        phone: "0965432109",
        email: "maria.t@email.com",
      },
    }),
  ]);

  const today = new Date();
  const appointmentData = [
    {
      patient: patients[0],
      dentist: dentist1,
      service: services[7],
      dayOffset: 0,
      hour: 9,
      minute: 0,
      status: "CONFIRMADA" as const,
    },
    {
      patient: patients[1],
      dentist: dentist2,
      service: services[0],
      dayOffset: 0,
      hour: 10,
      minute: 0,
      status: "PENDIENTE" as const,
    },
    {
      patient: patients[2],
      dentist: dentist2,
      service: services[1],
      dayOffset: 0,
      hour: 11,
      minute: 0,
      status: "CONFIRMADA" as const,
    },
    {
      patient: patients[3],
      dentist: dentist1,
      service: services[6],
      dayOffset: 0,
      hour: 15,
      minute: 0,
      status: "PENDIENTE" as const,
    },
    {
      patient: patients[0],
      dentist: dentist2,
      service: services[5],
      dayOffset: 1,
      hour: 9,
      minute: 0,
      status: "PENDIENTE" as const,
    },
    {
      patient: patients[1],
      dentist: dentist1,
      service: services[2],
      dayOffset: 1,
      hour: 16,
      minute: 0,
      status: "CONFIRMADA" as const,
    },
    {
      patient: patients[2],
      dentist: dentist2,
      service: services[3],
      dayOffset: 2,
      hour: 10,
      minute: 0,
      status: "PENDIENTE" as const,
    },
    {
      patient: patients[3],
      dentist: dentist1,
      service: services[7],
      dayOffset: 3,
      hour: 11,
      minute: 30,
      status: "CONFIRMADA" as const,
    },
    {
      patient: patients[0],
      dentist: dentist2,
      service: services[0],
      dayOffset: -2,
      hour: 16,
      minute: 0,
      status: "COMPLETADA" as const,
    },
    {
      patient: patients[1],
      dentist: dentist1,
      service: services[1],
      dayOffset: -1,
      hour: 9,
      minute: 30,
      status: "NO_SHOW" as const,
    },
  ];

  for (const apt of appointmentData) {
    const date = addDays(today, apt.dayOffset);
    const start = setMinutes(setHours(date, apt.hour), apt.minute);
    const end = new Date(start.getTime() + apt.service.durationMin * 60 * 1000);

    await prisma.appointment.create({
      data: {
        patientId: apt.patient.id,
        dentistId: apt.dentist.id,
        serviceId: apt.service.id,
        datetimeStart: start,
        datetimeEnd: end,
        status: apt.status,
        source: "RECEPCION",
        confirmedAt: apt.status === "CONFIRMADA" ? new Date() : undefined,
      },
    });
  }

  console.log("✅ Seed completed");
  console.log("Demo users:");
  DEMO_USERS.forEach((u) => console.log(`  ${u.email} / ${u.password}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
