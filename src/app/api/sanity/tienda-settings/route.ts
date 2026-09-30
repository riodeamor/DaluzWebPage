import { NextResponse } from "next/server";
import { getTiendaSettings } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getTiendaSettings();

    return NextResponse.json({ settings }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("Error fetching tienda settings:", error);
    return NextResponse.json(
      { error: "Error fetching tienda settings" },
      { status: 500 },
    );
  }
}
