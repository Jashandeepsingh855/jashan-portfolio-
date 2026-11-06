"use client";

import React, { useState } from "react";
import { SiteContent, Project } from "@/lib/data";
import Header from "./Header";
import Hero from "./Hero";
import WorkSection from "./WorkSection";
import ServicesSection from "./ServicesSection";
import AboutSection from "./AboutSection";
import ProcessSection from "./ProcessSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import VideoModal from "./VideoModal";

interface ClientPortfolioProps {
  initialContent: SiteContent;
}

export default function ClientPortfolio({ initialContent }: ClientPortfolioProps) {
  const [content] = useState<SiteContent>(initialContent);
  const [activeVideo, setActiveVideo] = useState<{
    isOpen: boolean;
    title: string;
    category?: string;
    client?: string;
    description?: string;
    videoUrl: string;
  }>({
    isOpen: false,
    title: "",
    category: "",
    client: "",
    description: "",
    videoUrl: "",
  });

  const handleOpenShowreel = () => {
    setActiveVideo({
      isOpen: true,
      title: content.hero.showreelTitle || "2025 SHOWREEL // SELECTED WORKS",
      category: "MASTER SHOWREEL",
      client: "DIRECTOR'S CUT",
      description: content.hero.description,
      videoUrl: content.hero.showreelVideoUrl,
    });
  };

  const handleOpenProject = (project: Project) => {
    setActiveVideo({
      isOpen: true,
      title: project.title,
      category: project.category,
      client: project.client,
      description: project.description,
      videoUrl: project.videoUrl,
    });
  };

  const handleCloseVideo = () => {
    setActiveVideo((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-accent selection:text-white">
      {/* Navigation Header */}
      <Header
        name={content.siteSettings.name}
        role={content.siteSettings.role}
        year={content.siteSettings.year}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          siteSettings={content.siteSettings}
          hero={content.hero}
          onPlayShowreel={handleOpenShowreel}
        />

        {/* My Work Section */}
        <WorkSection
          categories={content.categories}
          projects={content.projects}
          onPlayProject={handleOpenProject}
        />

        {/* Capabilities & Services Section */}
        <ServicesSection services={content.services} />

        {/* About & Studio Pipeline Section */}
        <AboutSection
          about={content.about}
          name={content.siteSettings.name}
          location={content.siteSettings.location}
        />

        {/* 5-Stage Process Section */}
        <ProcessSection process={content.process} />

        {/* Testimonials & Reviews Section */}
        <TestimonialsSection testimonials={content.testimonials} />

        {/* Contact & Inquiries Section */}
        <ContactSection
          siteSettings={content.siteSettings}
          services={content.services}
        />
      </main>

      {/* Footer */}
      <Footer
        name={content.siteSettings.name}
        role={content.siteSettings.role}
        year={content.siteSettings.year}
        footerNote={content.siteSettings.footerNote}
      />

      {/* Global Cinematic Video Modal */}
      <VideoModal
        isOpen={activeVideo.isOpen}
        onClose={handleCloseVideo}
        title={activeVideo.title}
        category={activeVideo.category}
        client={activeVideo.client}
        description={activeVideo.description}
        videoUrl={activeVideo.videoUrl}
      />
    </div>
  );
}
