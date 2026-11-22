import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, IndianRupee, Loader2, Send } from "lucide-react";
import { toast } from "react-toastify";
import offerService from "../../services/offerService";
import FormField, { inputClass } from "../../components/common/FormField";
import { display, focusRing } from "../../utils/theme";

const ROUTES = {
  inventory: "/buyer/inventory",
  offers: "/buyer/offers",
};

const MAX_AMOUNT = 1_000_000_000;
const MAX_MESSAGE = 300;
const DEFAULT_MESSAGE = "I am interested in purchasing this vehicle.";

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function SendOffer() {
  const params = useParams();
  const vehicleId = params.vehicleId || params.id;

  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const numericAmount = Number(amount);

  const goBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else if (vehicleId) {
      navigate(`/vehicle/${vehicleId}`);
    } else {
      navigate(ROUTES.inventory);
    }
  };

  const validate = () => {
    const next = {};

    if (!amount) {
      next.amount = { message: "Enter an offer amount" };
    } else if (numericAmount <= 0) {
      next.amount = { message: "The offer must be more than zero" };
    } else if (numericAmount > MAX_AMOUNT) {
      next.amount = { message: "That amount is too large" };
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!vehicleId) {
      toast.error("This vehicle could not be found.");
      return;
    }

    const found = validate();
    setErrors(found);
    if (found.amount) {
      document.getElementById("offer-amount")?.focus();
      return;
    }

    setLoading(true);
    try {
      await offerService.createOffer({
        vehicle_id: vehicleId,
        offer_amount: numericAmount,
        message: message.trim() || DEFAULT_MESSAGE,
      });

      toast.success("Offer sent to the seller");
      navigate(ROUTES.offers);
    } catch (err) {
      console.error("Send offer error:", err);
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        toast.error("You can’t send this offer. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Could not send the offer");
      }
    } finally {
      setLoading(false);
    }
  };

  const amountHint =
    amount && numericAmount > 0 && numericAmount <= MAX_AMOUNT
      ? `You’re offering ${rupees.format(numericAmount)}`
      : "Enter whole rupees, without commas.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1628] p-5 text-[#C8D3E0] sm:p-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0D1D33] p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={goBack}
          className={`group mb-8 flex items-center gap-2 text-sm text-[#8EA0B5] transition-colors hover:text-white ${focusRing}`}
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back to vehicle
        </button>

        <h1
          className="text-3xl font-bold text-white sm:text-4xl"
          style={display}
        >
          Make an offer
        </h1>
        <p className="mb-8 mt-3 text-[#C8D3E0]">
          Enter the price you’re willing to pay. The seller can accept or
          decline.
        </p>

        {!vehicleId ? (
          <div
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-400/5 p-6 text-center"
          >
            <p className="text-white">
              We couldn’t find which vehicle this offer is for.
            </p>
            <Link
              to={ROUTES.inventory}
              className={`mt-4 inline-block rounded-lg bg-[#2DD4BF] px-5 py-2.5 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              Browse inventory
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <FormField
              id="offer-amount"
              label="Offer amount (₹)"
              error={errors.amount}
              hint={amountHint}
            >
              <div className="relative">
                <IndianRupee
                  size={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2DD4BF]"
                />
                <input
                  id="offer-amount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (errors.amount) setErrors({});
                  }}
                  aria-invalid={!!errors.amount}
                  aria-describedby={errors.amount ? "offer-amount-error" : undefined}
                  className={`${inputClass(errors.amount)} py-3.5 pl-12 text-xl font-semibold tabular-nums`}
                />
              </div>
            </FormField>

            <FormField
              id="offer-message"
              label="Message to the seller (optional)"
            >
              <textarea
                id="offer-message"
                rows={3}
                maxLength={MAX_MESSAGE}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a note, such as when you could complete the purchase."
                className={`${inputClass(false)} resize-y`}
              />
              <p className="pt-1.5 text-right text-sm tabular-nums text-[#8EA0B5]">
                {message.length}/{MAX_MESSAGE}
              </p>
            </FormField>

            <div className="rounded-xl border border-white/10 bg-[#0A1628] p-4">
              <p className="text-sm font-semibold text-white">Before you send</p>
              <p className="mt-1 text-sm leading-relaxed text-[#C8D3E0]">
                An offer is not a purchase. The seller must accept it before
                anything is final.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={reduceMotion || loading ? undefined : { y: -2 }}
              whileTap={reduceMotion || loading ? undefined : { scale: 0.97 }}
              className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send offer
                </>
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}