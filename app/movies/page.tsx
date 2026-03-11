"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Movie } from "@/types/movie";
import MovieGrid from "@/components/MovieGrid";
import { GENRES } from "@/lib/api";

const YEARS = [
  "All Years",
  ...Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i)),
];
const SORT_OPTIONS = ["Most Popular", "Latest", "Top Rated"];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("All Genres");
  const [year, setYear] = useState("All Years");
  const [sort, setSort] = useState("Most Popular");
  const [heroIndex, setHeroIndex] = useState(0);

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

      const more = data.hasNextPage ?? true;
      const nextPage = fetchPage + 1;

      hasMoreRef.current = more;
      pageRef.current = nextPage;

      if (reset) {
        setMovies(results);
        setHeroIndex(0);
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

  // Auto-rotate hero every 3 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 10));
    }, 3000);
    return () => clearInterval(interval);
  }, [movies.length]);

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

  const heroMovie = movies[heroIndex] || null;

  return (
    <div>
      {/* Page Hero */}
      <div
        style={{
          position: "relative",
          height: "380px",
          overflow: "hidden",
          marginBottom: "0",
        }}
      >
        {movies.slice(0, 10).map((m, i) => (
          <div
            key={m.id}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${m.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(6px) brightness(0.35)",
              transform: "scale(1.1)",
              opacity: i === heroIndex ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,1))",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 max(1.5rem, calc((100% - 1400px) / 2 + 1.5rem))",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-1px",
              margin: 0,
            }}
            className="gradient-text"
          >
            Movies
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "0.5rem",
              fontSize: "1rem",
            }}
          >
            Explore our collection of the latest and greatest films.
          </p>

          {/* Dots */}
          {movies.length > 0 && (
            <div style={{ display: "flex", gap: "6px", marginTop: "1rem" }}>
              {movies.slice(0, 10).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  style={{
                    width: i === heroIndex ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      i === heroIndex
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.3)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem 3rem",
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "2rem",
            paddingTop: "1.5rem",
          }}
        >
          <Select
            value={genre}
            onChange={setGenre}
            options={["All Genres", ...GENRES]}
          />
          <Select value={year} onChange={setYear} options={YEARS} />
          <Select value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>

        {/* Skeletons */}
        {loading && movies.length === 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
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
            <MovieGrid movies={movies} />

            {movies.length === 0 && !loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "var(--text-muted)",
                }}
              >
                <p>No movies found for this filter.</p>
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
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
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
