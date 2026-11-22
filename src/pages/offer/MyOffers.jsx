import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import offerService from "../../services/offerService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Lock,
  Hourglass,
  Phone,
  Mail,
  ExternalLink,
  CarFront,
  Repeat,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingCounterId, setAcceptingCounterId] = useState(null);

  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const fetchMyOffers = async () => {
    try {
      const res = await offerService.getBuyerOffers();
      const list = res?.data || res;
      setOffers(Array.isArray(list) ? list : []);
    } catch {
      toast.error("Could not load your offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const handleCancelOffer = async (id) => {
    if (window.confirm("Withdraw this offer?")) {
      try {
        await offerService.deleteOffer(id);
        setOffers((prev) => prev.filter((o) => o._id !== id));
        toast.success("Offer withdrawn");
      } catch {
        toast.error("Failed to withdraw offer");
      }
    }
  };

  const handleAcceptCounter = async (offer) => {
    const counterVal = Number(offer.counter_amount ?? offer.counterAmount);
    setAcceptingCounterId(offer._id);

    try {
      if (typeof offerService.acceptCounterOffer === "function") {
        await offerService.acceptCounterOffer(offer._id);
      } else {
        await offerService.updateOfferStatus(offer._id, {
          status: "Accepted",
          offered_amount: counterVal || offer.offered_amount,
        });
      }

      toast.success("Counter offer accepted! Proceed to confirm deal.");
      await fetchMyOffers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to accept counter offer"
      );
    } finally {
      setAcceptingCounterId(null);
    }
  };

  const handleConfirmDeal = async (id) => {
    try {
      const res = await offerService.confirmDeal(id);
      const updatedOffer = res.data?.data || res.data;

      setOffers((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...updatedOffer } : o))
      );

      toast.success("Deal confirmed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm deal");
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return {
          color: "text-emerald-300",
          border: "border-emerald-400/30",
          bg: "bg-emerald-500/10",
          icon: <CheckCircle size={14} />,
        };
      case "rejected":
        return {
          color: "text-rose-300",
          border: "border-rose-400/30",
          bg: "bg-rose-500/10",
          icon: <XCircle size={14} />,
        };
      case "countered":
        return {
          color: "text-[#2DD4BF]",
          border: "border-[#2DD4BF]/35",
          bg: "bg-[#2DD4BF]/10",
          icon: <Repeat size={14} />,
        };
      default:
        return {
          color: "text-amber-300",
          border: "border-amber-400/30",
          bg: "bg-amber-500/10",
          icon: <Clock size={14} />,
        };
    }
  };

  if (loading) return <Loader fullScreen />;

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
              Negotiation Tracker
            </p>
            <h1
              style={display}
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              My <span className="text-[#2DD4BF]">Bids &amp; Offers</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Monitor offer statuses, review seller counter-offers, and confirm
              accepted deals.
            </p>
          </div>

          <span
            style={mono}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0D1D33] px-3.5 py-2 text-xs text-[#8EA0B5]"
          >
            {offers.length} {offers.length === 1 ? "offer" : "offers"}
          </span>
        </motion.header>

        {/* EMPTY STATE */}
        {offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0D1D33]/70 px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <CarFront size={26} />
            </div>
            <h2
              style={display}
              className="text-xl font-bold text-white sm:text-2xl"
            >
              No offers placed yet
            </h2>
            <p className="mx-auto mb-7 mt-2 max-w-sm text-sm text-[#8EA0B5]">
              Browse verified listings in the vault and submit an offer to start
              a deal.
            </p>
            <Link
              to="/vehicles"
              className={`inline-flex items-center justify-center rounded-xl bg-[#2DD4BF] px-5 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-sm ${focusRing}`}
            >
              Explore collection
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {offers.map((offer) => {
              const normalizedStatus = (offer.status || "Pending").toLowerCase();
              const status = getStatusStyle(offer.status);
              const counterVal = Number(
                offer.counter_amount ?? offer.counterAmount
              );
              const counterNote =
                offer.counter_message ||
                offer.counterMessage ||
                offer.seller_response ||
                offer.sellerResponse;

              const vehicleTitle =
                offer.vehicle_id?.make || offer.vehicle_id?.model
                  ? `${offer.vehicle_id?.make || ""} ${
                      offer.vehicle_id?.model || ""
                    }`.trim()
                  : null;

              return (
                <article
                  key={offer._id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-lg transition-colors duration-200 hover:border-[#2DD4BF]/35 sm:p-6"
                >
                  {/* TOP SECTION */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                        <IndianRupee size={22} />
                      </div>

                      <div className="min-w-0">
                        {vehicleTitle && (
                          <p
                            style={display}
                            className="truncate text-sm font-semibold text-[#8EA0B5]"
                          >
                            {vehicleTitle}
                          </p>
                        )}
                        <h3
                          style={mono}
                          className="text-2xl font-bold text-white sm:text-3xl"
                        >
                          ₹
                          {offer.offered_amount?.toLocaleString("en-IN") || "0"}
                        </h3>
                        <p
                          style={mono}
                          className="mt-1 text-xs text-[#8EA0B5]"
                        >
                          Offer ID: #{offer._id?.slice(-6)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold ${status.border} ${status.bg} ${status.color}`}
                      >
                        {status.icon}
                        <span>{offer.status || "Pending"}</span>
                      </span>
                    </div>
                  </div>

                  {/* SELLER COUNTER-OFFER PANEL */}
                  {normalizedStatus === "countered" && (
                    <div className="rounded-xl border border-[#2DD4BF]/30 bg-[#102238]/90 p-4 sm:p-5">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2DD4BF]">
                          <Repeat size={15} />
                          <span>Seller Counter Offer</span>
                        </div>
                        {counterVal > 0 && (
                          <span
                            style={mono}
                            className="text-xl font-bold text-white sm:text-2xl"
                          >
                            ₹{counterVal.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      {counterNote && (
                        <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-[#C8D3E0] sm:text-sm">
                          <MessageSquare
                            size={15}
                            className="mt-0.5 shrink-0 text-[#2DD4BF]"
                          />
                          <span>{counterNote}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* DEAL STATE BANNERS */}
                  {offer.dealStatus === "deal_locked" && (
                    <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-2 text-emerald-300">
                        <Lock size={16} />
                        <p className="text-xs font-semibold uppercase tracking-wider">
                          Deal Confirmed &amp; Locked
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                        <div className="rounded-lg border border-white/10 bg-[#0A1628]/70 p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                            <Phone size={12} className="text-[#2DD4BF]" />
                            Seller Phone
                          </p>
                          <p
                            style={mono}
                            className="mt-1 text-sm font-medium text-white"
                          >
                            {offer.seller_id?.phone || "Not shared"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-[#0A1628]/70 p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                            <Mail size={12} className="text-[#2DD4BF]" />
                            Seller Email
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-white">
                            {offer.seller_id?.email || "Not shared"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {offer.buyerConfirmed &&
                    offer.dealStatus !== "deal_locked" && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-sky-400/25 bg-sky-500/10 px-4 py-3 text-xs font-medium text-sky-300 sm:text-sm">
                        <Hourglass size={16} className="shrink-0" />
                        <span>
                          Confirmed on your end — waiting for seller confirmation
                          to lock the deal.
                        </span>
                      </div>
                    )}

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                    {normalizedStatus === "countered" && (
                      <button
                        type="button"
                        disabled={acceptingCounterId === offer._id}
                        onClick={() => handleAcceptCounter(offer)}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] disabled:opacity-50 sm:w-auto sm:text-sm ${focusRing}`}
                      >
                        <CheckCircle size={16} />
                        <span>
                          {acceptingCounterId === offer._id
                            ? "Accepting..."
                            : counterVal > 0
                            ? `Accept ₹${counterVal.toLocaleString("en-IN")}`
                            : "Accept counter"}
                        </span>
                      </button>
                    )}

                    {offer.dealStatus === "offer_accepted" &&
                      !offer.buyerConfirmed && (
                        <button
                          type="button"
                          onClick={() => handleConfirmDeal(offer._id)}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-2.5 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:w-auto sm:text-sm ${focusRing}`}
                        >
                          <CheckCircle size={16} />
                          <span>Confirm deal</span>
                        </button>
                      )}

                    <button
                      type="button"
                      onClick={() => {
                        const vId = offer.vehicle_id?._id || offer.vehicle_id;
                        if (vId) navigate(`/vehicle/${vId}`);
                        else toast.error("Vehicle not found");
                      }}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/40 bg-[#0A1628]/80 px-4 py-2.5 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF] hover:text-[#0A1628] sm:w-auto sm:text-sm ${focusRing}`}
                    >
                      <span>View vehicle</span>
                      <ExternalLink size={14} />
                    </button>

                    {(normalizedStatus === "pending" ||
                      normalizedStatus === "countered") && (
                      <button
                        type="button"
                        onClick={() => handleCancelOffer(offer._id)}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white sm:ml-auto sm:w-auto sm:text-sm ${focusRing}`}
                      >
                        <Trash2 size={15} />
                        <span>Withdraw</span>
                      </button>
                    )}
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

export default MyOffers;