"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "@/types/movie";

export default function HeroBanner({ movies }: { movies: Movie[] }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex(next);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      goTo((index + 1) % movies.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [movies.length, index, animating]);

  if (movies.length === 0) return null;

  const hero = movies[index];

  return (
    <div
      style={{
        position: "relative",
        height: "75vh",
        minHeight: "500px",
        overflow: "hidden",
        marginBottom: "3rem",
      }}
    >
      {/* Background Images - crossfade */}
      {movies.slice(0, 10).map((m, i) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${m.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "blur(1px) brightness(0.65)",
            transform: "scale(1.05)",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
          }}
        />
      ))}

      {/* Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(10,10,15,0.9) 35%, rgba(10,10,15,0.1) 100%), linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 60%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "3rem max(1.5rem, calc((100% - 1400px) / 2 + 1.5rem))",
          maxWidth: "700px",
        }}
      >
        <h1
          key={hero.id}
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            margin: "0 0 1rem",
            letterSpacing: "-0.5px",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(10px)" : "translateY(0)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          {hero.title}
        </h1>

        {hero.releaseDate && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              opacity: animating ? 0 : 1,
              transition: "opacity 0.4s ease 0.05s",
            }}
          >
            <span>📅 {hero.releaseDate}</span>
            {hero.rating && hero.rating > 0 && <span>⭐ {hero.rating}</span>}
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            opacity: animating ? 0 : 1,
            transition: "opacity 0.4s ease 0.1s",
          }}
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

        {/* Dots */}
        <div style={{ display: "flex", gap: "6px", marginTop: "1.5rem" }}>
          {movies.slice(0, 10).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === index ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background:
                  i === index ? "var(--accent)" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
