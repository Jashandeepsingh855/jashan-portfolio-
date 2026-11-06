"use client";

import React, { useEffect, useState } from "react";
import { X, Play, Film, ExternalLink } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  client?: string;
  description?: string;
  videoUrl: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  title,
  category,
  client,
  description,
  videoUrl,
}: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper to extract embed url for YouTube or Vimeo
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // YouTube watch or short URL
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`;
    }

    // Direct video file (mp4, webm) or generic embed
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectVideo = embedUrl.endsWith(".mp4") || embedUrl.endsWith(".webm") || embedUrl.includes("/uploads/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-surface-dark border border-border-dark rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Modal Header HUD */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-dark/95 border-b border-white/10 font-mono text-xs uppercase tracking-wider text-white/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></span>
            <span className="font-bold text-white text-sm tracking-tight">{title}</span>
            {client && (
              <>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="text-white/70 hidden sm:inline">CLIENT: {client}</span>
              </>
            )}
            {category && (
              <span className="hidden md:inline px-2 py-0.5 rounded bg-white/10 text-[10px] text-accent">
                {category}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-accent text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-white/50 p-8 text-center font-mono text-sm">
              <Film className="w-12 h-12 mb-3 text-accent" />
              <p>No video URL provided for this project.</p>
              <p className="text-xs text-white/30 mt-1">Add a video URL in the Admin Portal.</p>
            </div>
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="p-6 bg-[#0E1420] border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex-1">
            <div className="text-white font-semibold text-sm mb-1">{title}</div>
            {description && <p className="text-white/60 font-sans text-xs leading-relaxed max-w-2xl">{description}</p>}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {videoUrl && (
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
              </a>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-accent text-white font-mono font-semibold text-xs hover:bg-accent/90 transition-colors"
            >
              CLOSE CUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
