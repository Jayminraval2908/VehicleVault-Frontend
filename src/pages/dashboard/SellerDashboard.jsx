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

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const vehiclesData = await vehicleService.getSellerVehicles();
        const vehicleList = vehiclesData.data || [];

        setVehicles(vehicleList);

        const inquiryPromises = vehicleList.map((v) =>
          inquiryService.getInquiriesByVehicle(v._id)
        );

        const inquiryResults = await Promise.all(inquiryPromises);

        const allInquiries = inquiryResults
          .map((res) => res.data || [])
          .flat();

        setInquiries(allInquiries);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();

    const interval = setInterval(fetchSellerData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this listing?")) {
      await vehicleService.deleteVehicle(id);
      setVehicles((prev) => prev.filter(v => v._id !== id));
    }
  };

  const handlePublish = async (id) => {
    try {
      await vehicleService.publishVehicle(id);
      toast.success("Sent for approval 🚀");

      setVehicles(prev =>
        prev.map(v =>
          v._id === id ? { ...v, status: "Pending" } : v
        )
      );
    } catch {
      toast.error("Publish failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white px-4 sm:px-6 md:px-10 py-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
              Seller <span className="text-[#D4AF37]">Console</span>
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your inventory & leads
            </p>
          </div>

          <Link to="/seller/add-vehicle" className="w-full md:w-auto">
            <Button className="w-full md:w-auto flex justify-center items-center gap-2">
              <Plus size={18} /> List Vehicle
            </Button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatBox icon={<Car />} label="Listings" count={vehicles.length} />
          <StatBox icon={<MessageCircle />} label="Inquiries" count={inquiries.length} />
          <StatBox
            icon={<BarChart3 />}
            label="Engagement"
            count={`${vehicles.length > 0 ? (inquiries.length / vehicles.length).toFixed(1) : 0}x`}
          />
        </div>

        {/* MOBILE VIEW */}
        <div className="space-y-4 md:hidden">
          {vehicles.length > 0 ? (
            vehicles.map((car) => (
              <Card key={car._id} className="p-4 space-y-4">

                <div className="flex gap-4">
                  <img
                    src={car.images?.[0]}
                    alt={car.model}
                    className="w-24 h-16 object-cover rounded-lg"
                  />

                  <div>
                    <p className="font-bold">{car.make} {car.model}</p>
                    <p className="text-xs text-gray-500">
                      ₹ {car.price?.toLocaleString()}
                    </p>

                    <span className="text-xs mt-1 inline-block">
                      {car.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <IconBtn to={`/vehicle/${car._id}`} icon={<Eye size={16} />} />
                  <IconBtn to={`/seller/edit-vehicle/${car._id}`} icon={<Edit3 size={16} />} />
                  <IconBtn to={`/seller/add-inspection/${car._id}`} icon={<ClipboardCheck size={16} />} />

                  <button onClick={() => handleDelete(car._id)} className="bg-red-600 p-2 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>

                {car.status === "Draft" && (
                  <Button onClick={() => handlePublish(car._id)} className="w-full">
                    Publish 🚀
                  </Button>
                )}

              </Card>
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <Card className="p-0 overflow-hidden border-gray-800">

            <div className="p-4 border-b border-gray-800 flex justify-between bg-[#111]">
              <h3 className="text-sm font-bold text-[#D4AF37]">Inventory</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-500 text-xs">
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {vehicles.map((car) => (
                    <tr key={car._id} className="border-t border-gray-800">
                      <td className="p-4 flex gap-3 items-center">
                        <img
                          src={car.images?.[0]}
                          className="w-14 h-10 rounded object-cover"
                        />
                        <div>
                          <p>{car.make} {car.model}</p>
                          <p className="text-xs text-gray-500">{car._id.slice(-6)}</p>
                        </div>
                      </td>

                      <td className="p-4 text-[#D4AF37]">
                        ₹ {car.price?.toLocaleString()}
                      </td>

                      <td className="p-4">{car.status}</td>

                      <td className="p-4 text-right flex justify-end gap-2">
                        <IconBtn to={`/vehicle/${car._id}`} icon={<Eye size={16} />} />
                        <IconBtn to={`/seller/edit-vehicle/${car._id}`} icon={<Edit3 size={16} />} />
                        <IconBtn to={`/seller/add-inspection/${car._id}`} icon={<ClipboardCheck size={16} />} />

                        <button onClick={() => handleDelete(car._id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {vehicles.length === 0 && <EmptyState />}
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
};

// 🔹 Components
const StatBox = ({ icon, label, count }) => (
  <div className="bg-[#111] p-4 rounded-xl flex items-center gap-4">
    {icon}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{count}</p>
    </div>
  </div>
);

const IconBtn = ({ to, icon }) => (
  <Link to={to} className="bg-[#222] p-2 rounded flex justify-center">
    {icon}
  </Link>
);

const EmptyState = () => (
  <div className="p-10 text-center text-gray-500">
    No vehicles listed yet
  </div>
);

export default SellerDashboard;