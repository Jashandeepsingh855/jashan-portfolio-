import ClientPortfolio from "@/components/ClientPortfolio";
import { getPublicContent } from "@/lib/data";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.jashandeepsingh.work" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.jashandeepsingh.work/#person",
      name: "Jashandeep Singh",
      jobTitle: "Video Editor",
      url: "https://www.jashandeepsingh.work",
      knowsAbout: [
        "Video Editing",
        "DaVinci Resolve",
        "Colour Grading",
        "Commercial Video Production",
        "Short-Form Video",
        "Post Production",
        "ACES Colour Science",
        "Motion Graphics",
      ],
      sameAs: [
        "https://www.jashandeepsingh.work",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://www.jashandeepsingh.work/#service",
      name: "Jashandeep Singh — Video Editing Services",
      description:
        "High-retention video editing, commercial cuts, DaVinci Resolve colour grading, and short-form content creation for brands and creators worldwide.",
      url: "https://www.jashandeepsingh.work",
      provider: { "@id": "https://www.jashandeepsingh.work/#person" },
      areaServed: "Worldwide",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Video Editing Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Video Editing" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "YouTube & Short-Form Editing" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "DaVinci Resolve Colour Grading" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motion Graphics & VFX" } },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.jashandeepsingh.work/#website",
      url: "https://www.jashandeepsingh.work",
      name: "Jashandeep Singh — Video Editor",
      description:
        "Portfolio of Jashandeep Singh, a high-retention video editor specialising in DaVinci Resolve, commercial cuts, and short-form content.",
      publisher: { "@id": "https://www.jashandeepsingh.work/#person" },
    },
  ],
};

// XSS-safe serialisation: escape < so the JSON is safe inside a <script> tag
const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default async function HomePage() {
  const initialContent = await getPublicContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <ClientPortfolio initialContent={initialContent} />
    </>
  );
}
