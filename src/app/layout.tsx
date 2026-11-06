import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jashandeep Singh — Modern Cinematic Portfolio & Director's Cut",
  description: "Crafting high-velocity commercial cuts, documentary narratives, and cultural stories with surgical rhythm, emotional depth, and cinematic punch.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-surface text-on-surface antialiased selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
