import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jashandeepsingh.work"),
  title: {
    default: "Jashandeep Singh — Video Editor | DaVinci Resolve & Commercial Cuts",
    template: "%s | Jashandeep Singh — Video Editor",
  },
  description:
    "Jashandeep Singh is a high-retention video editor specialising in DaVinci Resolve, commercial cuts, YouTube short-form content, and creative post-production. Available worldwide.",
  keywords: [
    "Video Editor",
    "DaVinci Resolve Video Editor",
    "High-Retention Video Editing",
    "YouTube Video Editor",
    "Commercial Video Editor",
    "Short-Form Video Editor",
    "Post Production",
    "ACES Colorist",
    "Jashandeep Singh",
    "Cinematic Video Editor",
  ],
  authors: [{ name: "Jashandeep Singh", url: "https://www.jashandeepsingh.work" }],
  creator: "Jashandeep Singh",
  alternates: {
    canonical: "https://www.jashandeepsingh.work",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.jashandeepsingh.work",
    siteName: "Jashandeep Singh — Video Editor",
    title: "Jashandeep Singh — Video Editor | DaVinci Resolve & Commercial Cuts",
    description:
      "High-retention video editor crafting commercial cuts, YouTube content, and cinematic post-production in DaVinci Resolve. Available worldwide.",
    images: [
      {
        url: "/portrait-cutout.png",
        width: 1200,
        height: 630,
        alt: "Jashandeep Singh — Video Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jashandeep Singh — Video Editor | DaVinci Resolve & Commercial Cuts",
    description:
      "High-retention video editor crafting commercial cuts, YouTube content, and cinematic post-production in DaVinci Resolve.",
    images: ["/portrait-cutout.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen w-full max-w-[100vw] overflow-x-clip bg-background font-sans text-[#121212] antialiased selection:bg-[#111111] selection:text-white">
        {children}
      </body>
    </html>
  );
}
