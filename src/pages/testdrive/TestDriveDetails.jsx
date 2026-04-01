import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import testDriveService from "../../services/testDriveService";

const TestDriveDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await testDriveService.getBookingById(id);
                setBooking(res.data || res);
            } catch (err) {
                console.error("Failed to load details", err);
            }
        };
        fetchDetails();
    }, [id]);

    if (!booking) return <p>Loading details...</p>;

    return (
  <div className="min-h-screen bg-[#0D0D0D] text-white px-4 md:px-10 py-10">
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-10 border-b border-gray-800 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold">
          Test Drive <span className="text-[#D4AF37]">Details</span>
        </h1>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Review your scheduled premium vehicle experience
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#111111] border border-gray-800 rounded-3xl p-6 md:p-10 shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300">

        {/* Vehicle Name */}
        <h2 className="text-2xl md:text-3xl font-semibold text-[#D4AF37] mb-6">
          {typeof booking.vehicle_id === "object"
            ? `${booking.vehicle_id.make} ${booking.vehicle_id.model}`
            : booking.vehicle_id}
        </h2>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">

          {/* Date */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <p className="text-gray-500 text-sm mb-1">Date</p>
            <p className="font-medium text-white">
              {new Date(booking.preferred_date).toLocaleDateString()}
            </p>
          </div>

          {/* Time */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
            <p className="text-gray-500 text-sm mb-1">Time</p>
            <p className="font-medium text-white">
              {typeof booking.preferred_time === "object"
                ? JSON.stringify(booking.preferred_time)
                : booking.preferred_time}
            </p>
          </div>

          {/* Location */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 md:col-span-2">
            <p className="text-gray-500 text-sm mb-1">Location</p>
            <p className="font-medium text-white">
              {typeof booking.location === "object"
                ? booking.location.address || booking.location.city
                : booking.location}
            </p>
          </div>

          {/* Status */}
          <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 md:col-span-2 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <p className="font-medium text-white capitalize">
                {booking.status}
              </p>
            </div>

            {/* Status Badge */}
            <span className="px-4 py-1 rounded-full text-sm font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
              {booking.status}
            </span>
          </div>

        </div>

      </div>
    </div>
  </div>
);
};

export default TestDriveDetails;