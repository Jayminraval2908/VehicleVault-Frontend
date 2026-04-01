import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inquiryService from "../../services/inquiryService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "react-toastify";

const SendInquiry = () => {
  // 🚩 Ensure this matches the parameter name in your App.js route (e.g., :vehicleId)
  const { vehicleId } = useParams(); 
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return toast.error("Please enter a message before sending.");
    }

    setLoading(true);
    try {
      // 🚩 Sending the inquiry to the owner as shown in the UI
      await inquiryService.sendInquiry({ 
        vehicle_id: vehicleId, 
        message: message 
      });
      
      toast.success("Inquiry Sent to the Vault Owner!");
      navigate(-1);
    } catch (err) {
    // 🚩 Provide specific feedback for the 403 error
    if (err.response?.status === 403) {
      toast.error("You are not authorized to send this inquiry. Please re-login.");
    } else {
      toast.error("Error sending inquiry");
    }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-[#111111] border border-[#D4AF37]/20 p-10 rounded-2xl shadow-2xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-[#D4AF37] mb-8 flex items-center gap-2 transition-all text-sm uppercase tracking-widest font-bold"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Title and Subtitle */}
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-2 tracking-tight">Vehicle Inquiry</h1>
        <p className="text-gray-400 mb-10 text-lg">Send a premium inquiry to the vehicle owner.</p>

        <form onSubmit={handleSend} className="flex flex-col gap-8">
          {/* Inquiry Message Input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 mb-1">
              Inquiry Message
            </label>
            <textarea
              className="w-full bg-[#0D0D0D] border border-gray-800 rounded-xl p-5 text-white focus:border-[#D4AF37] outline-none transition-all h-48 resize-none text-lg placeholder:text-gray-700"
              placeholder="Describe your interest in this vehicle..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {/* Send Button */}
          <Button 
            type="submit" 
            className="flex items-center justify-center gap-3 py-6 text-lg font-black tracking-widest"
            disabled={!message.trim()}
          >
            <Send size={20} /> SEND INQUIRY
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SendInquiry;