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
        // 🚩 Your controller returns { data: offers }, so access it correctly
        setOffers(res.data || res);
      } catch (err) {
        toast.error("Could not load your offers.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOffers();
  }, []);

  const handleCancelOffer = async (id) => {
    if (window.confirm("Are you sure you want to withdraw this bid?")) {
      try {
        await offerService.deleteOffer(id);
        setOffers(offers.filter((o) => o._id !== id));
        toast.success("Offer withdrawn successfully");
      } catch (err) {
        toast.error("Failed to withdraw offer");
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return { color: "text-green-500", icon: <CheckCircle size={16} />, bg: "bg-green-500/10" };
      case "rejected":
        return { color: "text-red-500", icon: <XCircle size={16} />, bg: "bg-red-500/10" };
      default:
        return { color: "text-[#D4AF37]", icon: <Clock size={16} />, bg: "bg-[#D4AF37]/10" };
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My <span className="text-[#D4AF37]">Bids & Offers</span></h1>
          <p className="text-gray-500">Track your negotiations for premium vehicles.</p>
        </header>

        {offers.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl">
            <p className="text-gray-600 italic">No offers placed yet. Time to find your next ride!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {offers.map((offer) => {
              const status = getStatusStyle(offer.status);
              return (
                <Card key={offer._id} className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#D4AF37] p-4 rounded-2xl text-black">
                      <IndianRupeeIcon size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100">
                        Rs. {offer.offered_amount?.toLocaleString() || "0"}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">ID: #{offer._id.slice(-8)}</p>

                      <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${status.bg} ${status.color}`}>
                        {status.icon} {offer.status || "Pending"}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    {offer.status?.toLowerCase() === "pending" && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancelOffer(offer._id)}
                        className="flex-1 md:flex-none flex items-center gap-2 px-6"
                      >
                        <Trash2 size={16} /> WITHDRAW
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1 md:flex-none"
                      onClick={() => {
                        // 🚩 Logic: Determine if it's an object or just a string
                        const vId = offer.vehicle_id?._id || offer.vehicle_id;

                        if (vId) {
                          navigate(`/vehicle/${vId}`);
                        } else {
                          toast.error("Vehicle details are unavailable");
                        }
                      }}
                    >
                      VIEW VEHICLE
                    </Button>
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