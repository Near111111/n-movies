"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Movie } from "@/types/movie";
import MovieGrid from "@/components/MovieGrid";
import Link from "next/link";

function SearchContent() {
  const params = useSearchParams();
  const query = params.get("q") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  async function loadResults(q: string, p: number) {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/movies?search=${encodeURIComponent(q)}&page=${p}`,
      );

      const data = await res.json();
      const results: Movie[] = data.results || [];

      setMovies((prev) => (p === 1 ? results : [...prev, ...results]));
      setHasMore(data.hasNextPage || false);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (!query) return;

    const debounce = setTimeout(() => {
      setPage(1);
      loadResults(query, 1);
    }, 400);

    return () => clearTimeout(debounce);
  }, [query]);

  function loadMore() {
    const next = page + 1;
    setPage(next);
    loadResults(query, next);
  }

  return (
    <div
      style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          <Link href="/">Home</Link> / Search
        </p>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          Results for{" "}
          <span style={{ color: "var(--accent)" }}>{`"${query}"`}</span>
        </h1>
      </div>

      {loading && movies.length === 0 && (
        <p style={{ textAlign: "center" }}>Loading...</p>
      )}

      {movies.length > 0 && <MovieGrid movies={movies} />}

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="btn-primary" onClick={loadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Searching...</p>}>
      <SearchContent />
    </Suspense>
  );
}
