import { Movie, SearchResult, StreamData } from '@/types/movie';

const BASE_URL = process.env.NEXT_PUBLIC_CONSUMET_API_URL || 'https://api.consumet.org';

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function searchMovies(query: string, page = 1): Promise<SearchResult> {
  const data = await fetcher<SearchResult>(
    `${BASE_URL}/movies/flixhq/${encodeURIComponent(query)}?page=${page}`
  );
  return {
    ...data,
    results: data.results.filter((m) => m.type === 'Movie'),
  };
}

export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetcher<{ results: Movie[] }>(
    `${BASE_URL}/movies/flixhq/trending?type=movie`
  );
  return data.results;
}

export async function getRecentMovies(): Promise<Movie[]> {
  const data = await fetcher<{ results: Movie[] }>(
    `${BASE_URL}/movies/flixhq/recent-movies`
  );
  return data.results;
}

export async function getMovieInfo(id: string): Promise<Movie> {
  return fetcher<Movie>(`${BASE_URL}/movies/flixhq/info?id=${encodeURIComponent(id)}`);
}

export async function getMoviesByGenre(genre: string, page = 1): Promise<SearchResult> {
  const data = await fetcher<SearchResult>(
    `${BASE_URL}/movies/flixhq/genre/${encodeURIComponent(genre)}?page=${page}`
  );
  return {
    ...data,
    results: data.results.filter((m) => m.type === 'Movie'),
  };
}

export async function getStreamSources(episodeId: string, mediaId: string): Promise<StreamData> {
  return fetcher<StreamData>(
    `${BASE_URL}/movies/flixhq/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`
  );
}

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western',
];
