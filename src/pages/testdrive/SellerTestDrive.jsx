import React, { useEffect, useState } from "react";
import testDriveService from "../../services/testDriveService";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const SellerTestDrives = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await testDriveService.getSellerBookings();
      setBookings(res);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await testDriveService.updateStatus(id, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-[#D4AF37]">
        Test Drive Requests
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-400">No requests yet</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const status = b.status?.toLowerCase();

            return (
              <div key={b._id} className="p-4 border border-gray-800 rounded-lg bg-[#111]">
                
                <p className="text-sm text-gray-400">
                  Vehicle: {b.vehicle_id?.make} {b.vehicle_id?.model}
                </p>

                <p className="text-sm text-gray-400">
                  Buyer: {b.buyer_id?.name}
                </p>

                <p className="text-sm text-gray-400">
                  Date: {new Date(b.preferred_date).toLocaleDateString()}
                </p>

                <p className="text-sm text-gray-400">
                  Time: {b.preferred_time}
                </p>

                <p className="text-sm text-gray-400">
                  Location: {b.location}
                </p>

                <p className="mt-2">
                  Status: <span className="capitalize">{status}</span>
                </p>

               

                {/* ✅ ACTION BUTTONS */}
                {status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => handleAction(b._id, "Approved")}>
                      Approve
                    </Button>
                    <Button variant="danger" onClick={() => handleAction(b._id, "Cancelled")}>
                      Reject
                    </Button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerTestDrives;