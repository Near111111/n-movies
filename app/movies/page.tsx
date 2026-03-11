"use client";
import { useState, useEffect, useCallback } from "react";
import { Movie } from "@/types/movie";
import MovieGrid from "@/components/MovieGrid";
import { GENRES } from "@/lib/api";

const YEARS = ["All Years", ...Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))];
const SORT_OPTIONS = ["Most Popular", "Latest", "Top Rated"];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState("All Genres");
  const [year, setYear] = useState("All Years");
  const [sort, setSort] = useState("Most Popular");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);

  const fetchMovies = useCallback(async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      let url = `/api/movies?page=${currentPage}`;
      if (genre !== "All Genres") url += `&genre=${encodeURIComponent(genre)}`;

      const res = await fetch(url);
      const data = await res.json();
      let results: Movie[] = data.results || [];

      // Client-side year filter
      if (year !== "All Years") {
        results = results.filter((m) => m.releaseDate?.includes(year));
      }

      // Client-side sort
      if (sort === "Top Rated") {
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sort === "Latest") {
        results.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
      }

      if (reset) {
        setMovies(results);
        setPage(1);
        if (results.length > 0) setHeroMovie(results[0]);
      } else {
        setMovies((prev) => [...prev, ...results]);
      }
      setHasMore(data.hasNextPage || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [genre, year, sort, page]);

  useEffect(() => {
    fetchMovies(true);
  }, [genre, year, sort]);

  const loadMore = () => {
    setPage((p) => p + 1);
    fetchMovies(false);
  };

  return (
    <div>
      {/* Page Hero */}
      <div style={{
        position: "relative",
        height: "380px",
        overflow: "hidden",
        marginBottom: "0",
      }}>
        {heroMovie?.image && (
          <>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${heroMovie.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(6px) brightness(0.3)",
              transform: "scale(1.1)",
            }} />
          </>
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(10,10,15,0.3), rgba(10,10,15,1))",
        }} />
        <div style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 max(1.5rem, calc((100% - 1400px) / 2 + 1.5rem))",
        }}>
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 800,
            letterSpacing: "-1px",
            margin: 0,
          }} className="gradient-text">
            Movies
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1rem" }}>
            Explore our collection of the latest and greatest films.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 1.5rem 3rem",
      }}>
        {/* Filters */}
        <div style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "2rem",
          paddingTop: "1.5rem",
        }}>
          <Select value={genre} onChange={setGenre} options={["All Genres", ...GENRES]} />
          <Select value={year} onChange={setYear} options={YEARS} />
          <Select value={sort} onChange={setSort} options={SORT_OPTIONS} />
        </div>

        {/* Loading Skeletons */}
        {loading && movies.length === 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "1rem",
          }}>
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ paddingBottom: "145%", borderRadius: "12px" }} />
                <div className="skeleton" style={{ height: "14px", marginTop: "8px", width: "80%", borderRadius: "6px" }} />
                <div className="skeleton" style={{ height: "12px", marginTop: "6px", width: "50%", borderRadius: "6px" }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />

            {/* Load More */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  className="btn-primary"
                  onClick={loadMore}
                  disabled={loading}
                  style={{ minWidth: "160px", opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}

            {movies.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                <p>No movies found for this filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Select({ value, onChange, options }: {
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
