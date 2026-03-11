import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL || "https://api.consumet.org";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const episodeId = searchParams.get("episodeId");
  const mediaId = searchParams.get("mediaId");

  if (!episodeId || !mediaId) {
    return NextResponse.json({ error: "episodeId and mediaId are required" }, { status: 400 });
  }

  try {
    const url = `${BASE_URL}/movies/flixhq/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error(`Upstream error: ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stream" }, { status: 500 });
  }
}
