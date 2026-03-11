import { getTrendingMovies } from "@/lib/api";
import HeroBanner from "@/components/HeroBanner";
import MovieGrid from "@/components/MovieGrid";
import InfiniteMovieGrid from "@/components/InfiniteMovieGrid";

export const revalidate = 300;

export default async function HomePage() {
  let trending: Awaited<ReturnType<typeof getTrendingMovies>> = [];

  try {
    trending = await getTrendingMovies();
  } catch {
    // API unavailable
  }

  return (
    <div>
      {/* Auto-rotating hero */}
      <HeroBanner movies={trending} />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 1.5rem 4rem",
        }}
      >
        {/* Trending row — static sa taas */}
        {trending.length > 0 && (
          <MovieGrid movies={trending} title="Trending Now" />
        )}

        {/* Divider */}
        <div
          style={{ borderTop: "1px solid var(--border)", margin: "2rem 0" }}
        />

        {/* Infinite scroll movie suggestions sa baba */}
        <InfiniteMovieGrid />
      </div>
    </div>
  );
}
