import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteRating } from "@/services/rating.server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteRating(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/ratings/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete rating" }, { status: 500 });
  }
}
