import { NextRequest, NextResponse } from "next/server";
import { reportSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: { id: report.id } }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/reports]", error);
    return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 });
  }
}
