import { Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

interface Props {
  movies: Movie[];
  title?: string;
}

export default function MovieGrid({ movies, title }: Props) {
  if (!movies.length) return null;

  return (
    <section style={{ marginBottom: "3rem" }}>
      {title && (
        <h2 style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          marginBottom: "1.25rem",
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{
            width: "4px",
            height: "1.4rem",
            background: "var(--accent)",
            borderRadius: "2px",
            display: "inline-block",
          }} />
          {title}
        </h2>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
      }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
