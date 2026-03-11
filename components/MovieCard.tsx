"use client";
import Link from "next/link";
import { Movie } from "@/types/movie";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const encodedId = encodeURIComponent(movie.id);

  return (
    <Link
      href={`/movies/${encodedId}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="movie-card"
        style={{
          background: "var(--bg-card)",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            position: "relative",
            paddingBottom: "145%",
            background: "#0d0d14",
          }}
        >
          {movie.image ? (
            <img
              src={movie.image}
              alt={movie.title}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/300x430/16161f/6c63ff?text=${encodeURIComponent(movie.title.slice(0, 10))}`;
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              {movie.title}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--gradient-overlay)",
              opacity: 0,
              transition: "opacity 0.25s",
            }}
            className="card-overlay"
          />
        </div>

        <div style={{ padding: "0.75rem" }}>
          <h3
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              margin: 0,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.title}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "5px",
              fontSize: "0.775rem",
              color: "var(--text-secondary)",
            }}
          >
            {movie.releaseDate && (
              <span
                style={{ display: "flex", alignItems: "center", gap: "3px" }}
              >
                <CalIcon />
                {movie.releaseDate}
              </span>
            )}
            {movie.rating && movie.rating > 0 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                  color: "var(--star)",
                }}
              >
                <StarIcon />
                {movie.rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
