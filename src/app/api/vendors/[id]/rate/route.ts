import { NextRequest, NextResponse } from "next/server";
import { ratingSchema } from "@/schemas";
import { createRating, hasUserRated } from "@/services/rating.server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: vendorId } = await params;
  try {
    // Check vendor exists
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = ratingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { stars, comment, fingerprint } = parsed.data;
    const session = await auth();
    const userId = session?.user?.id;

    // Check for duplicate rating
    const alreadyRated = await hasUserRated(vendorId, userId, fingerprint);
    if (alreadyRated) {
      return NextResponse.json(
        { success: false, error: "You have already rated this vendor" },
        { status: 409 }
      );
    }

    const rating = await createRating({
      vendorId,
      stars,
      comment: comment || undefined,
      userId: userId || undefined,
      fingerprint: fingerprint || undefined,
    });

    return NextResponse.json({ success: true, data: rating }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation from Prisma
    if (
      error instanceof Error &&
      "code" in (error as { code?: string }) &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { success: false, error: "You have already rated this vendor" },
        { status: 409 }
      );
    }
    console.error("[POST /api/vendors/[id]/rate]", error);
    return NextResponse.json({ success: false, error: "Failed to submit rating" }, { status: 500 });
  }
}
