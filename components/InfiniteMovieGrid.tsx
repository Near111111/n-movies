"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";
import { GENRES } from "@/lib/api";

const YEARS = [
  "All Years",
  ...Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)),
];
const SORT_OPTIONS = ["Most Popular", "Latest", "Top Rated"];

export default function InfiniteMovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [genre, setGenre] = useState("All Genres");
  const [year, setYear] = useState("All Years");
  const [sort, setSort] = useState("Most Popular");

  const loaderRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const genreRef = useRef(genre);
  const yearRef = useRef(year);
  const sortRef = useRef(sort);

  const fetchMovies = useCallback(async (reset: boolean) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const fetchPage = reset ? 1 : pageRef.current;
    const currentGenre = genreRef.current;
    const currentYear = yearRef.current;
    const currentSort = sortRef.current;

    try {
      let url = `/api/movies?page=${fetchPage}`;
      if (currentGenre !== "All Genres")
        url += `&genre=${encodeURIComponent(currentGenre)}`;

      const res = await fetch(url);
      const data = await res.json();
      let results: Movie[] = data.results || [];

      if (currentYear !== "All Years") {
        results = results.filter((m) => m.releaseDate?.includes(currentYear));
      }
      if (currentSort === "Top Rated") {
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (currentSort === "Latest") {
        results.sort((a, b) =>
          (b.releaseDate || "").localeCompare(a.releaseDate || ""),
        );
      }

      const more = data.hasNextPage ?? false;
      const nextPage = fetchPage + 1;

      hasMoreRef.current = more;
      pageRef.current = nextPage;
      setHasMore(more);
      setPage(nextPage);

      if (reset) {
        setMovies(results);
      } else {
        setMovies((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          return [...prev, ...results.filter((m) => !ids.has(m.id))];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // On filter change
  useEffect(() => {
    genreRef.current = genre;
    yearRef.current = year;
    sortRef.current = sort;
    hasMoreRef.current = true;
    pageRef.current = 1;
    fetchMovies(true);
  }, [genre, year, sort]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingRef.current &&
          hasMoreRef.current
        ) {
          fetchMovies(false);
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchMovies]);

  return (
    <section>
      {/* Header + Filters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: 0,
          }}
        >
          <span
            style={{
              width: "4px",
              height: "1.4rem",
              background: "var(--accent)",
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          More Movies
        </h2>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Select
            value={genre}
            onChange={setGenre}
            options={["All Genres", ...GENRES]}
          />
          <Select value={year} onChange={setYear} options={YEARS} />
          <Select value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>
      </div>

      {/* Skeleton */}
      {loading && movies.length === 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: "1rem",
          }}
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <div
                className="skeleton"
                style={{ paddingBottom: "145%", borderRadius: "12px" }}
              />
              <div
                className="skeleton"
                style={{
                  height: "14px",
                  marginTop: "8px",
                  width: "80%",
                  borderRadius: "6px",
                }}
              />
              <div
                className="skeleton"
                style={{
                  height: "12px",
                  marginTop: "6px",
                  width: "50%",
                  borderRadius: "6px",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              gap: "1rem",
            }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {movies.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "4rem",
                color: "var(--text-muted)",
              }}
            >
              <p>No movies found.</p>
            </div>
          )}
        </>
      )}

      {/* Infinite scroll trigger */}
      <div
        ref={loaderRef}
        style={{
          marginTop: "2rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {loading && movies.length > 0 && (
          <div style={{ display: "flex", gap: "6px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        padding: "0.55rem 1rem",
        borderRadius: "8px",
        fontSize: "0.875rem",
        cursor: "pointer",
        outline: "none",
        minWidth: "140px",
      }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt} style={{ background: "var(--bg-card)" }}>
          {opt}
        </option>
      ))}
    </select>
  );
}
