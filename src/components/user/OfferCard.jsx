import React from "react";
import Card from "../common/Card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

export default function OfferCard({ offer, onCancel }) {
  const isPending = offer.status === "pending";

  return (
    <Card className="flex items-center justify-between border-gray-800 hover:border-[#D4AF37]/30">
      <div className="flex items-center gap-4">
        <div className="bg-[#D4AF37]/10 p-3 rounded-xl text-[#D4AF37]">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Your Bid</p>
          <h4 className="text-xl font-black text-white">${offer.amount?.toLocaleString()}</h4>
        </div>
      </div>

      <div className="text-right">
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-md mb-2 ${offer.status === 'accepted' ? 'text-green-500 bg-green-500/10' : 'text-[#D4AF37] bg-[#D4AF37]/10'
          }`}>
          {isPending ? <Clock size={12} /> : <TrendingUp size={12} />}
          {offer.status}
        </div>
        {isPending && (
          <button
            onClick={() => onCancel(offer._id)}
            className="text-[10px] text-red-500 hover:underline uppercase font-bold"
          >
            Withdraw
          </button>
        )}
      </div>
    </Card>
  );
}