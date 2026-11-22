import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import offerService from "../../services/offerService";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Model";
import { display, body, mono, focusRing } from "../../utils/theme";
import { toast } from "react-toastify";
import {
  CheckCircle,
  XCircle,
  IndianRupee,
  Lock,
  User,
  Phone,
  Mail,
  Handshake,
  Repeat,
  MessageSquare,
} from "lucide-react";

const SellerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  // Counter-offer modal state
  const [counterTargetOffer, setCounterTargetOffer] = useState(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [submittingCounter, setSubmittingCounter] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await offerService.getSellerOffers();
      setOffers(Array.isArray(res) ? res : res?.data || []);
    } catch (err) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const openCounterModal = (offer) => {
    const baseAmount =
      Number(offer.counter_amount || offer.counterAmount || offer.offered_amount) ||
      0;
    const suggestedCounter =
      offer.counter_amount || offer.counterAmount
        ? baseAmount
        : Math.round(baseAmount * 1.03);

    setCounterTargetOffer(offer);
    setCounterAmount(suggestedCounter ? String(suggestedCounter) : "");
    setCounterMessage(
      offer.counter_message ||
        offer.counterMessage ||
        "We can meet closer to this price given the vehicle's condition."
    );
  };

  const closeCounterModal = () => {
    setCounterTargetOffer(null);
    setCounterAmount("");
    setCounterMessage("");
    setSubmittingCounter(false);
  };

  const handleUpdate = async (id, status) => {
    try {
      const autoResponse =
        status === "Accepted"
          ? "I accept your offer. Let's proceed with the deal."
          : "I cannot accept this offer at this time.";

      await offerService.updateOfferStatus(id, {
        status,
        seller_response: autoResponse,
      });

      toast.success(`Offer ${status}`);
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update offer");
    }
  };

  const handleCounterSubmit = async (e) => {
    e.preventDefault();
    if (!counterTargetOffer) return;

    const numericCounter = Number(counterAmount);
    if (!numericCounter || numericCounter <= 0) {
      toast.error("Please enter a valid counter offer amount.");
      return;
    }

    const trimmedMessage = counterMessage.trim();
    const payload = {
      status: "Countered",
      counter_amount: numericCounter,
      counter_message: trimmedMessage,
      seller_response:
        trimmedMessage ||
        `Counter offer proposed at ₹${numericCounter.toLocaleString("en-IN")}.`,
    };

    setSubmittingCounter(true);
    try {
      if (typeof offerService.counterOffer === "function") {
        await offerService.counterOffer(counterTargetOffer._id, payload);
      } else {
        await offerService.updateOfferStatus(counterTargetOffer._id, payload);
      }

      toast.success("Counter offer sent to buyer");
      closeCounterModal();
      fetchOffers();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send counter offer"
      );
      setSubmittingCounter(false);
    }
  };

  const handleConfirmDeal = async (id) => {
    try {
      const res = await offerService.confirmDeal(id);
      const updatedDataFromServer = res.data?.data || res.data;

      setOffers((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, ...updatedDataFromServer } : o
        )
      );

      toast.success(res.data?.message || "Deal updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm deal");
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
              Deal Pipeline
            </p>
            <h1
              style={display}
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Seller <span className="text-[#2DD4BF]">Offers</span>
            </h1>
            <p className="mt-1.5 text-sm text-[#8EA0B5]">
              Review incoming buyer bids, send counter-offers, and lock
              confirmed deals.
            </p>
          </div>

          <div
            style={mono}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-[#0D1D33] px-3.5 py-2 text-xs text-[#8EA0B5]"
          >
            <Handshake size={15} className="text-[#2DD4BF]" />
            <span>
              {offers.length} {offers.length === 1 ? "offer" : "offers"}
            </span>
          </div>
        </motion.header>

        {/* EMPTY STATE */}
        {offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#0D1D33]/70 px-6 py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]">
              <IndianRupee size={26} />
            </div>
            <h2
              style={display}
              className="text-xl font-bold text-white sm:text-2xl"
            >
              No offers received yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-[#8EA0B5]">
              When buyers submit offers on your listed vehicles, they will
              appear here for negotiation and two-step deal confirmation.
            </p>
          </div>
        ) : (
          /* OFFERS LIST */
          <div className="space-y-5 sm:space-y-6">
            {offers.map((offer) => {
              const normalizedStatus = (offer.status || "Pending").toLowerCase();
              const counterVal = Number(
                offer.counter_amount ?? offer.counterAmount
              );
              const counterNote =
                offer.counter_message ||
                offer.counterMessage ||
                offer.seller_response ||
                offer.sellerResponse;

              const statusBadge =
                normalizedStatus === "accepted"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                  : normalizedStatus === "rejected"
                  ? "border-rose-400/30 bg-rose-500/10 text-rose-300"
                  : normalizedStatus === "countered"
                  ? "border-[#2DD4BF]/35 bg-[#2DD4BF]/10 text-[#2DD4BF]"
                  : "border-amber-400/30 bg-amber-500/10 text-amber-300";

              const canRespond =
                normalizedStatus === "pending" ||
                normalizedStatus === "countered";

              return (
                <article
                  key={offer._id}
                  className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 shadow-lg transition-colors duration-200 hover:border-[#2DD4BF]/35 sm:p-6"
                >
                  {/* HEADER INFO */}
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <h3
                        style={display}
                        className="truncate text-lg font-bold text-white sm:text-xl"
                      >
                        {offer.vehicle_id?.make} {offer.vehicle_id?.model}
                      </h3>
                      <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#8EA0B5]">
                        <User size={13} className="text-[#2DD4BF]" />
                        <span>Buyer:</span>
                        <span className="text-[#C8D3E0]">
                          {offer.buyer_id?.name ||
                            `${offer.buyer_id?.firstName || ""} ${
                              offer.buyer_id?.lastName || ""
                            }`.trim() ||
                            "Verified Buyer"}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-3.5 py-1 text-xs font-semibold ${statusBadge}`}
                    >
                      {offer.status || "Pending"}
                    </span>
                  </div>

                  {/* OFFER & COUNTER AMOUNTS */}
                  <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-[#0A1628]/80 p-4 sm:p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF]">
                        <IndianRupee size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                          Buyer Offered Amount
                        </p>
                        <p
                          style={mono}
                          className="mt-0.5 text-2xl font-bold text-white sm:text-3xl"
                        >
                          ₹{offer.offered_amount?.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {counterVal > 0 && (
                      <div className="flex items-center gap-3.5 rounded-xl border border-[#2DD4BF]/30 bg-[#102238]/90 p-4 sm:p-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/35 bg-[#2DD4BF]/15 text-[#2DD4BF]">
                          <Repeat size={20} />
                        </div>
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-[#2DD4BF]">
                            Your Counter Offer
                          </p>
                          <p
                            style={mono}
                            className="mt-0.5 text-2xl font-bold text-[#2DD4BF] sm:text-3xl"
                          >
                            ₹{counterVal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* COUNTER MESSAGE DISPLAY */}
                  {normalizedStatus === "countered" && counterNote && (
                    <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#2DD4BF]/20 bg-[#0A1628]/70 px-4 py-3 text-xs text-[#C8D3E0] sm:text-sm">
                      <MessageSquare
                        size={16}
                        className="mt-0.5 shrink-0 text-[#2DD4BF]"
                      />
                      <div>
                        <span className="font-semibold text-white">
                          Counter Note:{" "}
                        </span>
                        <span>{counterNote}</span>
                      </div>
                    </div>
                  )}

                  {/* DEAL LOCKED CONTACT CARD */}
                  {offer.dealStatus === "deal_locked" && (
                    <div className="mt-5 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-4 sm:p-5">
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
                            Buyer Phone
                          </p>
                          <p
                            style={mono}
                            className="mt-1 text-sm font-medium text-white"
                          >
                            {offer.buyer_id?.phone || "Not shared"}
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-[#0A1628]/70 p-3">
                          <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#8EA0B5]">
                            <Mail size={12} className="text-[#2DD4BF]" />
                            Buyer Email
                          </p>
                          <p className="mt-1 truncate text-sm font-medium text-white">
                            {offer.buyer_id?.email || "Not shared"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OFFER ACTIONS: ACCEPT / COUNTER / REJECT */}
                  {canRespond && (
                    <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleUpdate(offer._id, "Accepted")}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:text-sm ${focusRing}`}
                      >
                        <CheckCircle size={17} />
                        <span>Accept offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openCounterModal(offer)}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2DD4BF]/45 bg-[#102238] px-5 py-3 text-xs font-semibold text-[#2DD4BF] transition-colors hover:bg-[#2DD4BF]/15 sm:text-sm ${focusRing}`}
                      >
                        <Repeat size={17} />
                        <span>Counter offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdate(offer._id, "Rejected")}
                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-5 py-3 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-white sm:text-sm ${focusRing}`}
                      >
                        <XCircle size={17} />
                        <span>Reject offer</span>
                      </button>
                    </div>
                  )}

                  {/* TWO-STEP FINAL CONFIRMATION */}
                  {offer.dealStatus === "offer_accepted" && (
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <button
                        type="button"
                        onClick={() => handleConfirmDeal(offer._id)}
                        disabled={!offer.buyerConfirmed || offer.sellerConfirmed}
                        className={`w-full rounded-xl px-5 py-3.5 text-xs font-semibold transition-colors sm:text-sm ${focusRing} ${
                          !offer.buyerConfirmed || offer.sellerConfirmed
                            ? "cursor-not-allowed border border-white/10 bg-[#102238] text-[#8EA0B5]"
                            : "bg-[#2DD4BF] text-[#0A1628] hover:bg-[#5EEAD4]"
                        }`}
                      >
                        {!offer.buyerConfirmed
                          ? "Waiting for buyer confirmation..."
                          : offer.sellerConfirmed
                          ? "Deal fully confirmed"
                          : "Confirm final deal"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* COUNTER-OFFER MODAL */}
      <Modal
        isOpen={Boolean(counterTargetOffer)}
        onClose={closeCounterModal}
        title={
          counterTargetOffer
            ? `Counter Offer · ${counterTargetOffer.vehicle_id?.make || ""} ${
                counterTargetOffer.vehicle_id?.model || ""
              }`.trim()
            : "Counter Offer"
        }
      >
        {counterTargetOffer && (
          <form onSubmit={handleCounterSubmit} className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-[#0A1628] p-3.5 text-xs">
              <span className="text-[#8EA0B5]">Current buyer offer: </span>
              <span style={mono} className="font-bold text-white">
                ₹
                {Number(counterTargetOffer.offered_amount || 0).toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div>
              <label
                htmlFor="counter-amount-input"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#8EA0B5]"
              >
                Your Counter Price (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                />
                <input
                  id="counter-amount-input"
                  type="number"
                  min="1000"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  style={mono}
                  className={`w-full rounded-xl border border-white/15 bg-[#0A1628] py-3 pl-10 pr-4 text-sm text-white focus:border-[#2DD4BF] focus:outline-none ${focusRing}`}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="counter-message-input"
                className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#8EA0B5]"
              >
                Counter Message (Optional)
              </label>
              <textarea
                id="counter-message-input"
                rows={3}
                placeholder="Explain your counter price, service records, or terms..."
                value={counterMessage}
                onChange={(e) => setCounterMessage(e.target.value)}
                className={`w-full resize-y rounded-xl border border-white/15 bg-[#0A1628] p-3.5 text-sm text-white placeholder-[#8EA0B5] focus:border-[#2DD4BF] focus:outline-none ${focusRing}`}
              />
            </div>

            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submittingCounter}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-4 py-3 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] disabled:opacity-50 sm:text-sm ${focusRing}`}
              >
                <Repeat size={16} />
                <span>
                  {submittingCounter ? "Sending..." : "Send counter offer"}
                </span>
              </button>

              <button
                type="button"
                onClick={closeCounterModal}
                className={`rounded-xl border border-white/15 bg-[#102238] px-4 py-3 text-xs font-semibold text-[#C8D3E0] hover:text-white sm:text-sm ${focusRing}`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SellerOffers;