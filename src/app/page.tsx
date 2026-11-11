import ClientPortfolio from "@/components/ClientPortfolio";
import { getPublicContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialContent = await getPublicContent();

  return <ClientPortfolio initialContent={initialContent} />;
}
