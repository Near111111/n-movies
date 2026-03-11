export interface Movie {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate?: string;
  type: 'Movie' | 'TV Series';
  rating?: number;
  genres?: string[];
  description?: string;
  duration?: string;
  country?: string;
  production?: string;
  casts?: string[];
  tags?: string[];
  totalEpisodes?: number;
  seasons?: Season[];
  episodes?: Episode[];
}

export interface Season {
  season: number;
  image?: string;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  season?: number;
  url?: string;
}

export interface SearchResult {
  currentPage: number;
  hasNextPage: boolean;
  results: Movie[];
}

export interface StreamSource {
  url: string;
  quality?: string;
  isM3U8: boolean;
}

export interface StreamData {
  sources: StreamSource[];
  subtitles?: { url: string; lang: string }[];
  intro?: { start: number; end: number };
}
