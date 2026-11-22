import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CarFront,
  CheckCircle2,
  XCircle,
  Hourglass,
  ExternalLink,
} from "lucide-react";

const TestDriveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await testDriveService.getBookingById(id);
        setBooking(res?.data?.data || res?.data || res);
      } catch (err) {
        console.error("Failed to load details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading test drive..." />;

  if (!booking) {
    return (
      <div
        style={body}
        className="flex min-h-screen flex-col items-center justify-center bg-[#0A1628] px-4 text-center text-[#C8D3E0]"
      >
        <div className="max-w-sm rounded-2xl border border-white/10 bg-[#0D1D33] p-8">
          <p style={display} className="text-lg font-bold text-white">
            Booking not found
          </p>
          <p className="mt-2 text-sm text-[#8EA0B5]">
            This test drive appointment could not be loaded or no longer exists.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`mt-6 inline-flex items-center justify-center rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const vehicleObj =
    typeof booking.vehicle_id === "object" ? booking.vehicle_id : null;
  const vehicleName = vehicleObj
    ? `${vehicleObj.make || ""} ${vehicleObj.model || ""}`.trim()
    : booking.vehicle_id || "Vehicle Appointment";
  const vehicleId = vehicleObj?._id || (typeof booking.vehicle_id === "string" ? booking.vehicle_id : null);

  const formattedDate = booking.preferred_date
    ? new Date(booking.preferred_date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not scheduled";

  const formattedTime =
    typeof booking.preferred_time === "object" && booking.preferred_time !== null
      ? booking.preferred_time.slot ||
        booking.preferred_time.time ||
        JSON.stringify(booking.preferred_time)
      : booking.preferred_time || "Not specified";

  const formattedLocation =
    typeof booking.location === "object" && booking.location !== null
      ? [booking.location.address, booking.location.city]
          .filter(Boolean)
          .join(", ") || "Location on file"
      : booking.location || "Not specified";

  const normalizedStatus = (booking.status || "Pending").toLowerCase();
  const statusConfig =
    normalizedStatus === "approved" || normalizedStatus === "confirmed"
      ? {
          badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
          icon: <CheckCircle2 size={15} />,
        }
      : normalizedStatus === "rejected" || normalizedStatus === "cancelled"
      ? {
          badge: "border-rose-400/30 bg-rose-500/10 text-rose-300",
          icon: <XCircle size={15} />,
        }
      : {
          badge: "border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]",
          icon: <Hourglass size={15} />,
        };

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

      <div className="relative mx-auto max-w-4xl">
        {/* BACK BAR */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0D1D33] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#2DD4BF]/50 hover:bg-[#102238] hover:text-[#2DD4BF] sm:text-sm ${focusRing}`}
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Back</span>
          </button>

          {booking._id && (
            <span style={mono} className="text-xs text-[#8EA0B5]">
              Booking #{booking._id.slice(-6)}
            </span>
          )}
        </div>

        {/* HEADER */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mb-8 border-b border-white/10 pb-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
            Appointment Summary
          </p>
          <h1
            style={display}
            className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Test Drive <span className="text-[#2DD4BF]">Details</span>
          </h1>
          <p className="mt-1.5 text-sm text-[#8EA0B5]">
            Review your scheduled vehicle inspection and driving slot.
          </p>
        </motion.header>

        {/* DETAILS CARD */}
        <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-xl sm:p-8 lg:p-10">
          {/* VEHICLE TITLE ROW */}
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                <CarFront size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                  Selected Vehicle
                </p>
                <h2
                  style={display}
                  className="truncate text-xl font-bold text-white sm:text-2xl"
                >
                  {vehicleName}
                </h2>
              </div>
            </div>

            {vehicleId && (
              <Link
                to={`/vehicle/${vehicleId}`}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#2DD4BF]/40 bg-[#0A1628]/80 px-4 py-2.5 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] sm:w-auto ${focusRing}`}
              >
                <span>View listing</span>
                <ExternalLink size={14} />
              </Link>
            )}
          </div>

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {/* DATE */}
            <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 sm:p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                <Calendar size={14} className="text-[#2DD4BF]" />
                <span>Preferred Date</span>
              </p>
              <p
                style={mono}
                className="mt-2 text-base font-semibold text-white sm:text-lg"
              >
                {formattedDate}
              </p>
            </div>

            {/* TIME */}
            <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 sm:p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                <Clock size={14} className="text-[#2DD4BF]" />
                <span>Preferred Time</span>
              </p>
              <p
                style={mono}
                className="mt-2 text-base font-semibold text-white sm:text-lg"
              >
                {formattedTime}
              </p>
            </div>

            {/* LOCATION */}
            <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 sm:col-span-2 sm:p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                <MapPin size={14} className="text-[#2DD4BF]" />
                <span>Meeting Location</span>
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-white sm:text-base">
                {formattedLocation}
              </p>
            </div>

            {/* STATUS */}
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 sm:col-span-2 sm:flex-row sm:items-center sm:p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                  Booking Status
                </p>
                <p className="mt-1 text-sm font-semibold capitalize text-white sm:text-base">
                  {booking.status || "Pending"}
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold capitalize ${statusConfig.badge}`}
              >
                {statusConfig.icon}
                <span>{booking.status || "Pending"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDriveDetails;