import { getMovieInfo, getTrendingMovies } from "@/lib/api";
import { Movie } from "@/types/movie";
import Link from "next/link";
import MovieGrid from "@/components/MovieGrid";
import WatchButton from "@/components/WatchButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  try {
    const { id } = await params;
    const movie = await getMovieInfo(decodeURIComponent(id));
    return { title: `${movie.title} — CineStream` };
  } catch {
    return { title: "Movie — CineStream" };
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  let movie: Movie | null = null;
  let related: Movie[] = [];

  try {
    [movie, related] = await Promise.all([
      getMovieInfo(decodeURIComponent(id)),
      getTrendingMovies(),
    ]);
  } catch {
    return <ErrorState />;
  }

  if (!movie) return <ErrorState />;

  const firstEpisode = movie.episodes?.[0];

  return (
    <div>
      {/* Hero Backdrop */}
      <div style={{ position: "relative", height: "70vh", minHeight: "500px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${movie.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          filter: "blur(3px) brightness(0.35)",
          transform: "scale(1.05)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(10,10,15,0.97) 35%, rgba(10,10,15,0.3) 80%), linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 60%)",
        }} />

        {/* Content row */}
        <div style={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          padding: "2rem max(1.5rem, calc((100% - 1400px) / 2 + 1.5rem))",
          gap: "2.5rem",
        }}>
          {/* Poster */}
          <div style={{
            flexShrink: 0,
            width: "180px",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            border: "1px solid var(--border)",
            alignSelf: "flex-end",
          }}>
            <img src={movie.image} alt={movie.title} style={{ width: "100%", display: "block" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingBottom: "0.5rem" }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 0.75rem", letterSpacing: "-0.5px" }}>
              {movie.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {movie.releaseDate && <span>📅 {movie.releaseDate}</span>}
              {movie.rating && movie.rating > 0 && <span style={{ color: "var(--star)" }}>⭐ {movie.rating}</span>}
              {movie.duration && <span>⏱ {movie.duration}</span>}
              {movie.country && <span>🌍 {movie.country}</span>}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1rem" }}>
                {movie.genres.map((g) => (
                  <span key={g} className="badge">{g}</span>
                ))}
              </div>
            )}

            {/* Description */}
            {movie.description && (
              <p style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.65,
                maxWidth: "600px",
                marginBottom: "1.5rem",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {movie.description}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {firstEpisode && (
                <WatchButton episodeId={firstEpisode.id} mediaId={movie.id} movieTitle={movie.title} />
              )}
              {!firstEpisode && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No episodes available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full Details */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Description full */}
        {movie.description && (
          <div style={{ marginBottom: "2.5rem", maxWidth: "800px" }}>
            <SectionTitle>Synopsis</SectionTitle>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: "0.95rem" }}>
              {movie.description}
            </p>
          </div>
        )}

        {/* Cast */}
        {movie.casts && movie.casts.length > 0 && (
          <div style={{ marginBottom: "2.5rem" }}>
            <SectionTitle>Cast</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {movie.casts.map((c) => (
                <span key={c} style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  padding: "5px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <MovieGrid movies={related.slice(0, 12)} title="More Movies" />
        )}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: "1.1rem",
      fontWeight: 700,
      marginBottom: "0.75rem",
      color: "var(--text-primary)",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}>
      <span style={{ width: "3px", height: "1.1rem", background: "var(--accent)", borderRadius: "2px", display: "inline-block" }} />
      {children}
    </h2>
  );
}

function ErrorState() {
  return (
    <div style={{ textAlign: "center", padding: "8rem 1rem", color: "var(--text-muted)" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
      <h2 style={{ color: "var(--text-secondary)" }}>Movie not found</h2>
      <Link href="/movies" style={{ color: "var(--accent)", marginTop: "1rem", display: "inline-block" }}>
        ← Back to Movies
      </Link>
    </div>
  );
}
