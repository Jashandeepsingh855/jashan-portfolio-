"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import type { Project, PublicSiteContent } from "@/lib/data";
import Header from "./Header";
import Hero from "./Hero";
import WorkSection from "./WorkSection";
import ServicesSection from "./ServicesSection";
import ProcessSection from "./ProcessSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import VideoModal, { type VideoModalItem } from "./VideoModal";

interface ClientPortfolioProps {
  initialContent: PublicSiteContent;
}

export default function ClientPortfolio({
  initialContent,
}: ClientPortfolioProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoModalItem | null>(
    null
  );

  const handleOpenProject = (project: Project) => {
    setSelectedVideo({
      title: project.title,
      client: project.client,
      category: project.category,
      duration: project.duration,
      format: project.format,
      videoUrl: project.videoUrl,
      thumbnail: project.thumbnail,
      description: project.description,
      tags: project.tags,
      views: project.views,
    });
  };

  const handlePlayShowreel = () => {
    setSelectedVideo({
      title: initialContent.hero.showreelTitle || "Official Showreel",
      client: initialContent.siteSettings.name,
      category: "MASTER SHOWREEL",
      duration: initialContent.hero.showreelTc || "02:48",
      format: initialContent.hero.showreelFormat || "4K PRORES",
      videoUrl: initialContent.hero.showreelVideoUrl,
      thumbnail: initialContent.hero.showreelCoverImage,
      description: initialContent.hero.description,
      tags: initialContent.hero.hardwarePipeline.slice(0, 3),
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full overflow-x-clip bg-[#050505] text-[#f4f4f5] flex flex-col">
        <Header
          siteSettings={initialContent.siteSettings}
          projectCount={initialContent.projects.length}
          serviceCount={initialContent.services.length}
        />

        <main className="flex-1">
          <Hero
            hero={initialContent.hero}
            siteSettings={initialContent.siteSettings}
            onPlayShowreel={handlePlayShowreel}
          />

          <WorkSection
            projects={initialContent.projects}
            categories={initialContent.categories}
            onSelectProject={handleOpenProject}
          />

          <ServicesSection services={initialContent.services} />

          <ProcessSection
            process={initialContent.process}
            about={initialContent.about}
            hero={initialContent.hero}
          />

          <TestimonialsSection testimonials={initialContent.testimonials} />

          <ContactSection siteSettings={initialContent.siteSettings} />
        </main>

        <Footer siteSettings={initialContent.siteSettings} />

        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </MotionConfig>
  );
}
