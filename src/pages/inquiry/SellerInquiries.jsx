import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, Send, Loader2, RefreshCw } from "lucide-react";
import inquiryService from "../../services/inquiryService";
import { display, focusRing } from "../../utils/theme";

const MAX_REPLY = 1000;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "Needs reply" },
  { key: "replied", label: "Replied" },
];

const normalizeList = (res) => {
  const data = res?.data?.data || res?.data || res;
  return Array.isArray(data) ? data : [];
};

const sortNewest = (list) =>
  [...list].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getVehicleTitle = (inquiry) => {
  const raw = inquiry.vehicle_id;
  const vehicle = raw && typeof raw === "object" ? raw : null;
  if (vehicle?.make) return `${vehicle.make} ${vehicle.model || ""}`.trim();
  const id = vehicle?._id || (typeof raw === "string" ? raw : null);
  return id ? `Vehicle #${id.slice(-6)}` : "Vehicle no longer listed";
};

const getBuyer = (inquiry) => {
  const raw = inquiry.buyer_id;
  const buyer = raw && typeof raw === "object" ? raw : null;
  if (!buyer) return { name: "Buyer", email: null, phone: null };

  const name =
    [buyer.firstName, buyer.lastName].filter(Boolean).join(" ") ||
    buyer.name ||
    "Buyer";
  return { name, email: buyer.email || null, phone: buyer.phone || null };
};

function InquiryItem({ inquiry, onReply }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const buyer = getBuyer(inquiry);
  const sentDate = formatDate(inquiry.createdAt);
  const hasReply = Boolean(inquiry.reply);

  const handleSend = async (e) => {
    e.preventDefault();
    if (sending) return;

    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write a reply before sending.");
      return;
    }

    setError("");
    setSending(true);
    const ok = await onReply(inquiry._id, trimmed);
    setSending(false);

    if (ok) {
      setOpen(false);
      setText("");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setText("");
    setError("");
  };

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-[#0D1D33] p-4 transition-colors hover:border-[#2DD4BF]/40 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl bg-[#2DD4BF]/10 p-3 text-[#2DD4BF]">
          <MessageCircle size={22} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h3
              className="text-lg font-semibold text-white sm:text-xl"
              style={display}
            >
              {getVehicleTitle(inquiry)}
            </h3>
            <span
              className={`rounded-md px-2.5 py-0.5 text-sm font-medium ${
                hasReply
                  ? "bg-[#2DD4BF]/10 text-[#2DD4BF]"
                  : "bg-amber-300/10 text-amber-300"
              }`}
            >
              {hasReply ? "Replied" : "Needs reply"}
            </span>
          </div>

          <p className="mt-1 text-sm text-[#8EA0B5]">
            From {buyer.name}
            {sentDate && ` · ${sentDate}`}
          </p>
          {(buyer.email || buyer.phone) && (
            <p className="mt-1 flex flex-wrap gap-x-4 text-sm">
              {buyer.email && (
                <a
                  href={`mailto:${buyer.email}`}
                  className={`break-all text-[#C8D3E0] transition-colors hover:text-[#2DD4BF] ${focusRing}`}
                >
                  {buyer.email}
                </a>
              )}
              {buyer.phone && (
                <a
                  href={`tel:${buyer.phone}`}
                  className={`text-[#C8D3E0] transition-colors hover:text-[#2DD4BF] ${focusRing}`}
                >
                  {buyer.phone}
                </a>
              )}
            </p>
          )}

          <p className="mt-4 leading-relaxed text-[#C8D3E0]">
            “{inquiry.message}”
          </p>

          {hasReply && (
            <div className="mt-4 rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/5 p-4">
              <p className="text-sm font-semibold text-[#2DD4BF]">Your reply</p>
              <p className="mt-1 leading-relaxed text-[#C8D3E0]">
                {inquiry.reply}
              </p>
            </div>
          )}

          {!hasReply && !open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2DD4BF] px-5 py-2.5 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              <Send size={16} aria-hidden="true" />
              Reply
            </button>
          )}

          <AnimatePresence>
            {open && (
              <motion.form
                onSubmit={handleSend}
                noValidate
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <label
                    htmlFor={`reply-${inquiry._id}`}
                    className="mb-2 block text-sm font-medium text-white"
                  >
                    Your reply to {buyer.name}
                  </label>
                  <textarea
                    id={`reply-${inquiry._id}`}
                    autoFocus
                    rows={4}
                    maxLength={MAX_REPLY}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Answer the buyer’s question."
                    aria-invalid={!!error}
                    aria-describedby={
                      error ? `reply-${inquiry._id}-error` : undefined
                    }
                    className={`w-full resize-y rounded-xl border bg-[#0A1628] p-4 text-white placeholder:text-[#8EA0B5]/70 outline-none transition-colors focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] ${
                      error ? "border-red-400" : "border-white/15"
                    }`}
                  />
                  <div className="mt-1.5 flex items-start justify-between gap-4">
                    <p
                      id={`reply-${inquiry._id}-error`}
                      role="alert"
                      className="text-sm text-red-400"
                    >
                      {error}
                    </p>
                    <p className="shrink-0 text-sm tabular-nums text-[#8EA0B5]">
                      {text.length}/{MAX_REPLY}
                    </p>
                  </div>

                  <div className="mt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={sending}
                      className={`rounded-lg border border-white/20 px-5 py-2.5 font-medium text-white transition-colors hover:border-white/50 disabled:opacity-50 ${focusRing}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sending}
                      className={`flex items-center gap-2 rounded-lg bg-[#2DD4BF] px-5 py-2.5 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
                    >
                      {sending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} aria-hidden="true" />
                          Send reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  );
}

function SkeletonList() {
  return (
    <ul className="grid gap-5" aria-busy="true" aria-label="Loading inquiries">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-44 rounded-2xl border border-white/10 bg-[#0D1D33] motion-safe:animate-pulse"
        />
      ))}
    </ul>
  );
}

export default function SellerInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchInquiries = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setFailed(false);
    }

    try {
      const res = await inquiryService.getSellerInquiries();
      setInquiries(sortNewest(normalizeList(res)));
    } catch (err) {
      console.error("Fetch seller inquiries error:", err);
      if (!silent) setFailed(true);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleReply = async (id, message) => {
    try {
      await inquiryService.replyToInquiry(id, message);
      setInquiries((prev) =>
        prev.map((iq) => (iq._id === id ? { ...iq, reply: message } : iq))
      );
      toast.success("Reply sent");
      fetchInquiries(true);
      return true;
    } catch (err) {
      console.error("Reply error:", err);
      toast.error(err.response?.data?.message || "Could not send the reply");
      return false;
    }
  };

  const openCount = inquiries.filter((iq) => !iq.reply).length;
  const counts = {
    all: inquiries.length,
    open: openCount,
    replied: inquiries.length - openCount,
  };

  const visible = inquiries.filter((iq) => {
    if (filter === "open") return !iq.reply;
    if (filter === "replied") return Boolean(iq.reply);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0A1628] p-5 text-[#C8D3E0] sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1
            className="text-3xl font-bold text-white sm:text-4xl"
            style={display}
          >
            Buyer inquiries
          </h1>
          <p className="mt-2 text-[#8EA0B5]">
            Questions from buyers about your vehicles.
          </p>
        </header>

        {loading ? (
          <SkeletonList />
        ) : failed ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/5 p-10 text-center sm:p-16"
          >
            <p className="text-white">We couldn’t load your inquiries.</p>
            <button
              type="button"
              onClick={() => fetchInquiries()}
              className={`mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 font-medium text-white transition-colors hover:border-[#2DD4BF] hover:text-[#2DD4BF] ${focusRing}`}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : inquiries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-white/20 p-10 text-center sm:p-16"
          >
            <p className="text-lg text-white">No inquiries yet.</p>
            <p className="mt-2 text-[#8EA0B5]">
              When a buyer asks about one of your vehicles, it will appear here.
            </p>
          </motion.div>
        ) : (
          <>
            <div
              role="group"
              aria-label="Filter inquiries"
              className="mb-6 flex flex-wrap gap-2"
            >
              {FILTERS.map(({ key, label }) => {
                const active = filter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${focusRing} ${
                      active
                        ? "border-[#2DD4BF] bg-[#2DD4BF]/10 text-[#2DD4BF]"
                        : "border-white/15 text-[#C8D3E0] hover:border-white/40"
                    }`}
                  >
                    {label} ({counts[key]})
                  </button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-[#8EA0B5]">
                Nothing in this list.
              </p>
            ) : (
              <ul className="grid gap-5">
                <AnimatePresence mode="popLayout">
                  {visible.map((inquiry) => (
                    <InquiryItem
                      key={inquiry._id}
                      inquiry={inquiry}
                      onReply={handleReply}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}