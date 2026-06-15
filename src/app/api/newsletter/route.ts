import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/schemas";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    try {
      await prisma.newsletterSubscriber.create({ data: { email: parsed.data.email } });
      return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 201 });
    } catch (e: unknown) {
      // Already subscribed — treat as success
      if (
        e instanceof Error &&
        "code" in (e as { code?: string }) &&
        (e as { code?: string }).code === "P2002"
      ) {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      throw e;
    }
  } catch (error) {
    console.error("[POST /api/newsletter]", error);
    return NextResponse.json({ success: false, error: "Failed to subscribe" }, { status: 500 });
  }
}
