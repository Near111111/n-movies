"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: "1.5rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: "1.3rem",
          letterSpacing: "-0.5px",
          textDecoration: "none",
          color: "var(--text-primary)",
          flexShrink: 0,
        }}
      >
        <span style={{ color: "var(--accent)" }}>Cine</span>Stream
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <NavLink href="/movies" active={pathname === "/movies"}>
          Movies
        </NavLink>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            padding: "0.45rem 1rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            width: "220px",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: "0.45rem 1rem" }}
        >
          Search
        </button>
      </form>
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        fontWeight: active ? 600 : 400,
        fontSize: "0.95rem",
        borderBottom: active
          ? "2px solid var(--accent)"
          : "2px solid transparent",
        paddingBottom: "2px",
        transition: "color 0.2s",
      }}
    >
      {children}
    </Link>
  );
}
