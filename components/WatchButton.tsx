"use client";
import { useRouter } from "next/navigation";

interface Props {
  episodeId: string;
  mediaId: string;
  movieTitle: string;
}

export default function WatchButton({ episodeId, mediaId, movieTitle }: Props) {
  const router = useRouter();

  const handleWatch = () => {
    const params = new URLSearchParams({ episodeId, mediaId, title: movieTitle });
    router.push(`/watch?${params.toString()}`);
  };

  return (
    <button className="btn-primary" onClick={handleWatch} style={{
      fontSize: "1rem",
      padding: "0.75rem 2rem",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}>
      ▶ Watch Now
    </button>
  );
}
