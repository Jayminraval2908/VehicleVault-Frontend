import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inquiryService from "../../services/inquiryService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "react-toastify";

const SendInquiry = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await inquiryService.sendInquiry({ vehicle_id: vehicleId, message });
      toast.success("Inquiry Sent Successfully");
      navigate(-1);
    } catch (err) {
      toast.error("Error sending inquiry");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#111111] border border-gray-800 p-8 rounded-2xl shadow-xl">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition">
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">Vehicle Inquiry</h1>
        <p className="text-gray-400 mb-8">Send a premium inquiry to the vehicle owner.</p>

        <form onSubmit={handleSend} className="flex flex-col gap-6">
          {/* Using your custom Input component */}
          <Input 
            label="Inquiry Message" 
            placeholder="Describe your interest in this vehicle..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32" // Added height for message area
          />

          <Button type="submit" className="flex items-center justify-center gap-2">
            <Send size={18} /> SEND INQUIRY
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SendInquiry;