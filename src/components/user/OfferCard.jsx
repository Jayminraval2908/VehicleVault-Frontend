import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Loader2,
} from "lucide-react";
import { display, focusRing } from "../../utils/theme";

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    Icon: Clock,
    className: "bg-amber-300/10 text-amber-300",
  },
  accepted: {
    label: "Accepted",
    Icon: CheckCircle2,
    className: "bg-[#2DD4BF]/10 text-[#2DD4BF]",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    className: "bg-red-400/10 text-red-400",
  },
  cancelled: {
    label: "Withdrawn",
    Icon: Ban,
    className: "bg-white/10 text-[#C8D3E0]",
  },
  withdrawn: {
    label: "Withdrawn",
    Icon: Ban,
    className: "bg-white/10 text-[#C8D3E0]",
  },
};

const formatAmount = (amount, currency, locale) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value, locale) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function OfferCard({
  offer,
  onCancel,
  title,
  currency = "USD",
  locale = "en-US",
}) {
  const reduceMotion = useReducedMotion();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const statusKey = String(offer?.status || "").toLowerCase();
  const status = STATUS_STYLES[statusKey] || {
    label: statusKey
      ? statusKey.charAt(0).toUpperCase() + statusKey.slice(1)
      : "Unknown",
    Icon: Clock,
    className: "bg-white/10 text-[#C8D3E0]",
  };
  const StatusIcon = status.Icon;

  const isPending = statusKey === "pending";
  const canWithdraw = isPending && typeof onCancel === "function";
  const date = formatDate(offer?.createdAt, locale);

  const handleConfirm = async () => {
    setCancelling(true);
    try {
      await onCancel(offer._id);
    } catch (err) {
      console.error("Withdraw offer failed:", err);
    } finally {
      setCancelling(false);
      setConfirming(false);
    }
  };

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-[#0D1D33] p-4 transition-colors hover:border-[#2DD4BF]/40 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-xl bg-[#2DD4BF]/10 p-3 text-[#2DD4BF]">
            <Tag size={22} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            {title && (
              <p className="truncate text-sm text-[#C8D3E0]">{title}</p>
            )}
            <p className="text-sm text-[#8EA0B5]">Your offer</p>
            <p className="text-2xl font-bold text-white" style={display}>
              {formatAmount(offer?.amount, currency, locale)}
            </p>
            {date && <p className="text-sm text-[#8EA0B5]">Sent {date}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${status.className}`}
          >
            <StatusIcon size={14} aria-hidden="true" />
            {status.label}
          </span>

          {canWithdraw && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className={`rounded-md px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10 ${focusRing}`}
            >
              Withdraw offer
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              role="alertdialog"
              aria-label="Confirm withdrawing this offer"
              className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-[#C8D3E0]">
                Withdraw this offer? The seller will no longer see it.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={cancelling}
                  className={`rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/50 disabled:opacity-50 ${focusRing}`}
                >
                  Keep offer
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={cancelling}
                  className={`flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60 ${focusRing}`}
                >
                  {cancelling && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {cancelling ? "Withdrawing..." : "Yes, withdraw"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}