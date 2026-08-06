import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const where: Record<string, unknown> = {};

  if (date) {
    const d = parseISO(date);
    where.datetimeStart = { gte: startOfDay(d), lte: endOfDay(d) };
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { patient: true, dentist: true, service: true },
    orderBy: { datetimeStart: "asc" },
  });

  const rows = appointments.map((a) => ({
    Fecha: format(a.datetimeStart, "yyyy-MM-dd"),
    Hora: format(a.datetimeStart, "HH:mm"),
    Paciente: a.patient.name,
    Teléfono: a.patient.phone,
    Servicio: a.service.name,
    Odontólogo: a.dentist.name,
    Estado: a.status,
    Notas: a.notes ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Citas");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="odontoclinic-citas-${format(new Date(), "yyyy-MM-dd")}.xlsx"`,
    },
  });
}
