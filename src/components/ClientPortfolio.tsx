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
import { StackedSection } from "./ui/stacked-section";

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
      projectUrl: project.projectUrl,
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

  const hasTestimonials =
    initialContent.testimonials && initialContent.testimonials.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Header
          siteSettings={initialContent.siteSettings}
          projectCount={initialContent.projects.length}
          serviceCount={initialContent.services.length}
        />

        <main className="relative flex-1 w-full bg-background">
          <StackedSection className="z-10" withCurtainShadow={false}>
            <Hero
              hero={initialContent.hero}
              siteSettings={initialContent.siteSettings}
              onPlayShowreel={handlePlayShowreel}
            />
          </StackedSection>

          <StackedSection anchorId="work" className="z-20">
            <WorkSection
              projects={initialContent.projects}
              categories={initialContent.categories}
              sectionContent={initialContent.workSection}
              onSelectProject={handleOpenProject}
            />
          </StackedSection>

          <StackedSection anchorId="services" className="z-30 justify-center">
            <ServicesSection
              services={initialContent.services}
              sectionContent={initialContent.servicesSection}
            />
          </StackedSection>

          <StackedSection anchorId="experience" className="z-40 justify-center">
            <ProcessSection
              process={initialContent.process}
              about={initialContent.about}
              hero={initialContent.hero}
            />
          </StackedSection>

          {hasTestimonials && (
            <StackedSection
              anchorId="testimonials"
              className="z-50 justify-center"
            >
              <TestimonialsSection
                testimonials={initialContent.testimonials}
                sectionContent={initialContent.testimonialsSection}
              />
            </StackedSection>
          )}

          <StackedSection
            anchorId="contact"
            className="z-[60] justify-between"
          >
            <ContactSection
              siteSettings={initialContent.siteSettings}
              sectionContent={initialContent.contactSection}
            />
            <Footer siteSettings={initialContent.siteSettings} />
          </StackedSection>
        </main>

        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </MotionConfig>
  );
}
