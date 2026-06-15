import { NextRequest, NextResponse } from "next/server";
import { vendorSchema, vendorSearchSchema } from "@/schemas";
import { getVendors, createVendor, getVendorNames } from "@/services/vendor.server";
import { findSimilar } from "@/utils/levenshtein";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = vendorSearchSchema.parse({
      search: searchParams.get("search") ?? undefined,
      locality: searchParams.get("locality") ?? undefined,
      speciality: searchParams.get("speciality") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    const result = await getVendors(params);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[GET /api/vendors]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = vendorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, speciality, locality, address, description, customSpeciality, forceAdd } = parsed.data;
    const finalSpeciality = speciality === "Other" && customSpeciality ? customSpeciality : speciality;

    // Duplicate check (unless forceAdd)
    if (!forceAdd) {
      const existingVendors = await getVendorNames(locality);
      const similar = findSimilar(name, existingVendors);
      if (similar.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: "DUPLICATE_WARNING",
            similar: similar.map((v) => ({ id: v.id, name: v.name })),
          },
          { status: 409 }
        );
      }
    }

    const vendor = await createVendor({
      name: name.trim(),
      speciality: finalSpeciality,
      locality,
      address: address?.trim() || undefined,
      description: description?.trim() || undefined,
    });

    return NextResponse.json({ success: true, data: vendor }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/vendors]", error);
    return NextResponse.json({ success: false, error: "Failed to create vendor" }, { status: 500 });
  }
}
