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
        // ✅ Using toastify success
        toast.success("Inquiry successfully removed!");
      } catch (err) {
        toast.error("Failed to delete inquiry. Please try again.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-[#D4AF37]">Inquiries</span>
        </h1>

        {inquiries.length === 0 ? (
          <div className="border border-dashed border-gray-800 p-20 text-center rounded-2xl text-gray-500">
            No active inquiries found in your vault.
          </div>
        ) : (
          <div className="grid gap-4">
            {inquiries.map((iq) => (
              <div 
                key={iq._id} 
                className="bg-[#111111] border border-gray-800 p-6 rounded-2xl flex justify-between items-center hover:border-[#D4AF37]/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#D4AF37]/10 p-3 rounded-xl">
                    <MessageCircle className="text-[#D4AF37]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200">
                      {iq.vehicle_id?.make ? `${iq.vehicle_id.make} ${iq.vehicle_id.model}` : `Vehicle #${iq.vehicle_id?._id?.slice(-6) || 'Unknown'}`}
                    </h3>
                    <p className="text-sm text-gray-500 truncate max-w-md italic">
                      "{iq.message}"
                    </p>
                    <p className="text-[10px] text-gray-600 uppercase mt-1">
                      Sent on: {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/vehicle/${iq.vehicle_id?._id || iq.vehicle_id}`}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <ExternalLink size={16} /> View Car
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDelete(iq._id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition"
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