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

  useEffect(() => {
    if (!query) return;
    setMovies([]);
    setPage(1);
    loadResults(query, 1, true);
  }, [query]);

  async function loadResults(q: string, p: number, reset = false) {
    setLoading(true);
    try {
      const res = await fetch(`/api/movies?search=${encodeURIComponent(q)}&page=${p}`);
      const data = await res.json();
      const results: Movie[] = data.results || [];
      if (reset) setMovies(results);
      else setMovies((prev) => [...prev, ...results]);
      setHasMore(data.hasNextPage || false);
    } catch {}
    setLoading(false);
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadResults(query, nextPage);
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          {" / "}Search
        </p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
          {query ? (
            <>Results for <span style={{ color: "var(--accent)" }}>"{query}"</span></>
          ) : "Search Movies"}
        </h1>
        {!loading && movies.length > 0 && (
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {movies.length} result{movies.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {loading && movies.length === 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1rem",
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton" style={{ paddingBottom: "145%", borderRadius: "12px" }} />
              <div className="skeleton" style={{ height: "14px", marginTop: "8px", width: "80%", borderRadius: "6px" }} />
            </div>
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && query && (
        <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <p>No results found for "{query}"</p>
          <Link href="/movies" style={{ color: "var(--accent)", marginTop: "1rem", display: "inline-block" }}>
            Browse All Movies →
          </Link>
        </div>
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
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Searching...</div>}>
      <SearchContent />
    </Suspense>
  );
}
