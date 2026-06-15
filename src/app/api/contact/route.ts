import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: { id: message.id } }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
  }
}
