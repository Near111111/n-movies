import Link from "next/link";
import { getTrendingMovies, getRecentMovies } from "@/lib/api";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";

export const revalidate = 300;

export default async function HomePage() {
  let trending: Movie[] = [];
  let recent: Movie[] = [];

  try {
    const results = await Promise.allSettled([
      getTrendingMovies(),
      getRecentMovies(),
    ]);
    if (results[0].status === "fulfilled") trending = results[0].value ?? [];
    if (results[1].status === "fulfilled") recent = results[1].value ?? [];
  } catch {
    // API may be unavailable
  }

  const hero = trending && trending.length > 0 ? trending[0] : null;

  return (
    <div>
      {hero && (
        <div
          style={{
            position: "relative",
            height: "75vh",
            minHeight: "500px",
            overflow: "hidden",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${hero.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              filter: "blur(2px) brightness(0.45)",
              transform: "scale(1.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(10,10,15,0.95) 40%, rgba(10,10,15,0.2) 100%), linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 50%)",
            }}
          />
          <div
            style={{
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "3rem 1.5rem",
              maxWidth: "700px",
            }}
          >
            <div className="fade-up">
              <span className="badge" style={{ marginBottom: "1rem" }}>
                🎬 Featured
              </span>
            </div>
            <h1
              className="fade-up fade-up-delay-1"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                margin: "0 0 1rem",
                letterSpacing: "-0.5px",
              }}
            >
              {hero.title}
            </h1>
            {hero.releaseDate && (
              <p
                className="fade-up fade-up-delay-2"
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  marginBottom: "1.5rem",
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span>📅 {hero.releaseDate}</span>
                {hero.rating && hero.rating > 0 && (
                  <span>⭐ {hero.rating}</span>
                )}
              </p>
            )}
            <div
              className="fade-up fade-up-delay-3"
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <Link href={`/movies/${encodeURIComponent(hero.id)}`}>
                <button
                  className="btn-primary"
                  style={{
                    fontSize: "1rem",
                    padding: "0.75rem 2rem",
                    borderRadius: "10px",
                  }}
                >
                  ▶ Watch Now
                </button>
              </Link>
              <Link href={`/movies/${encodeURIComponent(hero.id)}`}>
                <button
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "var(--text-primary)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "0.75rem 2rem",
                    borderRadius: "10px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ℹ More Info
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {trending && trending.length > 0 && (
          <MovieGrid movies={trending} title="Trending Movies" />
        )}
        {recent && recent.length > 0 && (
          <MovieGrid movies={recent} title="Recently Added" />
        )}
        {(!trending || trending.length === 0) &&
          (!recent || recent.length === 0) && <EmptyState />}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "6rem 1rem",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎬</div>
      <h2 style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
        Could not load movies
      </h2>
      <p style={{ fontSize: "0.9rem" }}>
        Make sure your Consumet API server is running and{" "}
        <code
          style={{
            color: "var(--accent)",
            background: "var(--bg-card)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          NEXT_PUBLIC_CONSUMET_API_URL
        </code>{" "}
        is set correctly in .env.local
      </p>
      <Link
        href="/movies"
        style={{
          color: "var(--accent)",
          marginTop: "1rem",
          display: "inline-block",
        }}
      >
        Browse All Movies →
      </Link>
    </div>
  );
}
