import { NextRequest, NextResponse } from "next/server";
import { processOdontoBotMessage } from "@/lib/ai/odontobot";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string().min(1),
  phone: z.string().optional(),
  conversationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = chatSchema.parse(await request.json());
    const result = await processOdontoBotMessage(body.message, {
      phone: body.phone,
      conversationId: body.conversationId,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
  }
}
