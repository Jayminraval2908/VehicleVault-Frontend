import React, { useEffect, useState } from "react";
import testDriveService from "../../services/testDriveService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.id || user?._id;

        if (!userId) {
          console.error("No User ID found");
          setLoading(false);
          return;
        }

        const res = await testDriveService.getBuyerBookings(userId);
        // Syncing with backend structure: res.data || res
        setBookings(res.data || res || []);
      } catch (err) {
        console.error("Booking Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm("Do you wish to cancel this scheduled test drive?")) {
      try {
        await testDriveService.cancelBooking(id); // Matches your controller deleteBooking
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("Booking cancelled successfully");
      } catch (err) {
        console.error("Cancellation Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message||"Cancellation failed.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            Test Drive <span className="text-[#D4AF37]">Schedule</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your physical vehicle inspections and sessions.</p>
        </header>

        {bookings.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-gray-800 rounded-3xl bg-[#111111]/50">
            <Calendar className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-600 italic">No drives scheduled yet. Experience the power behind the wheel.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => {
              const bookingDate = booking.preferred_date ? new Date(booking.preferred_date) : null;
               const status = booking.status?.toLowerCase();
              
              return (
                <Card key={booking._id} className="group relative overflow-hidden bg-[#111111]/40 hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />

                  <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                      {/* Date Block */}
                      <div className="bg-[#0D0D0D] p-4 rounded-2xl border border-gray-800 text-center min-w-[100px]">
                        <span className="block text-[#D4AF37] font-bold text-2xl">
                          {bookingDate ? bookingDate.getDate() : "—"}
                        </span>
                        <span className="block text-gray-500 text-xs uppercase tracking-widest font-black">
                          {bookingDate ? bookingDate.toLocaleString('default', { month: 'short' }) : "N/A"}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-gray-100 flex items-center justify-center md:justify-start gap-2 uppercase tracking-tight">
                          {typeof booking.vehicle_id === "object"
                            ? `${booking.vehicle_id?.make} ${booking.vehicle_id?.model}`
                            : "Premium Vehicle"}
                        </h3>
                        

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock size={14} className="text-[#D4AF37]" />
                            {typeof booking.preferred_time === "object" 
                              ? "Schedule Set" 
                              : booking.preferred_time}
                          </span>
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin size={14} className="text-[#D4AF37]" />
                            {typeof booking.location === "object"
                              ? booking.location?.address || "On-site"
                              : booking.location}
                          </span>
                          <span className="text-[10px] text-gray-600 font-mono font-bold bg-gray-900/50 px-2 py-0.5 rounded">
                            REF: #{(booking.vehicle_id?._id || booking.vehicle_id || "000000").slice(-6)}
                          </span>
                        </div>

                        {/* ✅ STATUS BADGE */}
                        <div
                          className={`mt-2 inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase
                          ${
                            status === "Approved"
                              ? "bg-green-500/10 text-green-500"
                              : status === "Rejected"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-[#D4AF37]/10 text-[#D4AF37]"
                          }`}
                        >
                          {status}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/buyer/bookings/${booking._id}`)}
                        className="flex-1 md:flex-none text-xs font-black tracking-widest"
                      >
                        DETAILS
                      </Button>
                     {status === "Pending" && (
                        <Button
                          variant="danger"
                          onClick={() => handleCancel(booking._id)}
                          className="flex-1 md:flex-none p-3 group-hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;