import React from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import inquiryService from "../../services/inquiryService";
import InquiryForm from "../../components/user/Inquiryform";
import { display, focusRing } from "../../utils/theme";

const ROUTES = {
  inventory: "/buyer/inventory",
};

export default function SendInquiry() {
  const params = useParams();
  const vehicleId = params.vehicleId || params.id;

  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const goBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else if (vehicleId) {
      navigate(`/vehicle/${vehicleId}`);
    } else {
      navigate(ROUTES.inventory);
    }
  };

  const handleSend = async (message) => {
    if (!vehicleId) {
      toast.error("This vehicle could not be found.");
      return false;
    }

    try {
      await inquiryService.sendInquiry({ vehicle_id: vehicleId, message });
      toast.success("Inquiry sent to the seller");
      goBack();
      return true;
    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        toast.error("You can’t send this inquiry. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Could not send the inquiry");
      }
      return false;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A1628] p-5 text-[#C8D3E0] sm:p-8">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0D1D33] p-6 shadow-2xl sm:p-10"
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
          Back
        </button>

        <h1
          className="text-3xl font-bold text-white sm:text-4xl"
          style={display}
        >
          Ask the seller
        </h1>
        <p className="mb-8 mt-3 text-[#C8D3E0]">
          Your question goes to the seller of this vehicle. Replies appear
          under My inquiries.
        </p>

        {vehicleId ? (
          <InquiryForm onSubmit={handleSend} />
        ) : (
          <div
            role="alert"
            className="rounded-xl border border-red-400/30 bg-red-400/5 p-6 text-center"
          >
            <p className="text-white">We couldn’t find which vehicle this is for.</p>
            <Link
              to={ROUTES.inventory}
              className={`mt-4 inline-block rounded-lg bg-[#2DD4BF] px-5 py-2.5 font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              Browse inventory
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}