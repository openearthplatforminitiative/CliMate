import { NextRequest, NextResponse } from "next/server";
import { GeocoderClient } from "openepi-client";

export async function GET(request: NextRequest) {
  const geocoderClient = new GeocoderClient("https://api.openepi.io/geocoding");
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  try {
    const result = await geocoderClient.getReverseGeocoding({ lon, lat });
    const { data } = result;
    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error " },
      { status: 500 }
    );
  }
}
