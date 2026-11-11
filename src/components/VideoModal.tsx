"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Film, X } from "lucide-react";

export interface VideoModalItem {
  title: string;
  client: string;
  category: string;
  duration: string;
  format?: string;
  videoUrl: string;
  projectUrl?: string;
  thumbnail?: string;
  description?: string;
  tags?: string[];
  views?: string;
}

interface VideoModalProps {
  video: VideoModalItem | null;
  onClose: () => void;
}

function getEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;

  try {
    const parsed = new URL(rawUrl);

    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      let videoId = "";
      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1).split("/")[0];
      } else if (parsed.pathname.includes("/shorts/")) {
        videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0] || "";
      } else if (parsed.pathname.includes("/embed/")) {
        videoId = parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
      } else {
        videoId = parsed.searchParams.get("v") || "";
      }

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const id = segments[segments.length - 1];
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!video) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

  const embedUrl = video ? getEmbedUrl(video.videoUrl) : null;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-3xl bg-[#0b0b0e] border border-white/15 overflow-hidden shadow-2xl"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <Film className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-white truncate">
                    {video.title}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400 truncate">
                    {video.client} · {video.category} · {video.duration}
                    {video.format ? ` · ${video.format}` : ""}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close cinema player"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Player Frame */}
            <div className="relative bg-black aspect-video w-full">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <video
                  src={video.videoUrl}
                  poster={video.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>

            {/* Footer Info */}
            {(video.description ||
              (video.tags && video.tags.length > 0) ||
              video.projectUrl) && (
              <div className="px-5 sm:px-6 py-4 bg-[#0f0f13] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {video.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                    {video.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {(video.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="bg-white/10 border border-white/15 text-[11px] font-mono text-zinc-200 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {video.views && (
                    <span className="text-xs font-mono text-accentGreen font-semibold ml-1">
                      {video.views}
                    </span>
                  )}
                  {video.projectUrl && (
                    <a
                      href={video.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-black text-[11px] font-semibold hover:bg-zinc-200 transition-colors ml-1"
                    >
                      <span>Project Link</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
