import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import offerService from "../../services/offerService";
import inquiryService from "../../services/inquiryService";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  User,
  MessageSquare,
  Calendar,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState({ offers: [], inquiries: [], bookings: [] });
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const fetchDashboardData = async () => {
    try {
      const [offersRes, inquiryRes, bookingRes] = await Promise.all([
        offerService.getBuyerOffers(),
        inquiryService.getBuyerInquiries(),
        testDriveService.getBuyerBookings(),
      ]);

      setData({
        offers: offersRes.data || offersRes || [],
        inquiries: inquiryRes.data || inquiryRes || [],
        bookings: bookingRes || [],
      });
    } catch (err) {
      console.error("Dashboard Load Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || (!user.id && !user._id)) {
      setLoading(false);
      return;
    }

    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    const handleFocus = () => {
      fetchDashboardData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  if (loading) return <Loader fullScreen />;

  if (!user) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center bg-[#0A1628] p-6 text-center text-[#C8D3E0]"
        style={body}
      >
        <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-8 shadow-2xl">
          <AlertCircle size={44} className="mx-auto mb-4 text-rose-400" />
          <h2 className="mb-2 text-xl font-bold text-white" style={display}>
            Session missing
          </h2>
          <p className="mb-6 max-w-xs text-sm text-[#8EA0B5]">
            Please sign in to access your buyer dashboard and saved activity.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className={`rounded-lg bg-[#2DD4BF] px-5 py-2.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#0A1628] p-6 text-[#C8D3E0] lg:p-12"
      style={body}
    >
      {/* Ambient Background Glows */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl sm:h-[26rem] sm:w-[26rem]"
        animate={reduceMotion ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl sm:h-96 sm:w-96"
        animate={reduceMotion ? undefined : { x: [0, -25, 0], y: [0, -25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative mx-auto max-w-6xl"
        variants={containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        {/* WELCOME HEADER */}
        <motion.header
          variants={itemVariants}
          className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-center"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#2DD4BF]/40 bg-[#102238] text-[#2DD4BF] shadow-[0_0_24px_rgba(45,212,191,0.15)]">
              <User size={28} />
            </div>
            <div>
              <h1
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                style={display}
              >
                Welcome,{" "}
                <span className="text-[#2DD4BF]">
                  {user.name || "Collector"}
                </span>
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-[#8EA0B5]">
                <ShieldCheck size={15} className="text-[#2DD4BF]" />
                Verified Buyer Account
              </p>
            </div>
          </div>

          <Link
            to="/vehicles"
            className={`group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#0D1D33] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-[#2DD4BF]/60 hover:bg-[#102238] hover:text-[#2DD4BF] ${focusRing}`}
          >
            Browse inventory
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </motion.header>

        {/* STATS OVERVIEW */}
        <motion.div
          variants={itemVariants}
          className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          <StatCard
            icon={<IndianRupee />}
            label="Active Offers"
            count={data.offers.length}
          />
          <StatCard
            icon={<MessageSquare />}
            label="Open Inquiries"
            count={data.inquiries.length}
          />
          <StatCard
            icon={<Calendar />}
            label="Scheduled Drives"
            count={data.bookings.length}
          />
        </motion.div>

        {/* ACTIVITY PANELS */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {/* RECENT OFFERS */}
          <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3
                className="text-xl font-semibold text-white"
                style={display}
              >
                Recent offers
              </h3>
              <Link
                to="/buyer/offers"
                className={`text-xs font-semibold text-[#2DD4BF] transition-colors hover:text-[#5EEAD4] ${focusRing}`}
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3.5">
              {data.offers.slice(0, 3).map((offer) => (
                <div
                  key={offer._id}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 transition-all hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
                >
                  <div>
                    <p
                      className="text-base font-semibold text-white"
                      style={mono}
                    >
                      ₹{offer.offered_amount?.toLocaleString() || "0"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8EA0B5]">
                      Status:{" "}
                      <span className="font-medium capitalize text-[#2DD4BF]">
                        {offer.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110">
                    <TrendingUp size={17} />
                  </div>
                </div>
              ))}

              {data.offers.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
                  <p className="text-sm text-[#8EA0B5]">No offers placed yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* UPCOMING TEST DRIVES */}
          <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3
                className="text-xl font-semibold text-white"
                style={display}
              >
                Scheduled test drives
              </h3>
              <Link
                to="/buyer/bookings"
                className={`text-xs font-semibold text-[#2DD4BF] transition-colors hover:text-[#5EEAD4] ${focusRing}`}
              >
                View all →
              </Link>
            </div>

            <div className="space-y-3.5">
              {data.bookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 transition-all hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2DD4BF]/10 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold text-white"
                      style={mono}
                    >
                      {booking.preferred_date
                        ? new Date(booking.preferred_date).toLocaleDateString()
                        : "TBD"}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8EA0B5]">
                      {booking.preferred_time || "Pending confirmation"}
                    </p>
                  </div>
                </div>
              ))}

              {data.bookings.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 py-8 text-center">
                  <p className="text-sm text-[#8EA0B5]">
                    No scheduled test drives.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, count }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1D33] p-6 transition-colors hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
  >
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
        {label}
      </p>
      <p
        className="mt-2 text-3xl font-bold text-white"
        style={display}
      >
        {count}
      </p>
    </div>
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110">
      {React.cloneElement(icon, { size: 22 })}
    </div>
  </motion.div>
);

export default BuyerDashboard;