import React, { useEffect, useState } from "react";
import inquiryService from "../../services/inquiryService";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const SellerInquiries = () => {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);

  const [selectedInquiry, setselectedInquiry] = useState(true);
  const [replyMessage, setreplyMessage] = useState([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await inquiryService.getSellerInquiries();
      setInquiries(res.data || res);
    } catch (err) {
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleReply=async(id)=>{
    if (!replyMessage.trim()) {
      return toast.error("Reply cannot be empty");
    }

    try {
      await inquiryService.replyToInquiry(id,replyMessage);
      toast.success("Reply sent successfully");

      setreplyMessage("");
      setselectedInquiry(null);

      fetchInquiries();
      
    } catch (error) {
      toast.error("Failed to send reply");
    }
  }

  if (loading) return <Loader fullScreen />;

    return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#D4AF37]">
        Seller Inquiries
      </h1>

      {inquiries.length === 0 ? (
        <p className="text-gray-400">No inquiries yet</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              className="p-4 border border-gray-800 rounded-lg bg-[#111]"
            >
              <p className="text-sm text-gray-400">
                Vehicle: {inq.vehicle_id?.make} {inq.vehicle_id?.model}
              </p>

              <p className="text-sm text-gray-400">
                Buyer: {inq.buyer_id?.name}
              </p>

              <p className="mt-2 text-white">
                Message: {inq.message}
              </p>

              {/* ✅ SHOW REPLY IF EXISTS */}
              {inq.reply && (
                <p className="mt-2 text-green-400">
                  Reply: {inq.reply}
                </p>
              )}

              {/* ✅ REPLY BUTTON */}
              {!inq.reply && (
                <button
                  onClick={() => setselectedInquiry(inq._id)}
                  className="mt-3 px-3 py-1 bg-[#D4AF37] text-black rounded"
                >
                  Reply
                </button>
              )}

              {/* ✅ REPLY INPUT */}
              {selectedInquiry === inq._id && (
                <div className="mt-3">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setreplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full p-2 rounded bg-black border border-gray-700 text-white"
                  />

                  <button
                    onClick={() => handleReply(inq._id)}
                    className="mt-2 px-4 py-1 bg-green-600 rounded"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default SellerInquiries;




