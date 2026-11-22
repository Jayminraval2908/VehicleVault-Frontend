import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Trash2,
  ExternalLink,
  MessageCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import inquiryService from "../../services/inquiryService";
import { useAuth } from "../../components/context/AuthContext";
import { display, focusRing } from "../../utils/theme";

const ROUTES = {
  inventory: "/buyer/inventory",
  login: "/login",
};

const STATUS_STYLES = {
  pending: { label: "Pending", className: "bg-amber-300/10 text-amber-300" },
  accepted: { label: "Accepted", className: "bg-[#2DD4BF]/10 text-[#2DD4BF]" },
  replied: { label: "Replied", className: "bg-[#2DD4BF]/10 text-[#2DD4BF]" },
  rejected: { label: "Rejected", className: "bg-red-400/10 text-red-400" },
  closed: { label: "Closed", className: "bg-white/10 text-[#C8D3E0]" },
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

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

const getVehicleInfo = (inquiry) => {
  const raw = inquiry.vehicle_id;
  const vehicle = raw && typeof raw === "object" ? raw : null;
  const id = vehicle?._id || (typeof raw === "string" ? raw : null);

  const title = vehicle?.make
    ? `${vehicle.make} ${vehicle.model || ""}`.trim()
    : id
    ? `Vehicle #${id.slice(-6)}`
    : "Vehicle no longer listed";

  return { id, title };
};

function InquiryCard({ inquiry, onDelete }) {
  const reduceMotion = useReducedMotion();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { id: vehicleId, title } = getVehicleInfo(inquiry);
  const statusKey = String(inquiry.status || "").toLowerCase();
  const status = STATUS_STYLES[statusKey] || {
    label: inquiry.status || "Unknown",
    className: "bg-white/10 text-[#C8D3E0]",
  };
  const sentDate = formatDate(inquiry.createdAt);

  const handleConfirm = async () => {
    setDeleting(true);
    await onDelete(inquiry._id);
    setDeleting(false);
    setConfirming(false);
  };

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-[#0D1D33] p-4 transition-colors hover:border-[#2DD4BF]/40 sm:p-6"
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="shrink-0 rounded-xl bg-[#2DD4BF]/10 p-3 text-[#2DD4BF]">
            <MessageCircle size={22} aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-lg font-semibold text-white sm:text-xl"
              style={display}
            >
              {title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                className={`rounded-md px-2.5 py-0.5 text-sm font-medium ${status.className}`}
              >
                {status.label}
              </span>
              {sentDate && (
                <span className="text-sm text-[#8EA0B5]">Sent {sentDate}</span>
              )}
            </div>

            <p className="mt-3 line-clamp-3 leading-relaxed text-[#C8D3E0]">
              “{inquiry.message}”
            </p>

            {inquiry.reply && (
              <div className="mt-4 rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/5 p-4">
                <p className="text-sm font-semibold text-[#2DD4BF]">Reply</p>
                <div className="mt-1 max-h-32 overflow-y-auto pr-2">
                  <p className="leading-relaxed text-[#C8D3E0]">
                    {inquiry.reply}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-white/10 pt-4 md:border-t-0 md:pt-0">
          {vehicleId && (
            <Link
              to={`/vehicle/${vehicleId}`}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-[#2DD4BF] hover:text-[#2DD4BF] md:flex-none ${focusRing}`}
            >
              <ExternalLink size={16} aria-hidden="true" />
              View vehicle
            </Link>
          )}
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label="Delete this inquiry"
            className={`flex items-center justify-center rounded-lg bg-red-400/10 px-3.5 py-2.5 text-red-400 transition-colors hover:bg-red-500 hover:text-white ${focusRing}`}
          >
            <Trash2 size={18} />
          </button>
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
              aria-label="Confirm deleting this inquiry"
              className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-[#C8D3E0]">
                Delete this inquiry? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  disabled={deleting}
                  className={`rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/50 disabled:opacity-50 ${focusRing}`}
                >
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={deleting}
                  className={`flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60 ${focusRing}`}
                >
                  {deleting && <Loader2 size={14} className="animate-spin" />}
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function SkeletonList() {
  return (
    <ul className="grid gap-5" aria-busy="true" aria-label="Loading inquiries">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="h-40 rounded-2xl border border-white/10 bg-[#0D1D33] motion-safe:animate-pulse"
        />
      ))}
    </ul>
  );
}

export default function MyInquiries() {
  const auth = useAuth();
  const user = auth?.user || getStoredUser();
  const userId = user?._id || user?.id;

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchInquiries = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setFailed(false);

      try {
        const response = await inquiryService.getInquiriesByBuyer(userId);
        if (!active) return;

        const data = response.data?.data || response.data || [];
        const list = Array.isArray(data) ? [...data] : [];
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
        setInquiries(list);
      } catch (err) {
        if (!active) return;
        console.error("Fetch inquiries error:", err);
        setFailed(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchInquiries();
    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  const handleDelete = async (id) => {
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((iq) => iq._id !== id));
      toast.success("Inquiry deleted");
    } catch (err) {
      console.error("Delete inquiry error:", err);
      toast.error("Could not delete the inquiry. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] p-5 text-[#C8D3E0] sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <h1
            className="text-3xl font-bold text-white sm:text-4xl"
            style={display}
          >
            My inquiries
          </h1>
          <p className="mt-2 text-[#8EA0B5]">
            Questions you’ve sent to sellers, and their replies.
          </p>
        </header>

        {loading ? (
          <SkeletonList />
        ) : !userId ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center sm:p-16">
            <p className="text-white">Log in to see your inquiries.</p>
            <Link
              to={ROUTES.login}
              className={`mt-5 inline-block rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              Log in
            </Link>
          </div>
        ) : failed ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/5 p-10 text-center sm:p-16"
          >
            <p className="text-white">We couldn’t load your inquiries.</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
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
              Open a vehicle and send the seller a question. It will show up
              here.
            </p>
            <Link
              to={ROUTES.inventory}
              className={`mt-6 inline-block rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              Browse inventory
            </Link>
          </motion.div>
        ) : (
          <ul className="grid gap-5">
            <AnimatePresence initial={true}>
              {inquiries.map((inquiry) => (
                <InquiryCard
                  key={inquiry._id}
                  inquiry={inquiry}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}