import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import { toast } from "react-toastify";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CarFront,
  CheckCircle2,
  XCircle,
  Hourglass,
} from "lucide-react";

const SellerTestDrives = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await testDriveService.getSellerBookings();
      const list = Array.isArray(res) ? res : res?.data || [];
      setBookings(list);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await testDriveService.updateStatus(id, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullScreen label="Loading test drive requests..." />;

  return (
    <div
      style={body}
      className="relative min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-10 lg:py-10"
    >
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl">
        {/* HEADER */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:mb-10 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
              Schedule Management
            </p>
            <h1
              style={display}
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Test Drive <span className="text-[#2DD4BF]">Requests</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Approve or decline incoming buyer test drive appointments for your
              listings.
            </p>
          </div>

          <div
            style={mono}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0D1D33] px-3.5 py-2 text-xs text-[#8EA0B5]"
          >
            <CarFront size={15} className="text-[#2DD4BF]" />
            <span>
              {bookings.length} {bookings.length === 1 ? "request" : "requests"}
            </span>
          </div>
        </motion.header>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0D1D33]/70 px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Calendar size={26} />
            </div>
            <h2
              style={display}
              className="text-xl font-bold text-white sm:text-2xl"
            >
              No test drive requests yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#8EA0B5]">
              When buyers book a slot to inspect and test drive your vehicles,
              their requests will show up here.
            </p>
          </div>
        ) : (
          /* BOOKINGS LIST */
          <div className="space-y-5">
            {bookings.map((b) => {
              const normalizedStatus = (b.status || "Pending").toLowerCase();

              const statusBadge =
                normalizedStatus === "approved" ||
                normalizedStatus === "confirmed"
                  ? {
                      classes:
                        "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
                      icon: <CheckCircle2 size={14} />,
                    }
                  : normalizedStatus === "cancelled" ||
                    normalizedStatus === "rejected"
                  ? {
                      classes:
                        "border-rose-400/30 bg-rose-500/10 text-rose-300",
                      icon: <XCircle size={14} />,
                    }
                  : {
                      classes:
                        "border-amber-400/30 bg-amber-500/10 text-amber-300",
                      icon: <Hourglass size={14} />,
                    };

              const buyerName =
                b.buyer_id?.name ||
                `${b.buyer_id?.firstName || ""} ${
                  b.buyer_id?.lastName || ""
                }`.trim() ||
                "Verified Buyer";

              const formattedDate = b.preferred_date
                ? new Date(b.preferred_date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Not specified";

              const formattedLocation =
                typeof b.location === "object" && b.location !== null
                  ? [b.location.address, b.location.city]
                      .filter(Boolean)
                      .join(", ") || "Location on file"
                  : b.location || "Not specified";

              return (
                <article
                  key={b._id}
                  className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-lg transition-colors duration-200 hover:border-[#2DD4BF]/35 sm:p-6"
                >
                  {/* TOP ROW: VEHICLE & STATUS */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h3
                        style={display}
                        className="truncate text-lg font-bold text-white sm:text-xl"
                      >
                        {b.vehicle_id?.make} {b.vehicle_id?.model}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#8EA0B5]">
                        <User size={13} className="text-[#2DD4BF]" />
                        <span>Buyer:</span>
                        <span className="text-[#C8D3E0]">{buyerName}</span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold capitalize ${statusBadge.classes}`}
                    >
                      {statusBadge.icon}
                      <span>{b.status || "Pending"}</span>
                    </span>
                  </div>

                  {/* APPOINTMENT DETAILS GRID */}
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                        <Calendar size={13} className="text-[#2DD4BF]" />
                        <span>Date</span>
                      </p>
                      <p
                        style={mono}
                        className="mt-1 text-sm font-semibold text-white"
                      >
                        {formattedDate}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                        <Clock size={13} className="text-[#2DD4BF]" />
                        <span>Time</span>
                      </p>
                      <p
                        style={mono}
                        className="mt-1 text-sm font-semibold text-white"
                      >
                        {typeof b.preferred_time === "object"
                          ? b.preferred_time?.slot ||
                            b.preferred_time?.time ||
                            "Scheduled"
                          : b.preferred_time || "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                      <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                        <MapPin size={13} className="text-[#2DD4BF]" />
                        <span>Location</span>
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-white">
                        {formattedLocation}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  {normalizedStatus === "pending" && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleAction(b._id, "Approved")}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-sm ${focusRing}`}
                      >
                        <CheckCircle2 size={17} />
                        <span>Approve request</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction(b._id, "Cancelled")}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white sm:text-sm ${focusRing}`}
                      >
                        <XCircle size={17} />
                        <span>Reject request</span>
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerTestDrives;