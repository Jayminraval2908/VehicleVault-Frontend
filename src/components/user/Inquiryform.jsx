import React, { useState } from "react";
import Button from "../common/Button";
import { Send, MessageCircle } from "lucide-react";

export default function InquiryForm({ onSubmit, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) onSubmit(message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle size={16} className="text-[#D4AF37]" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Message to Seller</span>
      </div>
      <textarea
        className="w-full bg-[#0D0D0D] border border-gray-800 rounded-2xl p-4 text-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all h-32 resize-none"
        placeholder="Request more details or history about this asset..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <Button type="submit" className="w-full py-3 flex justify-center gap-2" disabled={loading}>
        <Send size={16} /> SEND INQUIRY
      </Button>
    </form>
  );
}import React, { useState } from "react";
import Button from "../common/Button";
import { Send, MessageCircle } from "lucide-react";

export default function InquiryForm({ onSubmit, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) onSubmit(message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle size={16} className="text-[#D4AF37]" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Message to Seller</span>
      </div>
      <textarea
        className="w-full bg-[#0D0D0D] border border-gray-800 rounded-2xl p-4 text-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all h-32 resize-none"
        placeholder="Request more details or history about this asset..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <Button type="submit" className="w-full py-3 flex justify-center gap-2" disabled={loading}>
        <Send size={16} /> SEND INQUIRY
      </Button>
    </form>
  );
}