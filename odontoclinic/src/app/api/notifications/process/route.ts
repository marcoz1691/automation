import { NextResponse } from "next/server";
import { processScheduledNotifications } from "@/lib/messages";

export async function POST() {
  const result = await processScheduledNotifications();
  return NextResponse.json(result);
}

export async function GET() {
  const result = await processScheduledNotifications();
  return NextResponse.json(result);
}
