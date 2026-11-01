import { NextRequest, NextResponse } from "next/server";
import { getAvailability } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const dentistId = searchParams.get("dentistId") ?? undefined;

  if (!date || !serviceId) {
    return NextResponse.json(
      { error: "date y serviceId son requeridos" },
      { status: 400 }
    );
  }

  const availability = await getAvailability({ date, serviceId, dentistId });
  return NextResponse.json(availability);
}
