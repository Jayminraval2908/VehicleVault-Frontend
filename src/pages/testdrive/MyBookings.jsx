import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CarFront,
  CheckCircle2,
  XCircle,
  Hourglass,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userId = user?.id || user?._id;

        if (!userId) {
          console.error("No User ID found");
          setLoading(false);
          return;
        }

        const res = await testDriveService.getBuyerBookings(userId);
        const list = res?.data || res;
        setBookings(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Booking Fetch Error:", err);
        toast.error("Failed to load test drive schedule.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Do you wish to cancel this scheduled test drive?")) {
      try {
        await testDriveService.cancelBooking(id);
        setBookings((prev) => prev.filter((b) => b._id !== id));
        toast.success("Booking cancelled successfully");
      } catch (err) {
        console.error("Cancellation Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Cancellation failed.");
      }
    }
  };

  if (loading) return <Loader fullScreen label="Loading test drive schedule..." />;

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
              Appointments
            </p>
            <h1
              style={display}
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Test Drive <span className="text-[#2DD4BF]">Schedule</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Manage your physical vehicle inspections and driving sessions.
            </p>
          </div>

          <div
            style={mono}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0D1D33] px-3.5 py-2 text-xs text-[#8EA0B5]"
          >
            <CarFront size={15} className="text-[#2DD4BF]" />
            <span>
              {bookings.length} {bookings.length === 1 ? "session" : "sessions"}
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
              No drives scheduled yet
            </h2>
            <p className="mx-auto mb-7 mt-2 max-w-sm text-sm text-[#8EA0B5]">
              Browse verified listings in the collection and book an in-person
              test drive slot.
            </p>
            <Link
              to="/vehicles"
              className={`inline-flex items-center justify-center rounded-xl bg-[#2DD4BF] px-5 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-sm ${focusRing}`}
            >
              Explore collection
            </Link>
          </div>
        ) : (
          /* BOOKINGS LIST */
          <div className="space-y-5">
            {bookings.map((booking) => {
              const bookingDate = booking.preferred_date
                ? new Date(booking.preferred_date)
                : null;
              const normalizedStatus = (booking.status || "Pending").toLowerCase();

              const statusConfig =
                normalizedStatus === "approved" ||
                normalizedStatus === "confirmed"
                  ? {
                      badge:
                        "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
                      icon: <CheckCircle2 size={14} />,
                    }
                  : normalizedStatus === "rejected" ||
                    normalizedStatus === "cancelled"
                  ? {
                      badge:
                        "border-rose-400/30 bg-rose-500/10 text-rose-300",
                      icon: <XCircle size={14} />,
                    }
                  : {
                      badge:
                        "border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]",
                      icon: <Hourglass size={14} />,
                    };

              const vehicleObj =
                typeof booking.vehicle_id === "object"
                  ? booking.vehicle_id
                  : null;
              const vehicleTitle = vehicleObj
                ? `${vehicleObj.make || ""} ${vehicleObj.model || ""}`.trim()
                : "Vault Vehicle";
              const refId = (
                vehicleObj?._id ||
                booking.vehicle_id ||
                "000000"
              )
                .toString()
                .slice(-6);

              const formattedTime =
                typeof booking.preferred_time === "object" &&
                booking.preferred_time !== null
                  ? booking.preferred_time.slot ||
                    booking.preferred_time.time ||
                    "Schedule set"
                  : booking.preferred_time || "Not specified";

              const formattedLocation =
                typeof booking.location === "object" &&
                booking.location !== null
                  ? [booking.location.address, booking.location.city]
                      .filter(Boolean)
                      .join(", ") || "On-site"
                  : booking.location || "Not specified";

              return (
                <article
                  key={booking._id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-lg transition-colors duration-200 hover:border-[#2DD4BF]/40 sm:p-6"
                >
                  {/* Mint Accent Strip */}
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#2DD4BF]" />

                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start md:items-center">
                      {/* DATE BADGE */}
                      <div className="flex min-w-[88px] shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0A1628] px-4 py-3 text-center">
                        <span
                          style={mono}
                          className="text-2xl font-bold text-[#2DD4BF]"
                        >
                          {bookingDate ? bookingDate.getDate() : "—"}
                        </span>
                        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-[#8EA0B5]">
                          {bookingDate
                            ? bookingDate.toLocaleString("en-IN", {
                                month: "short",
                              })
                            : "N/A"}
                        </span>
                      </div>

                      {/* BOOKING DETAILS */}
                      <div className="min-w-0 flex-1 space-y-2.5 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                          <h3
                            style={display}
                            className="truncate text-lg font-bold text-white sm:text-xl"
                          >
                            {vehicleTitle}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${statusConfig.badge}`}
                          >
                            {statusConfig.icon}
                            <span>{booking.status || "Pending"}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#C8D3E0] sm:justify-start sm:text-sm">
                          <span
                            style={mono}
                            className="inline-flex items-center gap-1.5"
                          >
                            <Clock size={14} className="shrink-0 text-[#2DD4BF]" />
                            <span>{formattedTime}</span>
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <MapPin
                              size={14}
                              className="shrink-0 text-[#2DD4BF]"
                            />
                            <span className="truncate">{formattedLocation}</span>
                          </span>

                          <span
                            style={mono}
                            className="rounded-md border border-white/10 bg-[#0A1628] px-2 py-0.5 text-[11px] text-[#8EA0B5]"
                          >
                            Ref: #{refId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex w-full shrink-0 gap-3 md:w-auto">
                      <button
                        type="button"
                        onClick={() => navigate(`/buyer/bookings/${booking._id}`)}
                        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#2DD4BF]/40 bg-[#0A1628]/80 px-4 py-2.5 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] md:flex-none sm:text-sm ${focusRing}`}
                      >
                        <span>Details</span>
                        <ArrowUpRight size={15} />
                      </button>

                      {normalizedStatus === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking._id)}
                          aria-label={`Cancel test drive for ${vehicleTitle}`}
                          className={`inline-flex items-center justify-center rounded-xl border border-rose-400/30 bg-rose-500/10 p-2.5 text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white ${focusRing}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;