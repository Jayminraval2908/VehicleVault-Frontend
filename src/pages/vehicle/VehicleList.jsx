import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Fuel,
  Gauge,
  Eye,
  ArrowUpRight,
  ArrowLeft,
  Search,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const headerMotion = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const cardMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: Math.min(index * 0.07, 0.35),
      ease: "easeOut",
    },
  }),
};

const VehicleList = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getAllVehicles(search);
        const approvedVehicles = (data || []).filter(
          (v) => v.status === "Approved"
        );
        setVehicles(approvedVehicles);
      } catch (err) {
        console.error("Failed to load collection", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [search]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div
      className="relative overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-8 lg:py-8"
      style={body}
    >
      {/* Subtle Ambient Accent Glows */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#2DD4BF]/12 blur-3xl sm:h-96 sm:w-96"
        animate={reduceMotion ? undefined : { x: [0, 32, 0], y: [0, 22, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl sm:h-96 sm:w-96"
        animate={reduceMotion ? undefined : { x: [0, -28, 0], y: [0, -24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* TOP BACK BAR */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            className={`group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0D1D33] px-3.5 py-2 text-xs font-semibold text-white transition-all hover:border-[#2DD4BF]/50 hover:bg-[#102238] hover:text-[#2DD4BF] sm:text-sm ${focusRing}`}
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />
            <span>Back</span>
          </button>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-3 py-1 text-xs font-medium text-[#2DD4BF]">
            <Sparkles size={13} />
            Curated Vault Showcase
          </span>
        </div>

        {/* SECTION HEADER & SEARCH */}
        <motion.header
          variants={headerMotion}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="mb-8 border-b border-white/10 pb-7 sm:mb-10"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
                The Vault Inventory
              </p>
              <h1
                className="mt-1.5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
                style={display}
              >
                Premier <span className="text-[#2DD4BF]">Collection</span>
              </h1>
              <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-[#8EA0B5] sm:text-base">
                Explore inspected vehicles from verified sellers. Compare specs,
                check condition reports, and book a test drive.
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="w-full lg:w-80 xl:w-96">
              <label htmlFor="vault-search" className="sr-only">
                Search vehicles by brand or model
              </label>
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8EA0B5]"
                />
                <input
                  id="vault-search"
                  type="text"
                  placeholder="Search by brand, model..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full rounded-xl border border-white/15 bg-[#0D1D33] py-3 pl-10 pr-10 text-sm text-white placeholder-[#8EA0B5] transition-colors focus:border-[#2DD4BF] focus:outline-none ${focusRing}`}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#8EA0B5] transition-colors hover:text-white"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RESULT BAR */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-[#8EA0B5]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#2DD4BF]" />
              Approved listings only
            </span>
            <span style={mono}>
              {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}
            </span>
          </div>
        </motion.header>

        {/* VEHICLE GRID */}
        {vehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0D1D33]/60 px-6 py-16 text-center">
            <p className="text-base font-medium text-white" style={display}>
              No matching vehicles found
            </p>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              {search
                ? `No approved listings matched "${search}". Try another brand or model.`
                : "Our vault inventory is currently being updated. Check back soon."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`mt-5 rounded-lg border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 px-4 py-2 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF]/20 ${focusRing}`}
              >
                Reset search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {vehicles.map((car, index) => (
              <motion.article
                key={car._id}
                custom={index}
                variants={cardMotion}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                whileHover={reduceMotion ? undefined : { y: -5 }}
                transition={{ duration: 0.25 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33] shadow-lg transition-colors duration-300 hover:border-[#2DD4BF]/50 hover:bg-[#102238] hover:shadow-[0_14px_34px_rgba(45,212,191,0.08)]"
              >
                {/* IMAGE CONTAINER WITH BREATHING ZOOM IN/OUT */}
                <Link
                  to={`/vehicle/${car._id}`}
                  className={`relative block aspect-[16/10] overflow-hidden bg-[#0A1628] ${focusRing}`}
                >
                  <motion.img
                    src={
                      car.coverImage ||
                      (car.images && car.images.length > 0
                        ? car.images[0]
                        : "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80")
                    }
                    alt={`${car.make} ${car.model}`}
                    animate={
                      reduceMotion
                        ? undefined
                        : {
                            scale: [1, 1.06, 1],
                          }
                    }
                    transition={{
                      duration: 9 + (index % 3) * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D33] via-[#0D1D33]/20 to-transparent" />

                  {/* YEAR BADGE */}
                  {car.year && (
                    <span
                      className="absolute right-3.5 top-3.5 rounded-lg border border-white/15 bg-[#0A1628]/85 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur"
                      style={mono}
                    >
                      {car.year}
                    </span>
                  )}

                  {/* PRICE OVERLAY */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    <span
                      className="rounded-lg border border-[#2DD4BF]/25 bg-[#0A1628]/80 px-2.5 py-1 text-lg font-bold text-[#2DD4BF] backdrop-blur sm:text-xl"
                      style={mono}
                    >
                      ₹{car.price?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </Link>

                {/* CARD BODY */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3
                          className="truncate text-lg font-bold text-white transition-colors group-hover:text-[#2DD4BF] sm:text-xl"
                          style={display}
                        >
                          {car.make} {car.model}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#8EA0B5]">
                          {car.year ? `${car.year} Model` : "Certified Listing"}
                        </p>
                      </div>

                      <Link
                        to={`/vehicle/${car._id}`}
                        aria-label={`Open ${car.make} ${car.model}`}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-[#2DD4BF] group-hover:text-[#0A1628] ${focusRing}`}
                      >
                        <ArrowUpRight size={18} />
                      </Link>
                    </div>

                    {/* SPECS */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs text-[#C8D3E0]">
                      <div className="flex items-center gap-2 truncate">
                        <Gauge size={15} className="shrink-0 text-[#2DD4BF]" />
                        <span className="truncate" style={mono}>
                          {car.mileage?.toLocaleString("en-IN") || "—"} km
                        </span>
                      </div>
                      <div className="flex items-center gap-2 truncate">
                        <Fuel size={15} className="shrink-0 text-[#2DD4BF]" />
                        <span className="truncate">
                          {car.fuel_type || car.fuelType || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/vehicle/${car._id}`}
                    className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0A1628] py-3 text-xs font-semibold text-white transition-colors hover:border-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0A1628] ${focusRing}`}
                  >
                    <Eye size={15} />
                    View details
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;