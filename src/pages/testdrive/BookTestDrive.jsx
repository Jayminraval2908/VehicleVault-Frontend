import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-[#0A1628] px-4 py-3 text-sm text-white placeholder-[#8EA0B5] transition-colors focus:border-[#2DD4BF] focus:outline-none [color-scheme:dark]";

const labelClass =
  "mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]";

const BookTestDrive = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "Main Showroom - Luxury Wing",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!vehicleId) {
      toast.error("Invalid vehicle. Please try again.");
      return;
    }

    if (!formData.date || !formData.time) {
      toast.error("Please select date and time.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        vehicle_id: vehicleId,
        preferred_date: formData.date,
        preferred_time: formData.time,
        location: formData.location,
      };

      await testDriveService.bookTestDrive(dataToSend);

      toast.success("Test Drive Requested! The seller will confirm shortly.");

      navigate("/buyer/bookings", { state: { refresh: true } });
    } catch (err) {
      console.error("Booking Error:", err.response?.data || err.message);

      toast.error(
        err.response?.data?.message || "Scheduling failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen label="Scheduling test drive..." />;

  return (
    <div
      style={body}
      className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-[#0A1628] px-4 py-8 text-[#C8D3E0] sm:px-6 lg:px-8"
    >
      {/* Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-xl"
      >
        <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-xl sm:p-8 lg:p-10">
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`group mb-6 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#0A1628]/80 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF] sm:mb-8 sm:text-sm ${focusRing}`}
          >
            <ChevronLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            <span>Back</span>
          </button>

          {/* HEADER */}
          <header className="mb-8 border-b border-white/10 pb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <Calendar size={26} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
              Private Viewing
            </p>
            <h1
              style={display}
              className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Schedule a <span className="text-[#2DD4BF]">Test Drive</span>
            </h1>
            <p className="mx-auto mt-1.5 max-w-sm text-sm text-[#8EA0B5]">
              Pick your preferred date and time slot to inspect and drive this
              vehicle in person.
            </p>
          </header>

          {/* FORM */}
          <form onSubmit={handleBooking} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              <div>
                <label htmlFor="drive-date" className={labelClass}>
                  <Calendar size={13} className="text-[#2DD4BF]" />
                  <span>Preferred Date</span>
                </label>
                <input
                  id="drive-date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  style={mono}
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>

              <div>
                <label htmlFor="drive-time" className={labelClass}>
                  <Clock size={13} className="text-[#2DD4BF]" />
                  <span>Preferred Time</span>
                </label>
                <input
                  id="drive-time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  style={mono}
                  className={`${fieldClass} ${focusRing}`}
                  required
                />
              </div>
            </div>

            {/* READ-ONLY LOCATION */}
            <div>
              <label htmlFor="drive-location" className={labelClass}>
                <MapPin size={13} className="text-[#2DD4BF]" />
                <span>Viewing Location</span>
              </label>
              <input
                id="drive-location"
                type="text"
                value={formData.location}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-[#0A1628]/60 px-4 py-3 text-sm text-[#8EA0B5] focus:outline-none"
              />
            </div>

            {/* INFO BOX */}
            <div className="flex items-start gap-3 rounded-xl border border-[#2DD4BF]/25 bg-[#102238]/80 p-4">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-[#2DD4BF]"
              />
              <p className="text-xs leading-relaxed text-[#C8D3E0] sm:text-sm">
                Please carry a valid driver&apos;s license at the time of your
                test drive. Seller confirmations are sent within 24 hours.
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-6 py-4 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-base ${focusRing}`}
            >
              <CheckCircle2 size={19} />
              <span>Confirm booking</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default BookTestDrive;