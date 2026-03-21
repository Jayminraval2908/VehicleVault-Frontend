import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import testDriveService from "../../services/testDriveService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Calendar, Clock, MapPin, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

const BookTestDrive = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "Main Showroom - Luxury Wing", // Default or static location
  });

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await testDriveService.bookTestDrive({
        vehicle_id: vehicleId,
        preferred_date: formData.date,
        preferred_time: formData.time,
        location: formData.location
      });
      toast.success("Test Drive Requested! The seller will confirm shortly.");
      navigate("/buyer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Scheduling failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 flex justify-center items-center">
      <Card className="max-w-xl w-full border-[#D4AF37]/10 shadow-2xl p-10">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-500 hover:text-[#D4AF37] mb-8 flex items-center gap-2 transition-all"
        >
          <ChevronLeft size={18} /> Back
        </button>

        <header className="mb-10 text-center">
          <div className="bg-[#D4AF37]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="text-[#D4AF37]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-widest">
            Schedule a <span className="text-[#D4AF37]">Drive</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Experience excellence on the road.</p>
        </header>

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Preferred Date"
              type="date"
              min={today}
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="invert-colors-logic" // You can style the date picker icon in CSS
            />
            <Input
              label="Preferred Time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <Input
            label="Viewing Location"
            value={formData.location}
            disabled
            className="opacity-60 cursor-not-allowed"
          />

          <div className="bg-[#1a1a1a] p-4 rounded-xl border-l-4 border-[#D4AF37]">
            <p className="text-xs text-gray-400 leading-relaxed">
              * Please ensure you carry a valid driver's license at the time of the test drive. 
              Confirmations are sent via email within 24 hours.
            </p>
          </div>

          <Button type="submit" className="w-full py-4 text-md font-bold shadow-gold">
            CONFIRM BOOKING
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookTestDrive;