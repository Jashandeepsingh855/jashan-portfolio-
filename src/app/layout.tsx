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
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#050505] text-[#f4f4f5] font-sans antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
