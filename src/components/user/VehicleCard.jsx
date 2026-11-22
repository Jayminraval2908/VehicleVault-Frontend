import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Gauge,
  Fuel,
  ArrowUpRight,
  UserCheck,
  MapPin,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { display, body, mono, focusRing } from "../../utils/theme";

const getInsuranceSummary = (vehicle) => {
  const rawValidity =
    vehicle.insurance_validity || vehicle.insuranceValidity;
  const rawType = vehicle.insurance_type || vehicle.insuranceType;

  if (rawType === "Expired") {
    return { text: "Ins. Expired", isExpired: true };
  }

  if (!rawValidity) {
    return {
      text: rawType ? `${rawType} Ins.` : "Ins. on file",
      isExpired: false,
    };
  }

  const parsed = new Date(rawValidity);
  if (Number.isNaN(parsed.getTime())) {
    return { text: `Ins. ${rawValidity}`, isExpired: false };
  }

  const isExpired = parsed < new Date();
  const shortDate = parsed.toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });

  return {
    text: isExpired ? `Ins. Exp '${shortDate.slice(-2)}` : `Ins. till ${shortDate}`,
    isExpired,
  };
};

const VehicleCard = ({ vehicle }) => {
  const reduceMotion = useReducedMotion();

  if (!vehicle) return null;

  const imageSrc =
    vehicle.imageUrl ||
    vehicle.coverImage ||
    (Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images[0]
      : "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80");

  const mileageValue =
    vehicle.mileage !== undefined && vehicle.mileage !== null
      ? `${Number(vehicle.mileage).toLocaleString("en-IN")} km`
      : "—";

  const fuelValue = vehicle.fuel_type || vehicle.fuelType || "Not specified";
  const ownerValue =
    vehicle.owner_number || vehicle.ownerNumber || "1st Owner";
  const rtoValue = (vehicle.rto_code || vehicle.rtoCode || "").toUpperCase();
  const insuranceSummary = getInsuranceSummary(vehicle);

  return (
    <motion.article
      style={body}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33] text-[#C8D3E0] shadow-lg transition-colors duration-200 hover:border-[#2DD4BF]/40 hover:bg-[#102238]"
    >
      {/* VEHICLE IMAGE */}
      <Link
        to={`/vehicle/${vehicle._id}`}
        className={`relative block aspect-[16/10] w-full overflow-hidden bg-[#0A1628] ${focusRing}`}
      >
        <img
          src={imageSrc}
          alt={`${vehicle.make || ""} ${vehicle.model || "Vehicle"}`.trim()}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1D33] via-transparent to-transparent" />

        {/* TOP-LEFT RTO BADGE */}
        {rtoValue && (
          <div
            style={mono}
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg border border-white/15 bg-[#0A1628]/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
          >
            <MapPin size={12} className="text-[#2DD4BF]" />
            <span>{rtoValue}</span>
          </div>
        )}

        {/* BOTTOM-RIGHT PRICE BADGE */}
        <div
          style={mono}
          className="absolute bottom-3 right-3 rounded-lg border border-[#2DD4BF]/30 bg-[#0A1628]/85 px-3 py-1 text-xs font-bold text-[#2DD4BF] backdrop-blur-sm sm:text-sm"
        >
          ₹{vehicle.price?.toLocaleString("en-IN") || "0"}
        </div>
      </Link>

      {/* CARD BODY */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              style={display}
              className="truncate text-base font-bold text-white transition-colors group-hover:text-[#2DD4BF] sm:text-lg"
            >
              {vehicle.make} {vehicle.model}
            </h3>

            <Link
              to={`/vehicle/${vehicle._id}`}
              aria-label={`View ${vehicle.make || ""} ${vehicle.model || "vehicle"}`.trim()}
              className={`shrink-0 rounded-lg p-1 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-[#2DD4BF] ${focusRing}`}
            >
              <ArrowUpRight size={18} />
            </Link>
          </div>

          {/* MILEAGE & FUEL ROW */}
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3 text-xs text-[#8EA0B5]">
            <span className="inline-flex items-center gap-1.5" style={mono}>
              <Gauge size={14} className="shrink-0 text-[#2DD4BF]" />
              <span>{mileageValue}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Fuel size={14} className="shrink-0 text-[#2DD4BF]" />
              <span>{fuelValue}</span>
            </span>
          </div>

          {/* OWNERSHIP & INSURANCE VALIDITY ROW */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#C8D3E0]">
              <UserCheck size={13} className="shrink-0 text-[#2DD4BF]" />
              <span>{ownerValue}</span>
            </span>

            <span
              style={mono}
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                insuranceSummary.isExpired ? "text-rose-300" : "text-[#2DD4BF]"
              }`}
            >
              {insuranceSummary.isExpired ? (
                <ShieldAlert size={13} className="shrink-0 text-rose-400" />
              ) : (
                <ShieldCheck size={13} className="shrink-0 text-[#2DD4BF]" />
              )}
              <span>{insuranceSummary.text}</span>
            </span>
          </div>
        </div>

        <Link
          to={`/vehicle/${vehicle._id}`}
          className={`mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#2DD4BF]/40 bg-[#0A1628]/70 px-4 py-2.5 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] sm:text-sm ${focusRing}`}
        >
          View details
        </Link>
      </div>
    </motion.article>
  );
};

export default VehicleCard;