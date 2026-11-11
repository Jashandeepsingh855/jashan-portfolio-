import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jashandeep Singh — Cinematic Video Editor & Colorist",
  description:
    "High-retention video editor, commercial storyteller, and ACES colorist helping brands and global creators turn raw footage into cinema.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen w-full bg-background font-sans text-[#121212] antialiased selection:bg-[#111111] selection:text-white">
        {children}
      </body>
    </html>
  );
}
