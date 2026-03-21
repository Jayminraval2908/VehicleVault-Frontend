// import React from "react";

// export default function SellerDashboard() {
//   return (
//     <div className="p-6 text-gray-200">

//       <h1 className="text-3xl font-bold text-amber-400 mb-4">
//         Seller Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Add Vehicle</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             List your car for sale.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">My Listings</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             Manage your vehicle listings.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Buyer Requests</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             View inquiries from buyers.
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import vehicleService from "../../services/vehicleService";
import inquiryService from "../../services/inquiryService";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Eye, 
  BarChart3, 
  Car,
  ChevronRight
} from "lucide-react";

const SellerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // In a real app, you'd have a specific "getSellerVehicles" route
        // For now, we fetch all and filter or assume user._id logic
        const [vRes, iRes] = await Promise.all([
          vehicleService.getAllVehicles(),
          inquiryService.getAllInquiries() // Usually filtered by seller in backend
        ]);
        
        setVehicles(vRes.data || []);
        setInquiries(iRes.data || []);
      } catch (err) {
        console.error("Seller Data Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this listing?")) {
      await vehicleService.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v._id !== id));
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Seller <span className="text-[#D4AF37]">Console</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your luxury inventory and incoming leads.</p>
          </div>
          <Link to="/vehicle/add">
            <Button className="flex items-center gap-2 px-8 py-4">
              <Plus size={20} /> LIST NEW VEHICLE
            </Button>
          </Link>
        </div>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatBox icon={<Car />} label="Live Listings" count={vehicles.length} />
          <StatBox icon={<MessageCircle />} label="Total Inquiries" count={inquiries.length} />
          <StatBox icon={<BarChart3 />} label="Profile Views" count="1.2k" />
        </div>

        {/* INVENTORY TABLE */}
        <Card className="border-gray-800 p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#111111]">
            <h3 className="text-lg font-bold uppercase tracking-widest text-[#D4AF37]">Active Inventory</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
              Update Frequency: Real-time
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0D0D0D] text-gray-500 uppercase text-[10px] font-bold tracking-[0.2em]">
                  <th className="p-6">Vehicle Details</th>
                  <th className="p-6">Price</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {vehicles.map((car) => (
                  <tr key={car._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
                          <img src={car.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase text-sm">{car.make} {car.model}</p>
                          <p className="text-[10px] text-gray-500">ID: {car._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 font-mono text-[#D4AF37]">${car.price?.toLocaleString()}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase">Active</span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-end gap-3">
                        <Link to={`/vehicle/${car._id}`}>
                          <button className="p-2 text-gray-500 hover:text-white transition"><Eye size={18} /></button>
                        </Link>
                        <Link to={`/vehicle/edit/${car._id}`}>
                          <button className="p-2 text-gray-500 hover:text-[#D4AF37] transition"><Edit3 size={18} /></button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(car._id)}
                          className="p-2 text-gray-500 hover:text-red-500 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {vehicles.length === 0 && (
              <div className="p-20 text-center text-gray-600 italic text-sm">
                No vehicles listed yet. Start by clicking "List New Vehicle".
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// SUB-COMPONENT: STAT BOX
const StatBox = ({ icon, label, count }) => (
  <div className="bg-[#111111] border border-gray-800 p-6 rounded-2xl flex items-center gap-6">
    <div className="bg-[#D4AF37]/10 p-4 rounded-xl text-[#D4AF37]">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-white">{count}</p>
    </div>
  </div>
);

export default SellerDashboard;