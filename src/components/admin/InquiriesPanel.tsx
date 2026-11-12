"use client";

import { useState } from "react";
import { Mail, MessageSquare, Trash2 } from "lucide-react";
import type { Inquiry, InquiryStatus } from "@/lib/data";

interface InquiriesPanelProps {
  inquiries: Inquiry[];
  onInquiriesChange: (inquiries: Inquiry[]) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}

const STATUS_BADGE: Record<InquiryStatus, string> = {
  new: "bg-emerald-50 text-emerald-700 border-emerald-200",
  reviewing: "bg-sky-50 text-sky-700 border-sky-200",
  replied: "bg-neutral-100 text-neutral-800 border-neutral-300",
  archived: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export default function InquiriesPanel({
  inquiries,
  onInquiriesChange,
  onNotify,
}: InquiriesPanelProps) {
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");

  const filtered =
    filter === "all"
      ? inquiries
      : inquiries.filter((inq) => inq.status === filter);

  const handleStatusChange = async (id: string, status: InquiryStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      onInquiriesChange(
        inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      onNotify("success", `Marked inquiry as "${status}".`);
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "Could not update inquiry."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this client inquiry permanently?")) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete inquiry");

      onInquiriesChange(inquiries.filter((inq) => inq.id !== id));
      onNotify("success", "Inquiry deleted.");
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "Could not delete inquiry."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-1">
            CLIENT LEADS INBOX
          </p>
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-neutral-950">
            Client Inquiries ({inquiries.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Leads submitted through your public portfolio contact form.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["all", "new", "reviewing", "replied", "archived"] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase transition-colors ${
                  filter === st
                    ? "bg-[#111111] text-white font-semibold"
                    : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200/70"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 p-10 text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto" />
          <p className="text-sm font-semibold text-neutral-700">
            No inquiries matching this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="rounded-3xl bg-white border border-neutral-200 p-5 sm:p-6 space-y-4 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-neutral-950">
                      {inq.name}
                    </h4>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                        STATUS_BADGE[inq.status]
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {new Date(inq.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500">
                    <a
                      href={`mailto:${inq.email}`}
                      className="inline-flex items-center gap-1 hover:text-black"
                    >
                      <Mail className="w-3 h-3" />
                      {inq.email}
                    </a>
                    <span>· {inq.projectType}</span>
                    <span>· {inq.budget}</span>
                    {inq.timeline && <span>· {inq.timeline}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={inq.status}
                    aria-label={`Status for inquiry from ${inq.name}`}
                    onChange={(e) =>
                      handleStatusChange(
                        inq.id,
                        e.target.value as InquiryStatus
                      )
                    }
                    className="rounded-xl bg-[#FAFAFB] border border-neutral-200 px-3 py-1.5 text-xs font-mono text-neutral-900 focus:outline-none focus:border-black"
                  >
                    <option value="new">new</option>
                    <option value="reviewing">reviewing</option>
                    <option value="replied">replied</option>
                    <option value="archived">archived</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleDelete(inq.id)}
                    title="Delete Inquiry"
                    aria-label={`Delete inquiry from ${inq.name}`}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed bg-[#FAFAFB] border border-neutral-200/70 rounded-2xl p-4">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
