"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, Send } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

interface ContactSectionProps {
  id?: string;
  siteSettings: SiteSettings;
}

export default function ContactSection({
  id,
  siteSettings,
}: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("Commercial");
  const [budget, setBudget] = useState("$2,500 – $5,000");
  const [timeline, setTimeline] = useState("2–3 Weeks");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          projectType,
          budget,
          timeline,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit your inquiry.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to submit project inquiry."
      );
    }
  };

  return (
    <section
      id={id}
      className="w-full pt-24 pb-10 sm:pt-24 sm:pb-12 px-4 sm:px-8 md:px-12 bg-background"
    >
      {/* Floating Light Card matching 5.webp & Jashandeep Stitch */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-b from-[#FAFAFB] to-white border border-neutral-200/90 rounded-[28px] sm:rounded-[32px] p-6 sm:p-12 md:p-14 shadow-xs space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-white border border-neutral-200 px-4 py-1.5 rounded-full shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-accentGreen" />
            <span className="text-xs font-medium text-neutral-800">
              {siteSettings.availabilitySubtext ||
                siteSettings.availabilityStatus}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-neutral-950 tracking-tight uppercase max-w-3xl mx-auto">
            HAVE A PROJECT IN MIND?
          </h2>

          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Together, we can transform raw recordings into high-retention
            cinematic masterworks. Share your footage scope and timeline below.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center space-y-4 max-w-2xl mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-bold text-neutral-950">
              Brief Logged Successfully
            </h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Thank you for reaching out. {siteSettings.name} reviews new
              production briefs personally and responds within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-3xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-xl bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@studio.com"
                  className="w-full rounded-xl bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="contact-type"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Format
                </label>
                <select
                  id="contact-type"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-xl bg-white border border-neutral-200 px-3.5 py-3 text-sm text-neutral-950 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="Commercial">Commercial / Launch Film</option>
                  <option value="Short-Form">Short-Form / Reels Pack</option>
                  <option value="Long-Form">Long-Form / Documentary</option>
                  <option value="Color & Finish">ACES Color Grading</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-budget"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Estimated Budget
                </label>
                <select
                  id="contact-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full rounded-xl bg-white border border-neutral-200 px-3.5 py-3 text-sm text-neutral-950 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="$1,000 – $2,500">$1,000 – $2,500</option>
                  <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                  <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                  <option value="$10,000+">$10,000+ Monthly Retainer</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-timeline"
                  className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
                >
                  Target Turnaround
                </label>
                <select
                  id="contact-timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full rounded-xl bg-white border border-neutral-200 px-3.5 py-3 text-sm text-neutral-950 focus:outline-none focus:border-black transition-colors"
                >
                  <option value="48–72 Hours (Rush)">48–72 Hours (Rush)</option>
                  <option value="1 Week">1 Week</option>
                  <option value="2–3 Weeks">2–3 Weeks</option>
                  <option value="Ongoing Partnership">
                    Ongoing Partnership
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
              >
                Project Brief &amp; Footage Notes *
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about the deliverable count, camera codecs, pacing style, or reference links..."
                className="w-full rounded-xl bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-xs font-mono text-red-600">{errorMessage}</p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500">
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="inline-flex items-center gap-1.5 hover:text-black transition-colors font-mono"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{siteSettings.email}</span>
                </a>
                {siteSettings.calendarLink && (
                  <a
                    href={siteSettings.calendarLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-black transition-colors font-mono"
                  >
                    <span>Book 15m Sync</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-colors shadow-sm disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {status === "submitting"
                    ? "Sending Brief..."
                    : "Dispatch Project Inquiry"}
                </span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
}
