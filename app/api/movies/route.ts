import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_CONSUMET_API_URL || "https://api.consumet.org";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page") || "1";

  try {
    let url: string;

    if (search) {
      url = `${BASE_URL}/movies/flixhq/${encodeURIComponent(search)}?page=${page}`;
    } else if (genre) {
      url = `${BASE_URL}/movies/flixhq/genre/${encodeURIComponent(genre)}?page=${page}`;
    } else {
      url = `${BASE_URL}/movies/flixhq/trending?type=movie`;
    }

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`);

    const data = await res.json();

    // Filter to movies only - type can be "Movie" or missing
    const results = (data.results || []).filter(
      (item: { type?: string }) => !item.type || item.type === "Movie",
    );

    return NextResponse.json({
      results,
      hasNextPage: data.hasNextPage || false,
      currentPage: data.currentPage || 1,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { results: [], hasNextPage: false, error: "Failed to fetch" },
      { status: 500 },
    );
  }
}
