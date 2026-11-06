import { getPublicContent } from "@/lib/data";
import ClientPortfolio from "@/components/ClientPortfolio";

// Revalidate frequently or dynamic so changes in admin portal reflect immediately
export default function HomePage() {
  const content = getPublicContent();

  return <ClientPortfolio initialContent={content as any} />;
}
