import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import inquiryService from "../../services/inquiryService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";
import {
  Plus,
  Edit3,
  Trash2,
  MessageCircle,
  Eye,
  BarChart3,
  Car,
  ClipboardCheck
} from "lucide-react";

const SellerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const vehiclesData = await vehicleService.getSellerVehicles();
        setVehicles(vehiclesData.data || []);

        const inquiryPromises = (vehiclesData.data || []).map((v) =>
          inquiryService.getInquiriesByVehicle(v._id)
        );

        const inquiryResults = await Promise.all(inquiryPromises);

        const allInquiries = inquiryResults
          .map((res) => res.data || [])
          .flat();

        setInquiries(allInquiries);
      } catch (err) {
        console.error("Seller Data Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();

    const interval = setInterval(fetchSellerData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v._id !== id));
    }
  };

  const handlePublish = async (id) => {
    try {
      await vehicleService.publishVehicle(id);
      toast.success("Vehicle sent to admin for approval 🚀");

      setVehicles(prev =>
        prev.map(v =>
          v._id === id ? { ...v, status: "Pending" } : v
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish vehicle");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-4 sm:p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter">
              Seller <span className="text-[#D4AF37]">Console</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your luxury inventory and incoming leads.
            </p>
          </div>

          <Link to="/seller/add-vehicle">
            <Button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
              <Plus size={20} /> LIST NEW VEHICLE
            </Button>
          </Link>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          <StatBox icon={<Car />} label="Live Listings" count={vehicles.length} />
          <StatBox icon={<MessageCircle />} label="Total Inquiries" count={inquiries.length} />
          <StatBox icon={<BarChart3 />} label="Avg. Engagement" count={`${vehicles.length > 0 ? (inquiries.length / vehicles.length).toFixed(1) : 0}x`} />
        </div>

        {/* INVENTORY TABLE */}
        <Card className="border-gray-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111111]">
            <h3 className="text-lg font-bold uppercase tracking-widest text-[#D4AF37]">
              Active Inventory
            </h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              Update Frequency: Real-time
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D0D0D] text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                  <th className="p-3 sm:p-6 whitespace-nowrap">Vehicle Details</th>
                  <th className="p-3 sm:p-6 whitespace-nowrap">Price</th>
                  <th className="p-3 sm:p-6 whitespace-nowrap">Status</th>
                  <th className="p-3 sm:p-6 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">
                {vehicles.map((car) => (
                  <tr key={car._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-3 sm:p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 sm:w-16 h-10 sm:h-12 bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
                          <img
                            src={car.images?.[0]}
                            alt={car.model}
                            className="w-full h-full object-cover opacity-60"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase text-xs sm:text-sm">
                            {car.make} {car.model}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            ID: {car._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-6 font-mono text-[#D4AF37] text-xs sm:text-base">
                      Rs.{car.price?.toLocaleString()}
                    </td>

                    <td className="p-3 sm:p-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase
                        ${car.status === "Pending" && "bg-yellow-500/10 text-yellow-400"}
                        ${car.status === "Approved" && "bg-green-500/10 text-green-500"}
                        ${car.status === "Rejected" && "bg-red-500/10 text-red-400"}
                        ${car.status === "Sold" && "bg-blue-500/10 text-blue-400"}
                      `}>
                        {car.status}
                      </span>
                    </td>

                    <td className="p-3 sm:p-6">
                      <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
                        <Link to={`/seller/add-inspection/${car._id}`}>
                          <button className="p-2 text-gray-500 hover:text-blue-400 transition">
                            <ClipboardCheck size={18} />
                          </button>
                        </Link>

                        <Link to={`/vehicle/${car._id}`}>
                          <button className="p-2 text-gray-500 hover:text-white transition">
                            <Eye size={18} />
                          </button>
                        </Link>

                        <Link to={`/seller/edit-vehicle/${car._id}`}>
                          <button className="p-2 text-gray-500 hover:text-[#D4AF37] transition">
                            <Edit3 size={18} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(car._id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>

                        {car.status === "Draft" && (
                          <button
                            onClick={() => handlePublish(car._id)}
                            className="p-2 text-gray-500 hover:text-green-400 transition"
                            title="Publish"
                          >
                            🚀
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vehicles.length === 0 && (
              <div className="p-10 sm:p-20 text-center text-gray-600 italic text-xs sm:text-sm">
                No vehicles listed yet. Start by clicking "List New Vehicle".
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ================= STAT BOX ================= */
const StatBox = ({ icon, label, count }) => (
  <div className="bg-[#111111] border border-gray-800 p-4 sm:p-6 rounded-2xl flex items-center gap-4 sm:gap-6">
    <div className="bg-[#D4AF37]/10 p-3 sm:p-4 rounded-xl text-[#D4AF37]">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-bold text-white">{count}</p>
    </div>
  </div>
);

export default SellerDashboard;