import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const appointments = await prisma.appointment.findMany({
    where: {
      datetimeStart: { gte: monthStart, lte: monthEnd },
    },
    include: { service: true },
  });

  const byStatus = appointments.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byService = appointments.reduce(
    (acc, a) => {
      acc[a.service.name] = (acc[a.service.name] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const byHour = appointments.reduce(
    (acc, a) => {
      const hour = a.datetimeStart.getHours();
      acc[hour] = (acc[hour] ?? 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const confirmed = appointments.filter((a) => a.confirmedAt).length;
  const revenue = appointments
    .filter((a) => a.status === "COMPLETADA" && a.service.price)
    .reduce((sum, a) => sum + (a.service.price ?? 0), 0);

  const aiConversations = await prisma.aiConversation.count({
    where: { createdAt: { gte: monthStart, lte: monthEnd } },
  });

  const messages = await prisma.messageLog.count({
    where: { sentAt: { gte: monthStart, lte: monthEnd } },
  });

  return NextResponse.json({
    month: monthStart.toISOString(),
    total: appointments.length,
    byStatus,
    byService,
    peakHours: Object.entries(byHour)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count })),
    confirmationRate:
      appointments.length > 0
        ? Math.round((confirmed / appointments.length) * 100)
        : 0,
    estimatedRevenue: revenue,
    aiConversations,
    automatedMessages: messages,
  });
}
