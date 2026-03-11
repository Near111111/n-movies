"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StreamData, StreamSource } from "@/types/movie";

function WatchContent() {
  const params = useSearchParams();
  const episodeId = params.get("episodeId") || "";
  const mediaId = params.get("mediaId") || "";
  const title = params.get("title") || "Movie";

  const [stream, setStream] = useState<StreamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSource, setSelectedSource] = useState<StreamSource | null>(null);

  useEffect(() => {
    if (!episodeId || !mediaId) {
      setError("Missing stream parameters.");
      setLoading(false);
      return;
    }

    async function fetchStream() {
      try {
        const res = await fetch(
          `/api/stream?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`
        );
        if (!res.ok) throw new Error("Stream fetch failed");
        const data: StreamData = await res.json();
        setStream(data);

        // Prefer highest quality source
        const sorted = [...(data.sources || [])].sort((a, b) => {
          const qa = qualityRank(a.quality);
          const qb = qualityRank(b.quality);
          return qb - qa;
        });
        if (sorted.length > 0) setSelectedSource(sorted[0]);
      } catch (e) {
        setError("Failed to load stream. The source may be unavailable.");
      } finally {
        setLoading(false);
      }
    }

    fetchStream();
  }, [episodeId, mediaId]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem", display: "flex", gap: "8px", alignItems: "center" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <Link href="/movies" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Movies</Link>
        <span>/</span>
        <span style={{ color: "var(--text-secondary)" }}>{title}</span>
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{title}</h1>

      {/* Player */}
      {loading && (
        <div className="skeleton" style={{ paddingBottom: "56.25%", borderRadius: "14px" }} />
      )}

      {error && (
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid rgba(255,80,80,0.2)",
          borderRadius: "14px",
          padding: "3rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
          <p>{error}</p>
          <Link href={`/movies/${encodeURIComponent(mediaId)}`} style={{ color: "var(--accent)", marginTop: "1rem", display: "inline-block" }}>
            ← Back to movie
          </Link>
        </div>
      )}

      {!loading && !error && selectedSource && (
        <>
          <div className="player-wrapper" style={{ borderRadius: "14px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <video
              key={selectedSource.url}
              controls
              autoPlay
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
              src={selectedSource.isM3U8 ? undefined : selectedSource.url}
            >
              {selectedSource.isM3U8 && (
                <source src={selectedSource.url} type="application/x-mpegURL" />
              )}
              {stream?.subtitles?.map((sub) => (
                <track key={sub.lang} kind="subtitles" src={sub.url} label={sub.lang} />
              ))}
            </video>
          </div>

          {/* Source selector */}
          {stream && stream.sources.length > 1 && (
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>
                Quality / Source:
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {stream.sources.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSource(src)}
                    style={{
                      background: selectedSource?.url === src.url ? "var(--accent)" : "var(--bg-card)",
                      color: selectedSource?.url === src.url ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                      padding: "0.4rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: 500,
                    }}
                  >
                    {src.quality || `Source ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function qualityRank(q?: string): number {
  if (!q) return 0;
  if (q.includes("1080")) return 4;
  if (q.includes("720")) return 3;
  if (q.includes("480")) return 2;
  if (q.includes("360")) return 1;
  return 0;
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading player...</div>}>
      <WatchContent />
    </Suspense>
  );
}
