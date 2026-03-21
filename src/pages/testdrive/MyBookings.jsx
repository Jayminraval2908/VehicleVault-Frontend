import React, { useEffect, useState } from "react";
import testDriveService from "../../services/testDriveService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Calendar, Clock, MapPin, Trash2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const data = await testDriveService.getBuyerBookings(user._id);
        setBookings(data.data || []);
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
        await testDriveService.cancelBooking(id);
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("Bookings cancelled")
      } catch (err) {
        toast.error("Cancellation failed.");
      }
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold">
            Test Drive <span className="text-[#D4AF37]">Schedule</span>
          </h1>
          <p className="text-gray-500 mt-2">Manage your physical vehicle inspections and sessions.</p>
        </header>

        {bookings.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-gray-800 rounded-3xl">
            <Calendar className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-600 italic">No drives scheduled yet. Experience the power behind the wheel.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking._id} className="group relative overflow-hidden">
                {/* Status Indicator */}
                <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37]" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    {/* Date Block */}
                    <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800 text-center min-w-[100px]">
                      <span className="block text-[#D4AF37] font-bold text-2xl">
                        {new Date(booking.preferred_date).getDate()}
                      </span>
                      <span className="block text-gray-500 text-xs uppercase tracking-widest">
                        {new Date(booking.preferred_date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-xl font-bold text-gray-100 flex items-center justify-center md:justify-start gap-2">
                         Vehicle ID: #{booking.vehicle_id?.slice(-6)}
                      </h3>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Clock size={14} className="text-[#D4AF37]" /> {booking.preferred_time}</span>
                        <span className="flex items-center gap-1"><MapPin size={14} className="text-[#D4AF37]" /> {booking.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      onClick={() =>  navigate(`/vehicle/${booking.vehicle_id}`)}
                      className="flex-1 md:flex-none"
                    >
                      DETAILS
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleCancel(booking._id)}
                      className="flex-1 md:flex-none p-3"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800/50 flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-[#D4AF37]" />
                  Verified Appointment Slot
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;