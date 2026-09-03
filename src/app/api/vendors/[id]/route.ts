import { NextRequest, NextResponse } from "next/server";
import { getVendorBySlug, updateVendor, deleteVendor } from "@/services/vendor.server";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const vendor = await getVendorBySlug(id);
    if (!vendor) {
      return NextResponse.json({ success: false, error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error("[GET /api/vendors/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch vendor" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const vendor = await updateVendor(id, body);
    
    // Invalidate caches so the dashboard and public site immediately update
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error("[PATCH /api/vendors/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to update vendor" }, { status: 500 });
  }
}

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
    await deleteVendor(id);
    
    // Invalidate caches so the dashboard and public site immediately update
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true, message: "Vendor deleted" });
  } catch (error) {
    console.error("[DELETE /api/vendors/[id]]", error);
    return NextResponse.json({ success: false, error: "Failed to delete vendor" }, { status: 500 });
  }
}
