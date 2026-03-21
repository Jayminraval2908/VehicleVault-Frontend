import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import offerService from "../../services/offerService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { ArrowLeft, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const SendOffer = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOffer = async (e) => {
    e.preventDefault();

    
    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || amount.trim() === "") {
      toast.error("Please enter a valid numeric amount");
      return;
    }

    if (numericAmount <= 0) {
      toast.error("Offer amount must be greater than zero");
      return;
    }

    setLoading(true);
    try {
      // Amount must be a number for the backend
      await offerService.sendOffer({ 
        vehicle_id: vehicleId, 
        amount: numericAmount,
        status: "pending" 
      });
      toast.success("Luxury Offer Submitted Successfully!");
      navigate("/buyer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting offer");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex justify-center items-center">
      <Card className="max-w-md w-full border-[#D4AF37]/20 shadow-2xl">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-[#D4AF37] mb-6 flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={18} /> Back to Vehicle
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">
          Make an <span className="text-[#D4AF37]">Offer</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Enter your best price. High-value offers are prioritized by sellers.
        </p>

        <form onSubmit={handleOffer} className="space-y-6">
          <div className="relative">
            <div className="absolute left-4 top-10 text-[#D4AF37]">
               <DollarSign size={20} />
            </div>
            <Input
              label="Offer Amount ($)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 py-3 text-xl font-bold text-[#D4AF37]"
              required
            />
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Notice</p>
            <p className="text-sm text-gray-400">
              Submitting an offer does not guarantee a purchase. The seller must approve the transaction.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-lg tracking-widest"
            disabled={!amount || amount <= 0}
          >
            SUBMIT BID
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SendOffer;