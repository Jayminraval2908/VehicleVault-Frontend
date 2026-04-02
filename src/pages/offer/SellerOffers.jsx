import React, { useEffect, useState } from "react";
import offerService from "../../services/offerService";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, IndianRupeeIcon } from "lucide-react";

const SellerOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

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
      await offerService.updateOfferStatus(id, {
        status,
        seller_response: responseMessage
      });

      toast.success(`Offer ${status}`);
      setSelectedOffer(null);
      setResponseMessage("");
      fetchOffers();
    } catch (err) {
      toast.error("Failed to update offer");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#D4AF37]">
        Seller Offers
      </h1>

      {offers.length === 0 ? (
        <p className="text-gray-400">No offers yet</p>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="p-4 border border-gray-800 rounded-lg bg-[#111]"
            >
              <p className="text-sm text-gray-400">
                Vehicle: {offer.vehicle_id?.make} {offer.vehicle_id?.model}
              </p>

              <p className="text-sm text-gray-400">
                Buyer: {offer.buyer_id?.name}
              </p>

              <p className="mt-2 text-white flex items-center gap-2">
                <IndianRupeeIcon size={16} />
                Offer: ₹{offer.offered_amount}
              </p>

              {/* STATUS */}
              <p className="mt-2 text-sm">
                Status:{" "}
                <span
                  className={`${
                    offer.status === "Accepted"
                      ? "text-green-400"
                      : offer.status === "Rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {offer.status}
                </span>
              </p>

              {/* SELLER RESPONSE */}
              {offer.seller_response && (
                <p className="mt-2 text-green-400">
                  Response: {offer.seller_response}
                </p>
              )}

              {/* ACTION BUTTONS */}
              {offer.status === "Pending" && (
                <>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setSelectedOffer(offer._id)}
                      className="px-3 py-1 bg-[#D4AF37] text-black rounded"
                    >
                      Respond
                    </button>
                  </div>

                  {selectedOffer === offer._id && (
                    <div className="mt-3">
                      <textarea
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        placeholder="Write response..."
                        className="w-full p-2 rounded bg-black border border-gray-700"
                      />

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleUpdate(offer._id, "Accepted")}
                          className="px-4 py-1 bg-green-600 rounded flex items-center gap-1"
                        >
                          <CheckCircle size={16} /> Accept
                        </button>

                        <button
                          onClick={() => handleUpdate(offer._id, "Rejected")}
                          className="px-4 py-1 bg-red-600 rounded flex items-center gap-1"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOffers;