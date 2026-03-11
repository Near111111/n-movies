import { NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_CONSUMET_API_URL || "http://localhost:3000";

const DEFAULT_GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page") || "1";
  const pageNum = Number(page);

  try {
    let url: string;

    if (search) {
      url = `${BASE_URL}/movies/flixhq/${encodeURIComponent(search)}?page=${page}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`Upstream error: ${res.status}`);
      const data = await res.json();
      const rawResults = Array.isArray(data) ? data : data.results || [];
      return NextResponse.json({
        results: rawResults.filter(
          (item: { type?: string }) => !item.type || item.type === "Movie",
        ),
        hasNextPage: data.hasNextPage ?? false,
        currentPage: pageNum,
      });
    }

    if (genre) {
      url = `${BASE_URL}/movies/flixhq/genre/${encodeURIComponent(genre)}?page=${page}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) throw new Error(`Upstream error: ${res.status}`);
      const data = await res.json();
      const rawResults = Array.isArray(data) ? data : data.results || [];
      return NextResponse.json({
        results: rawResults.filter(
          (item: { type?: string }) => !item.type || item.type === "Movie",
        ),
        hasNextPage: data.hasNextPage ?? false,
        currentPage: pageNum,
      });
    }

    // No genre — rotate through genres per page for infinite scroll
    const genreIndex = (pageNum - 1) % DEFAULT_GENRES.length;
    const genrePage = Math.floor((pageNum - 1) / DEFAULT_GENRES.length) + 1;
    const pickedGenre = DEFAULT_GENRES[genreIndex];
    url = `${BASE_URL}/movies/flixhq/genre/${encodeURIComponent(pickedGenre)}?page=${genrePage}`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`);
    const data = await res.json();
    const rawResults = Array.isArray(data) ? data : data.results || [];

    return NextResponse.json({
      results: rawResults.filter(
        (item: { type?: string }) => !item.type || item.type === "Movie",
      ),
      hasNextPage: true,
      currentPage: pageNum,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { results: [], hasNextPage: false, error: "Failed to fetch" },
      { status: 500 },
    );
  }
}
