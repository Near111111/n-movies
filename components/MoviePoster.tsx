"use client";

interface Props {
  src: string;
  alt: string;
}

export default function MoviePoster({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", display: "block" }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
