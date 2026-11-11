"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Mail, Send } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

interface ContactSectionProps {
  siteSettings: SiteSettings;
}

export default function ContactSection({ siteSettings }: ContactSectionProps) {
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
      id="contact"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-gradient-to-b from-[#070709] via-[#0b0b0e] to-black overflow-hidden"
    >
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[min(650px,90vw)] h-[320px] bg-zinc-700/10 blur-[130px] rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-b from-[#141418] to-[#0b0b0e] border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-8"
        >
          {/* Availability Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2.5 glass-pill px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-accentGreen" />
              <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 uppercase tracking-wide">
                {siteSettings.availabilitySubtext ||
                  siteSettings.availabilityStatus}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight uppercase">
              HAVE A PROJECT IN MIND?
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Send your footage scope, target release window, and creative
              references. Every inquiry routes directly into the studio tracker.
            </p>
          </div>

          {status === "success" ? (
            <div className="rounded-2xl bg-accentGreen/10 border border-accentGreen/30 p-8 text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-accentGreen mx-auto" />
              <h3 className="text-xl font-bold text-white">
                Brief Logged Successfully
              </h3>
              <p className="text-sm text-zinc-300 max-w-md mx-auto">
                Thank you for reaching out. {siteSettings.name} reviews new
                production briefs personally and responds within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
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
                    className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
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
                    className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="contact-type"
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
                  >
                    Format
                  </label>
                  <select
                    id="contact-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
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
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
                  >
                    Estimated Budget
                  </label>
                  <select
                    id="contact-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
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
                    className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
                  >
                    Target Turnaround
                  </label>
                  <select
                    id="contact-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
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
                  className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5"
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
                  className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>

              {status === "error" && (
                <p className="text-xs font-mono text-red-400">{errorMessage}</p>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400">
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-white transition-colors font-mono"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{siteSettings.email}</span>
                  </a>
                  {siteSettings.calendarLink && (
                    <a
                      href={siteSettings.calendarLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors font-mono"
                    >
                      <span>Book 15m Sync</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors disabled:opacity-60"
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
      </div>
    </section>
  );
}
