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
  new: "bg-accentGreen/15 text-accentGreen border-accentGreen/30",
  reviewing: "bg-sky-500/15 text-sky-300 border-sky-400/30",
  replied: "bg-white/15 text-zinc-200 border-white/25",
  archived: "bg-zinc-800/80 text-zinc-400 border-zinc-700",
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
          <h2 className="text-xl font-bold text-white">
            Client Inquiries ({inquiries.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
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
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-zinc-400 hover:text-white"
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-[#101014] border border-white/10 p-10 text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm font-semibold text-zinc-300">
            No inquiries matching this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl bg-[#101014] border border-white/10 p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-white">
                      {inq.name}
                    </h4>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                        STATUS_BADGE[inq.status]
                      }`}
                    >
                      {inq.status}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">
                      {new Date(inq.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                    <a
                      href={`mailto:${inq.email}`}
                      className="inline-flex items-center gap-1 hover:text-white"
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
                    onChange={(e) =>
                      handleStatusChange(
                        inq.id,
                        e.target.value as InquiryStatus
                      )
                    }
                    className="rounded-xl bg-black/60 border border-white/15 px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-white"
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
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed bg-black/40 border border-white/[0.06] rounded-xl p-3.5">
                {inq.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
