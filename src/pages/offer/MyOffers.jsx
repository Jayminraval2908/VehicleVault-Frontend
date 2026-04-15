import React, { useEffect, useState } from "react";
import offerService from "../../services/offerService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Trash2, Clock, CheckCircle, XCircle, IndianRupeeIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOffers = async () => {
      try {
        const res = await offerService.getBuyerOffers();
        setOffers(res.data || res);
      } catch {
        toast.error("Could not load your offers.");
      } finally {
        setLoading(false);
      }
    };
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

  const handleConfirmDeal = async (id) => {
    try {
      const res = await offerService.confirmDeal(id);
      const updatedOffer = res.data.data;

      setOffers((prev) =>
        prev.map((o) => (o._id === id ? updatedOffer : o))
      );

      toast.success("Deal confirmed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm deal");
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { color: "text-green-500", icon: <CheckCircle size={14} />, bg: "bg-green-500/10" };
      case "rejected":
        return { color: "text-red-500", icon: <XCircle size={14} />, bg: "bg-red-500/10" };
      default:
        return { color: "text-[#D4AF37]", icon: <Clock size={14} />, bg: "bg-[#D4AF37]/10" };
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 bg-[#0D0D0D] min-h-screen text-white">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            My <span className="text-[#D4AF37]">Bids & Offers</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Track your negotiations for premium vehicles.
          </p>
        </header>

        {/* EMPTY STATE */}
        {offers.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
            <p className="text-gray-600 italic text-sm">
              No offers placed yet. Time to find your next ride!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {offers.map((offer) => {
              const status = getStatusStyle(offer.status);

              return (
                <Card
                  key={offer._id}
                  className="flex flex-col gap-5 p-4 sm:p-6"
                >

                  {/* TOP SECTION */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* ICON */}
                    <div className="bg-[#D4AF37] p-3 sm:p-4 rounded-xl text-black w-fit">
                      <IndianRupeeIcon size={24} />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold">
                        ₹ {offer.offered_amount?.toLocaleString() || "0"}
                      </h3>

                      <p className="text-xs text-gray-500">
                        ID: #{offer._id.slice(-6)}
                      </p>

                      {/* STATUS */}
                      <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${status.bg} ${status.color}`}>
                        {status.icon} {offer.status || "Pending"}
                      </div>

                      {/* DEAL STATES */}
                      {offer.dealStatus === "deal_locked" && (
                        <p className="mt-2 text-green-400 text-xs sm:text-sm">
                          🔒 Deal Confirmed
                        </p>
                      )}

                      {offer.buyerConfirmed && offer.dealStatus !== "deal_locked" && (
                        <p className="mt-2 text-blue-400 text-xs sm:text-sm">
                          ⏳ Waiting for Seller...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CONTACT */}
                  {offer.dealStatus === "deal_locked" && (
                    <div className="bg-green-900/20 border border-green-700 p-3 rounded-lg text-sm">
                      <p className="text-green-400 font-semibold mb-1">Seller Contact</p>
                      <p className="text-xs">📞 {offer.seller_id?.phone || "N/A"}</p>
                      <p className="text-xs">✉️ {offer.seller_id?.email || "N/A"}</p>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-3">

                    {/* WITHDRAW */}
                    {offer.status?.toLowerCase() === "pending" && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelOffer(offer._id)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                      >
                        <Trash2 size={14} /> Withdraw
                      </Button>
                    )}

                    {/* VIEW */}
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        const vId = offer.vehicle_id?._id || offer.vehicle_id;
                        if (vId) navigate(`/vehicle/${vId}`);
                        else toast.error("Vehicle not found");
                      }}
                    >
                      View Vehicle
                    </Button>

                    {/* CONFIRM DEAL */}
                    {offer.dealStatus === "offer_accepted" && !offer.buyerConfirmed && (
                      <Button
                        variant="primary"
                        className="w-full sm:w-auto"
                        onClick={() => handleConfirmDeal(offer._id)}
                      >
                        Confirm Deal
                      </Button>
                    )}

                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOffers;