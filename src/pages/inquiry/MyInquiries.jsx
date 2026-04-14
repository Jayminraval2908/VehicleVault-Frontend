import React, { useEffect, useState } from "react";
import inquiryService from "../../services/inquiryService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { Trash2, ExternalLink, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          toast.warn("Please login to view your inquiries");
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user._id || user.id;

        const response = await inquiryService.getInquiriesByBuyer(userId);

        // Handle potential nested data structure from Axios
        const data = response.data?.data || response.data || [];
        setInquiries(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Unable to load inquiries at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this inquiry?")) {
      try {
        await inquiryService.deleteInquiry(id);
        setInquiries(prev => prev.filter((iq) => iq._id !== id));
        toast.success("Inquiry successfully removed!");
      } catch (err) {
        toast.error("Failed to delete inquiry. Please try again.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-10 uppercase tracking-tighter">
          My <span className="text-[#D4AF37]">Inquiries</span>
        </h1>

        {inquiries.length === 0 ? (
          <div className="border border-dashed border-gray-800 p-20 text-center rounded-3xl text-gray-500 bg-[#111111]/30">
            No active inquiries found in your vault.
          </div>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((iq) => (
              <div
                key={iq._id}
                className="bg-[#111111] border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#D4AF37]/40 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start gap-5 flex-1">
                  <div className="bg-[#D4AF37]/10 p-4 rounded-xl shrink-0">
                    <MessageCircle className="text-[#D4AF37]" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-100 uppercase tracking-tight">
                      {iq.vehicle_id?.make ? `${iq.vehicle_id.make} ${iq.vehicle_id.model}` : `Vehicle #${iq.vehicle_id?._id?.slice(-6) || 'Unknown'}`}
                    </h3>
                    
                    <p className="text-sm text-gray-500 italic mt-1 line-clamp-2 leading-relaxed">
                      "{iq.message}"
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Status</span>
                         <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            iq.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" : 
                            iq.status === "Accepted" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}>
                            {iq.status}
                          </span>
                      </div>
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        Sent: {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {iq.reply && (
                      <div className="mt-5 bg-green-500/5 border border-green-500/20 p-4 rounded-xl relative">
                        <span className="absolute -top-2 left-3 px-2 bg-[#111] text-green-500 text-[9px] font-black uppercase tracking-widest">
                          Official Reply
                        </span>
                        {/* Scrollable reply area for long text */}
                        <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                           <p className="text-sm text-gray-300 leading-relaxed italic">
                             {iq.reply}
                           </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
                  <Link to={`/vehicle/${iq.vehicle_id?._id || iq.vehicle_id}`} className="flex-1">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-gray-700 text-xs font-bold uppercase tracking-widest py-3">
                      <ExternalLink size={14} /> View Car
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(iq._id)}
                    className="flex-1 md:flex-none p-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInquiries;