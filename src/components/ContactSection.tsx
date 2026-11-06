"use client";

import React, { useState } from "react";
import { ArrowUpRight, Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface ContactSectionProps {
  siteSettings: {
    email: string;
    phone: string;
    location: string;
    calendarLink: string;
    socials: {
      instagram?: string;
      youtube?: string;
      vimeo?: string;
      linkedin?: string;
      x?: string;
      behance?: string;
    };
  };
  services: { title: string }[];
}

export default function ContactSection({ siteSettings, services }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: services[0]?.title || "Commercial Video Editing",
    budget: "$5,000 - $10,000",
    timeline: "Within 1 month",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSuccessMessage(data.message || "Message delivered successfully!");
      setFormData({
        name: "",
        email: "",
        projectType: services[0]?.title || "Commercial Video Editing",
        budget: "$5,000 - $10,000",
        timeline: "Within 1 month",
        message: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-surface py-24" id="contact">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                06 / START A PROJECT
              </div>

              <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight mb-6">
                Have something worth showing? Let&apos;s make it happen.
              </h2>

              <p className="text-base text-on-surface-muted mb-8 leading-relaxed">
                Currently accepting projects for Q2 &amp; Q3. Whether you have 200 hours of documentary rushes or a high-concept commercial treatment, let&apos;s build an edit that resonates.
              </p>

              {/* Direct Channels */}
              <div className="space-y-3">
                <div className="bg-surface-pure p-4 rounded-2xl border border-border-subtle hover:border-accent/40 transition-colors">
                  <span className="font-mono text-[11px] uppercase text-on-surface-muted block mb-1">
                    DIRECT EMAIL
                  </span>
                  <a
                    href={`mailto:${siteSettings.email || "contact@jashandeepsingh.film"}`}
                    className="text-lg text-on-surface hover:text-accent font-bold transition-colors inline-flex items-center gap-1"
                  >
                    {siteSettings.email || "contact@jashandeepsingh.film"}
                    <ArrowUpRight className="w-4 h-4 text-accent" />
                  </a>
                </div>

                {siteSettings.phone && (
                  <div className="bg-surface-pure p-4 rounded-2xl border border-border-subtle hover:border-accent/40 transition-colors">
                    <span className="font-mono text-[11px] uppercase text-on-surface-muted block mb-1">
                      DIRECT LINE
                    </span>
                    <a
                      href={`tel:${siteSettings.phone}`}
                      className="text-lg text-on-surface hover:text-accent font-bold transition-colors inline-flex items-center gap-1"
                    >
                      {siteSettings.phone}
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    </a>
                  </div>
                )}

                <div className="bg-surface-pure p-4 rounded-2xl border border-border-subtle">
                  <span className="font-mono text-[11px] uppercase text-on-surface-muted block mb-1">
                    STUDIO BASE &amp; TIMEZONE
                  </span>
                  <span className="text-base text-on-surface font-semibold block">
                    {siteSettings.location || "Global Remote // Based in Vancouver & Toronto"}
                  </span>
                </div>

                {siteSettings.calendarLink && (
                  <div className="bg-surface-pure p-4 rounded-2xl border border-border-subtle hover:border-accent/40 transition-colors">
                    <span className="font-mono text-[11px] uppercase text-on-surface-muted block mb-1">
                      DIRECT VIDEO DISCOVERY CALL
                    </span>
                    <a
                      href={siteSettings.calendarLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-base text-accent hover:text-on-surface font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book a 20-Min Edit Discovery Call ↗</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="pt-8 mt-8 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-muted block mb-3">
                DIRECT SOCIAL CHANNELS
              </span>
              <div className="flex flex-wrap gap-2 font-mono text-xs uppercase">
                {Object.entries(siteSettings.socials || {}).map(([key, url]) => {
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-surface-pure border border-border-subtle hover:border-accent hover:text-accent font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <span>{key}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-surface-pure p-8 sm:p-10 rounded-3xl border border-border-subtle shadow-lg">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-border-subtle">
                <span className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  COMMISSION BRIEF // FORM 01-A
                </span>
                <span className="font-mono text-[11px] text-on-surface-muted uppercase">
                  RESPONSE TIME: &lt; 24 HRS
                </span>
              </div>

              {successMessage ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold uppercase text-emerald-900 mb-2">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-emerald-700 max-w-md mx-auto mb-6">
                    {successMessage}
                  </p>
                  <button
                    onClick={() => setSuccessMessage("")}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-mono text-xs uppercase font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Marcus Vogel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="marcus@vogelstudio.nyc"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                        Service Focus
                      </label>
                      <select
                        value={formData.projectType}
                        onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                      >
                        {services.map((s, idx) => (
                          <option key={idx} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="Full Campaign Post">Full Campaign Post</option>
                        <option value="Other / Retainer">Other / Retainer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                        Target Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                      >
                        <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000+">$25,000+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                        Delivery Horizon
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                      >
                        <option value="Rush (Next 1-2 weeks)">Rush (Next 1-2 weeks)</option>
                        <option value="Within 1 month">Within 1 month</option>
                        <option value="Within 2-3 months">Within 2-3 months</option>
                        <option value="Flexible / Q3-Q4">Flexible / Q3-Q4</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-on-surface-muted mb-2 font-semibold">
                      Project Overview &amp; Footage Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share a brief overview of the project, raw footage volume, cameras used (e.g. ARRI Alexa, RED, Sony FX3), references or moodboard links..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border-subtle text-on-surface focus:outline-none focus:border-accent transition-colors font-sans text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-surface-dark hover:bg-accent text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md hover:shadow-xl hover:shadow-accent/25 flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{loading ? "TRANSMITTING BRIEF..." : "SEND PROJECT INQUIRY"}</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
