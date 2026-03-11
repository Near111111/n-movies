import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CineStream — Watch Movies Free",
  description: "Stream the latest and greatest movies for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main style={{ minHeight: "100vh", paddingTop: "64px" }}>
          {children}
        </main>
        <footer style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
          marginTop: "4rem",
        }}>
          <p>CineStream — For entertainment purposes. We do not host any files.</p>
        </footer>
      </body>
    </html>
  );
}
