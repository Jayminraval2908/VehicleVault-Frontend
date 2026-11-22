import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import vehicleService from "../../services/vehicleService";
import offerService from "../../services/offerService";
import inquiryService from "../../services/inquiryService";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Model";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Settings2,
  UserCheck,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  IndianRupee,
  MessageSquare,
  Handshake,
} from "lucide-react";
import { toast } from "react-toastify";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // EMI Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureMonths, setTenureMonths] = useState(60);

  // Offer & Inquiry Modals
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [submittingOffer, setSubmittingOffer] = useState(false);

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await vehicleService.getVehicleById(id);
        const data = res?.data?.data || res?.data || res;
        setVehicle(data);
        if (data?.price) {
          setOfferAmount(Math.round(Number(data.price) * 0.95).toString());
        }
      } catch (err) {
        toast.error("Could not load vehicle details.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id, navigate]);

  const vehiclePrice = Number(vehicle?.price) || 0;

  // Live EMI Calculation
  const emiBreakdown = useMemo(() => {
    if (!vehiclePrice || vehiclePrice <= 0) {
      return {
        downPayment: 0,
        loanAmount: 0,
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayable: 0,
      };
    }

    const downPayment = Math.round((vehiclePrice * downPaymentPercent) / 100);
    const loanAmount = Math.max(vehiclePrice - downPayment, 0);
    const monthlyRate = interestRate / 12 / 100;

    let monthlyEmi = 0;
    if (loanAmount > 0) {
      if (monthlyRate === 0) {
        monthlyEmi = loanAmount / tenureMonths;
      } else {
        const factor = Math.pow(1 + monthlyRate, tenureMonths);
        monthlyEmi = (loanAmount * monthlyRate * factor) / (factor - 1);
      }
    }

    const roundedEmi = Math.round(monthlyEmi);
    const totalPayable = roundedEmi * tenureMonths;
    const totalInterest = Math.max(totalPayable - loanAmount, 0);

    return {
      downPayment,
      loanAmount,
      monthlyEmi: roundedEmi,
      totalInterest,
      totalPayable,
    };
  }, [vehiclePrice, downPaymentPercent, interestRate, tenureMonths]);

  // Insurance Status & Formatting
  const insuranceInfo = useMemo(() => {
    if (!vehicle) return { label: "Not specified", isExpired: false };

    const rawValidity =
      vehicle.insurance_validity || vehicle.insuranceValidity;
    const rawType = vehicle.insurance_type || vehicle.insuranceType;

    if (rawType === "Expired") {
      return { label: "Expired", isExpired: true };
    }

    if (!rawValidity) {
      return {
        label: rawType ? `${rawType} (Active)` : "Valid on record",
        isExpired: false,
      };
    }

    const parsedDate = new Date(rawValidity);
    if (Number.isNaN(parsedDate.getTime())) {
      return { label: String(rawValidity), isExpired: false };
    }

    const isExpired = parsedDate < new Date();
    const formatted = parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return {
      label: isExpired
        ? `Expired (${formatted})`
        : `${rawType ? `${rawType} · ` : ""}Valid till ${formatted}`,
      isExpired,
    };
  }, [vehicle]);

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const numericOffer = Number(offerAmount);
    if (!numericOffer || numericOffer <= 0) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    setSubmittingOffer(true);
    try {
      await offerService.createOffer({
        vehicle_id: id,
        offered_amount: numericOffer,
      });
      toast.success("Offer submitted to seller!");
      setIsOfferOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit offer.");
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) {
      toast.error("Please enter your message.");
      return;
    }

    setSubmittingInquiry(true);
    try {
      await inquiryService.sendInquiry({
        vehicle_id: id,
        message: inquiryMessage.trim(),
      });
      toast.success("Inquiry sent to seller!");
      setInquiryMessage("");
      setIsInquiryOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send inquiry.");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading vehicle profile..." />;
  if (!vehicle) return null;

  const images =
    Array.isArray(vehicle.images) && vehicle.images.length > 0
      ? vehicle.images
      : [
          vehicle.imageUrl ||
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
        ];

  const ownerLabel =
    vehicle.owner_number || vehicle.ownerNumber || "1st Owner";
  const rtoLabel =
    (vehicle.rto_code || vehicle.rtoCode || "Not specified").toUpperCase();
  const fuelLabel = vehicle.fuel_type || vehicle.fuelType || "Petrol";
  const mileageLabel =
    vehicle.mileage !== undefined && vehicle.mileage !== null
      ? `${Number(vehicle.mileage).toLocaleString("en-IN")} km`
      : "—";

  const principalShare =
    emiBreakdown.totalPayable > 0
      ? Math.round((emiBreakdown.loanAmount / emiBreakdown.totalPayable) * 100)
      : 100;

  return (
    <div
      style={body}
      className="relative min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-10 lg:py-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* TOP NAVIGATION */}
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
            <span>Back to collection</span>
          </button>

          <span style={mono} className="text-xs text-[#8EA0B5]">
            Vault ID: #{vehicle._id?.slice(-6)}
          </span>
        </div>

        {/* MAIN GRID: GALLERY + SUMMARY */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid grid-cols-1 gap-7 lg:grid-cols-12"
        >
          {/* LEFT COLUMN: GALLERY + SPECS + DESCRIPTION */}
          <div className="space-y-6 lg:col-span-7">
            {/* PRIMARY IMAGE */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33]">
              <div className="relative aspect-[16/10] w-full bg-[#0A1628]">
                <img
                  src={images[activeImage] || images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-3.5 top-3.5 rounded-lg border border-[#2DD4BF]/30 bg-[#0A1628]/85 px-3 py-1 backdrop-blur">
                  <span
                    style={mono}
                    className="text-xs font-semibold text-[#2DD4BF]"
                  >
                    {vehicle.year} · {rtoLabel}
                  </span>
                </div>
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto border-t border-white/10 p-3.5">
                  {images.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      aria-label={`View photo ${idx + 1}`}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all ${focusRing} ${
                        activeImage === idx
                          ? "border-[#2DD4BF] ring-2 ring-[#2DD4BF]/40"
                          : "border-white/10 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* OWNERSHIP, RTO & INSURANCE TRUST STRIP */}
            <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 sm:p-6">
              <h2
                style={display}
                className="mb-4 text-base font-bold text-white sm:text-lg"
              >
                Ownership &amp; Compliance
              </h2>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                    <UserCheck size={14} className="text-[#2DD4BF]" />
                    <span>Ownership</span>
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-white">
                    {ownerLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                    <MapPin size={14} className="text-[#2DD4BF]" />
                    <span>RTO Code</span>
                  </p>
                  <p
                    style={mono}
                    className="mt-1.5 text-sm font-semibold text-white"
                  >
                    {rtoLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                    {insuranceInfo.isExpired ? (
                      <ShieldAlert size={14} className="text-rose-400" />
                    ) : (
                      <ShieldCheck size={14} className="text-[#2DD4BF]" />
                    )}
                    <span>Insurance</span>
                  </p>
                  <p
                    className={`mt-1.5 text-xs font-semibold leading-snug sm:text-sm ${
                      insuranceInfo.isExpired ? "text-rose-300" : "text-white"
                    }`}
                  >
                    {insuranceInfo.label}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 sm:p-6">
              <h2
                style={display}
                className="mb-3 text-base font-bold text-white sm:text-lg"
              >
                Seller Notes &amp; Condition
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#C8D3E0]">
                {vehicle.description ||
                  "No additional description provided by the seller."}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: PRICING, ACTIONS & INTERACTIVE EMI CALCULATOR */}
          <div className="space-y-6 lg:col-span-5">
            {/* VEHICLE SUMMARY & CTA CARD */}
            <div className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-xl sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
                Verified Vault Listing
              </p>
              <h1
                style={display}
                className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                {vehicle.make} {vehicle.model}
              </h1>

              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs text-[#8EA0B5]">Asking Price</p>
                  <p
                    style={mono}
                    className="text-3xl font-bold text-[#2DD4BF] sm:text-4xl"
                  >
                    ₹{vehiclePrice.toLocaleString("en-IN")}
                  </p>
                </div>

                <span
                  style={mono}
                  className="rounded-lg border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-2.5 py-1 text-xs font-semibold text-[#2DD4BF]"
                >
                  Est. ₹{emiBreakdown.monthlyEmi.toLocaleString("en-IN")}/mo
                </span>
              </div>

              {/* CORE SPECS GRID */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-[#0A1628]/70 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#8EA0B5]">
                    <Calendar size={13} className="text-[#2DD4BF]" />
                    Model Year
                  </span>
                  <p
                    style={mono}
                    className="mt-1 text-sm font-semibold text-white"
                  >
                    {vehicle.year || "—"}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A1628]/70 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#8EA0B5]">
                    <Gauge size={13} className="text-[#2DD4BF]" />
                    Odometer
                  </span>
                  <p
                    style={mono}
                    className="mt-1 text-sm font-semibold text-white"
                  >
                    {mileageLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A1628]/70 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#8EA0B5]">
                    <Fuel size={13} className="text-[#2DD4BF]" />
                    Fuel Type
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {fuelLabel}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#0A1628]/70 p-3">
                  <span className="flex items-center gap-1.5 text-xs text-[#8EA0B5]">
                    <Settings2 size={13} className="text-[#2DD4BF]" />
                    Transmission
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {vehicle.transmission || "—"}
                  </p>
                </div>
              </div>

              {/* BUYER ACTION BUTTONS */}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsOfferOpen(true)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3.5 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
                >
                  <Handshake size={18} />
                  <span>Make an offer</span>
                </button>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/buyer/book-test-drive/${id}`)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/45 bg-[#0A1628]/80 px-4 py-3 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] sm:text-sm ${focusRing}`}
                  >
                    <Calendar size={16} />
                    <span>Book test drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInquiryOpen(true)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#102238] px-4 py-3 text-xs font-semibold text-[#C8D3E0] transition-colors hover:border-[#2DD4BF]/40 hover:text-white sm:text-sm ${focusRing}`}
                  >
                    <MessageSquare size={16} />
                    <span>Ask seller</span>
                  </button>
                </div>
              </div>
            </div>

            {/* INTERACTIVE EMI CALCULATOR */}
            <section
              aria-labelledby="emi-calc-heading"
              className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-xl sm:p-6"
            >
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                    <Calculator size={18} />
                  </div>
                  <div>
                    <h2
                      id="emi-calc-heading"
                      style={display}
                      className="text-base font-bold text-white sm:text-lg"
                    >
                      EMI Calculator
                    </h2>
                    <p className="text-xs text-[#8EA0B5]">
                      Adjust down payment, rate &amp; tenure
                    </p>
                  </div>
                </div>
              </div>

              {/* MONTHLY EMI HIGHLIGHT */}
              <div className="mt-5 rounded-xl border border-[#2DD4BF]/25 bg-[#0A1628] p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                  Estimated Monthly EMI
                </p>
                <p
                  style={mono}
                  className="mt-1 text-3xl font-bold text-[#2DD4BF]"
                >
                  ₹{emiBreakdown.monthlyEmi.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-[#8EA0B5]">
                    {" "}
                    / month
                  </span>
                </p>

                {/* PRINCIPAL VS INTEREST BAR */}
                <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-[#2DD4BF] transition-all duration-200"
                    style={{ width: `${principalShare}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-[#8EA0B5]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
                    Principal ({principalShare}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    Interest ({100 - principalShare}%)
                  </span>
                </div>
              </div>

              {/* SLIDER CONTROLS */}
              <div className="mt-5 space-y-5">
                {/* DOWN PAYMENT */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <label
                      htmlFor="emi-down-payment"
                      className="font-medium text-[#C8D3E0]"
                    >
                      Down Payment ({downPaymentPercent}%)
                    </label>
                    <span style={mono} className="font-semibold text-[#2DD4BF]">
                      ₹{emiBreakdown.downPayment.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    id="emi-down-payment"
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) =>
                      setDownPaymentPercent(Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-[#2DD4BF]"
                  />
                </div>

                {/* INTEREST RATE */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <label
                      htmlFor="emi-interest-rate"
                      className="font-medium text-[#C8D3E0]"
                    >
                      Interest Rate (p.a.)
                    </label>
                    <span style={mono} className="font-semibold text-[#2DD4BF]">
                      {interestRate.toFixed(1)}%
                    </span>
                  </div>
                  <input
                    id="emi-interest-rate"
                    type="range"
                    min="7.0"
                    max="16.0"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-[#2DD4BF]"
                  />
                </div>

                {/* TENURE */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-[#C8D3E0]">
                      Loan Tenure
                    </span>
                    <span style={mono} className="font-semibold text-[#2DD4BF]">
                      {tenureMonths} Months ({(tenureMonths / 12).toFixed(0)}{" "}
                      Yrs)
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[12, 24, 36, 48, 60].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setTenureMonths(months)}
                        style={mono}
                        className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${focusRing} ${
                          tenureMonths === months
                            ? "border-[#2DD4BF] bg-[#2DD4BF]/15 text-[#2DD4BF]"
                            : "border-white/10 bg-[#0A1628] text-[#8EA0B5] hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {months / 12}Y
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* LOAN SUMMARY BREAKDOWN */}
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs">
                <div className="flex justify-between text-[#8EA0B5]">
                  <span>Loan Principal</span>
                  <span style={mono} className="font-semibold text-white">
                    ₹{emiBreakdown.loanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#8EA0B5]">
                  <span>Total Interest Payable</span>
                  <span style={mono} className="font-semibold text-white">
                    ₹{emiBreakdown.totalInterest.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 text-sm font-semibold text-white">
                  <span>Total Amount Payable</span>
                  <span style={mono} className="text-[#2DD4BF]">
                    ₹{emiBreakdown.totalPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* MAKE OFFER MODAL */}
      <Modal
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        title={`Make an Offer · ${vehicle.make} ${vehicle.model}`}
      >
        <form onSubmit={handleOfferSubmit} className="space-y-4">
          <p className="text-xs text-[#8EA0B5]">
            Asking price:{" "}
            <span style={mono} className="font-semibold text-white">
              ₹{vehiclePrice.toLocaleString("en-IN")}
            </span>
          </p>

          <div>
            <label
              htmlFor="offer-amount-input"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#8EA0B5]"
            >
              Your Offer Amount (₹)
            </label>
            <div className="relative">
              <IndianRupee
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
              />
              <input
                id="offer-amount-input"
                type="number"
                min="1000"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                style={mono}
                className={`w-full rounded-xl border border-white/15 bg-[#0A1628] py-3 pl-10 pr-4 text-sm text-white focus:border-[#2DD4BF] focus:outline-none ${focusRing}`}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={submittingOffer}
              className={`flex-1 rounded-xl bg-[#2DD4BF] px-4 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] disabled:opacity-50 sm:text-sm ${focusRing}`}
            >
              {submittingOffer ? "Submitting..." : "Submit offer"}
            </button>
            <button
              type="button"
              onClick={() => setIsOfferOpen(false)}
              className={`rounded-xl border border-white/15 bg-[#102238] px-4 py-3 text-xs font-semibold text-[#C8D3E0] hover:text-white sm:text-sm ${focusRing}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ASK SELLER INQUIRY MODAL */}
      <Modal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        title={`Ask Seller · ${vehicle.make} ${vehicle.model}`}
      >
        <form onSubmit={handleInquirySubmit} className="space-y-4">
          <div>
            <label
              htmlFor="inquiry-message-input"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#8EA0B5]"
            >
              Your Question
            </label>
            <textarea
              id="inquiry-message-input"
              rows={4}
              placeholder="Ask about service history, RC transfer, tire condition, or availability..."
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              className={`w-full resize-y rounded-xl border border-white/15 bg-[#0A1628] p-3.5 text-sm text-white placeholder-[#8EA0B5] focus:border-[#2DD4BF] focus:outline-none ${focusRing}`}
              required
            />
          </div>

          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={submittingInquiry}
              className={`flex-1 rounded-xl bg-[#2DD4BF] px-4 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] disabled:opacity-50 sm:text-sm ${focusRing}`}
            >
              {submittingInquiry ? "Sending..." : "Send message"}
            </button>
            <button
              type="button"
              onClick={() => setIsInquiryOpen(false)}
              className={`rounded-xl border border-white/15 bg-[#102238] px-4 py-3 text-xs font-semibold text-[#C8D3E0] hover:text-white sm:text-sm ${focusRing}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VehicleDetails;