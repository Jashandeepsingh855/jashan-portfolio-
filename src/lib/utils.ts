import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const OPTIMIZABLE_HOSTS = new Set([
  "vlkofzfbfbropigptpee.supabase.co",
  "images.unsplash.com",
]);

/** Keep next/image optimization strictly on local assets and allowlisted remotePatterns. */
export function isOptimizableImageSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const parsed = new URL(src);
    if (!OPTIMIZABLE_HOSTS.has(parsed.hostname)) return false;
    if (
      parsed.hostname === "vlkofzfbfbropigptpee.supabase.co" &&
      !parsed.pathname.startsWith("/storage/v1/object/public/portfolio-media/")
    ) {
      return false;
    }
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}
