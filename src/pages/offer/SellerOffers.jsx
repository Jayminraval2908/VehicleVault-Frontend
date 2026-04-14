import React, { useEffect, useState } from "react";
import offerService from "../../services/offerService";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, IndianRupeeIcon, Lock } from "lucide-react";

const SellerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await offerService.getSellerOffers();
      setOffers(res);
    } catch (err) {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      // Logic: Removed responseMessage state, sending status directly
      const autoResponse = status === "Accepted" 
        ? "I accept your offer. Let's proceed with the deal." 
        : "I cannot accept this offer at this time.";

      await offerService.updateOfferStatus(id, {
        status,
        seller_response: autoResponse
      });

      toast.success(`Offer ${status}`);
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update offer");
    }
  };

  // const handleConfirmDeal = async (id) => {
  //   try {
  //     const res = await offerService.confirmDeal(id);
  //     const updatedOffer = res.data.data;

  //     setOffers((prev) =>
  //       prev.map((o) => (o._id === id ? updatedOffer : o))
  //     );

  //     toast.success(res.data.message || "Deal updated");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Failed to confirm deal");
  //   }
  // };

  const handleConfirmDeal = async (id) => {
  try {
    const res = await offerService.confirmDeal(id);

    // 🚩 The fix is here:
    // We merge the new data (dealStatus, etc.) with the old data (populated buyer info)
    const updatedDataFromServer = res.data.data;

    setOffers((prev) =>
      prev.map((o) => 
        o._id === id 
          ? { ...o, ...updatedDataFromServer } // Keep existing populated fields like buyer_id
          : o
      )
    );

    toast.success(res.data.message || "Deal updated");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to confirm deal");
  }
};

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-10 text-[#D4AF37] uppercase tracking-tighter">
          Seller <span className="text-white">Offers</span>
        </h1>

        {offers.length === 0 ? (
          <div className="border border-dashed border-gray-800 p-20 text-center rounded-2xl text-gray-500 bg-[#111]/30">
            No offers received in your vault yet.
          </div>
        ) : (
          <div className="space-y-6">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="p-6 border border-gray-800 rounded-2xl bg-[#111] hover:border-[#D4AF37]/30 transition-all shadow-2xl"
              >
                {/* Header Information */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 uppercase tracking-tight">
                      {offer.vehicle_id?.make} {offer.vehicle_id?.model}
                    </h3>
                    <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest mt-1">
                      Buyer: {offer.buyer_id?.name}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${
                    offer.status === 'Accepted' ? 'bg-green-500/10 text-green-500' : 
                    offer.status === 'Rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {offer.status}
                  </span>
                </div>

                {/* Offer Amount Display */}
                <div className="bg-black/40 p-5 rounded-2xl border border-gray-800/50 mb-6 flex items-center gap-3">
                  <div className="bg-[#D4AF37]/10 p-2 rounded-lg text-[#D4AF37]">
                    <IndianRupeeIcon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Offered Amount</p>
                    <p className="text-2xl font-black text-white">₹{offer.offered_amount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Deal Confirmation Section */}
                {offer.dealStatus === "deal_locked" && (
                  <div className="mb-6 p-5 bg-green-950/20 border border-green-500/20 rounded-2xl ">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock size={16} className="text-green-500" />
                      <p className="text-green-500 text-xs font-black uppercase tracking-widest">Deal Confirmed & Locked</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Buyer Phone</p>
                        <p className="text-sm font-medium">{offer.buyer_id?.phone || 'Not Shared'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">Buyer Email</p>
                        <p className="text-sm font-medium">{offer.buyer_id?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions: Accept/Reject (Only for Pending) */}
                {offer.status === "Pending" && (
                  <div className="flex gap-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleUpdate(offer._id, "Accepted")}
                      className="flex-1 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white border border-green-600/20 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xs tracking-widest"
                    >
                      <CheckCircle size={18} /> Accept Offer
                    </button>
                    <button
                      onClick={() => handleUpdate(offer._id, "Rejected")}
                      className="flex-1 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/20 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all uppercase text-xs tracking-widest"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                )}

                {/* Final Confirmation Button (After acceptance) */}
                {offer.dealStatus === "offer_accepted" && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleConfirmDeal(offer._id)}
                      disabled={!offer.buyerConfirmed || offer.sellerConfirmed}
                      className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                        !offer.buyerConfirmed 
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
                      }`}
                    >
                      {!offer.buyerConfirmed
                        ? "Waiting for Buyer Confirmation..."
                        : offer.sellerConfirmed
                          ? "Deal Fully Confirmed"
                          : "Click to Confirm Final Deal"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOffers;
