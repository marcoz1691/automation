import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parseDateTime, isSlotAvailable } from "@/lib/availability";
import { normalizePhone } from "@/lib/utils";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

    const services = await prisma.service.findMany();
    const dentists = await prisma.dentist.findMany();
    const results = { imported: 0, skipped: 0, errors: [] as string[] };

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      try {
        const fecha = row.Fecha ?? row.fecha;
        const hora = row.Hora ?? row.hora;
        const paciente = row.Paciente ?? row.paciente;
        const telefono = row.Teléfono ?? row.Telefono ?? row.telefono;
        const servicioName = row.Servicio ?? row.servicio;
        const odontologoName = row.Odontólogo ?? row.Odontologo ?? row.odontologo;
        const notas = row.Notas ?? row.notas ?? "";
        const estado = (row.Estado ?? row.estado ?? "PENDIENTE").toUpperCase();

        if (!fecha || !hora || !paciente || !telefono) {
          results.skipped++;
          continue;
        }

        const service = services.find((s) =>
          s.name.toLowerCase().includes(String(servicioName).toLowerCase().slice(0, 8))
        ) ?? services[0];

        const dentist = dentists.find((d) =>
          d.name.toLowerCase().includes(String(odontologoName ?? "").toLowerCase().slice(0, 6))
        ) ?? dentists[0];

        const dateStr =
          typeof fecha === "number"
            ? XLSX.SSF.format("yyyy-mm-dd", fecha)
            : String(fecha).split("T")[0];

        const timeStr = String(hora).length <= 5 ? String(hora) : String(hora).slice(11, 16);
        const start = parseDateTime(dateStr, timeStr);
        const end = new Date(start.getTime() + service.durationMin * 60 * 1000);

        const available = await isSlotAvailable(dentist.id, start, end);
        if (!available) {
          results.errors.push(`Fila ${index + 2}: conflicto de horario`);
          results.skipped++;
          continue;
        }

        const phone = normalizePhone(String(telefono));
        let patient = await prisma.patient.findFirst({
          where: { phone: { contains: phone.slice(-9) } },
        });

        if (!patient) {
          patient = await prisma.patient.create({
            data: { name: String(paciente), phone },
          });
        }

        const statusMap: Record<string, "PENDIENTE" | "CONFIRMADA" | "COMPLETADA" | "CANCELADA" | "NO_SHOW"> = {
          PENDIENTE: "PENDIENTE",
          CONFIRMADA: "CONFIRMADA",
          COMPLETADA: "COMPLETADA",
          CANCELADA: "CANCELADA",
          NO_SHOW: "NO_SHOW",
          "NO ASISTIO": "NO_SHOW",
        };

        await prisma.appointment.create({
          data: {
            patientId: patient.id,
            dentistId: dentist.id,
            serviceId: service.id,
            datetimeStart: start,
            datetimeEnd: end,
            status: statusMap[estado] ?? "PENDIENTE",
            source: "IMPORT",
            notes: String(notas),
          },
        });

        results.imported++;
      } catch (e) {
        results.errors.push(`Fila ${index + 2}: ${String(e)}`);
        results.skipped++;
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al importar" }, { status: 500 });
  }
}
