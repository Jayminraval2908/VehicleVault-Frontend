// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import vehicleService from "../../services/vehicleService";
// import inquiryService from "../../services/inquiryService";
// import Button from "../../components/common/Button";
// import Card from "../../components/common/Card";
// import Loader from "../../components/common/Loader";
// import { toast } from "react-toastify";
// import {
//   Plus,
//   Edit3,
//   Trash2,
//   MessageCircle,
//   Eye,
//   BarChart3,
//   Car,
//   ClipboardCheck
// } from "lucide-react";

// const SellerDashboard = () => {
//   const [vehicles, setVehicles] = useState([]);
//   const [inquiries, setInquiries] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSellerData = async () => {
//       try {
//         const vehiclesData = await vehicleService.getSellerVehicles();
//         const vehicleList = vehiclesData.data || [];

//         setVehicles(vehicleList);

//         const inquiryPromises = vehicleList.map((v) =>
//           inquiryService.getInquiriesByVehicle(v._id)
//         );

//         const inquiryResults = await Promise.all(inquiryPromises);

//         const allInquiries = inquiryResults
//           .map((res) => res.data || [])
//           .flat();

//         setInquiries(allInquiries);

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSellerData();

//     const interval = setInterval(fetchSellerData, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Remove this listing?")) {
//       await vehicleService.deleteVehicle(id);
//       setVehicles((prev) => prev.filter(v => v._id !== id));
//     }
//   };

//   const handlePublish = async (id) => {
//     try {
//       await vehicleService.publishVehicle(id);
//       toast.success("Sent for approval 🚀");

//       setVehicles(prev =>
//         prev.map(v =>
//           v._id === id ? { ...v, status: "Pending" } : v
//         )
//       );
//     } catch {
//       toast.error("Publish failed");
//     }
//   };

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="bg-[#0D0D0D] min-h-screen text-white px-4 sm:px-6 md:px-10 py-6">

//       <div className="max-w-7xl mx-auto">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-black">
//               Seller <span className="text-[#D4AF37]">Console</span>
//             </h1>
//             <p className="text-gray-500 text-sm">
//               Manage your inventory & leads
//             </p>
//           </div>

//           <Link to="/seller/add-vehicle" className="w-full md:w-auto">
//             <Button className="w-full md:w-auto flex justify-center items-center gap-2">
//               <Plus size={18} /> List Vehicle
//             </Button>
//           </Link>
//         </div>

//         {/* STATS */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//           <StatBox icon={<Car />} label="Listings" count={vehicles.length} />
//           <StatBox icon={<MessageCircle />} label="Inquiries" count={inquiries.length} />
//           <StatBox
//             icon={<BarChart3 />}
//             label="Engagement"
//             count={`${vehicles.length > 0 ? (inquiries.length / vehicles.length).toFixed(1) : 0}x`}
//           />
//         </div>

//         {/* MOBILE VIEW */}
//         <div className="space-y-4 md:hidden">
//           {vehicles.length > 0 ? (
//             vehicles.map((car) => (
//               <Card key={car._id} className="p-4 space-y-4">

//                 <div className="flex gap-4">
//                   <img
//                     src={car.images?.[0]}
//                     alt={car.model}
//                     className="w-24 h-16 object-cover rounded-lg"
//                   />

//                   <div>
//                     <p className="font-bold">{car.make} {car.model}</p>
//                     <p className="text-xs text-gray-500">
//                       ₹ {car.price?.toLocaleString()}
//                     </p>

//                     <span className="text-xs mt-1 inline-block">
//                       {car.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <IconBtn to={`/vehicle/${car._id}`} icon={<Eye size={16} />} />
//                   <IconBtn to={`/seller/edit-vehicle/${car._id}`} icon={<Edit3 size={16} />} />
//                   <IconBtn to={`/seller/add-inspection/${car._id}`} icon={<ClipboardCheck size={16} />} />

//                   <button onClick={() => handleDelete(car._id)} className="bg-red-600 p-2 rounded">
//                     <Trash2 size={16} />
//                   </button>
//                 </div>

//                 {car.status === "Draft" && (
//                   <Button onClick={() => handlePublish(car._id)} className="w-full">
//                     Publish 🚀
//                   </Button>
//                 )}

//               </Card>
//             ))
//           ) : (
//             <EmptyState />
//           )}
//         </div>

//         {/* DESKTOP TABLE */}
//         <div className="hidden md:block">
//           <Card className="p-0 overflow-hidden border-gray-800">

//             <div className="p-4 border-b border-gray-800 flex justify-between bg-[#111]">
//               <h3 className="text-sm font-bold text-[#D4AF37]">Inventory</h3>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="text-gray-500 text-xs">
//                     <th className="p-4">Vehicle</th>
//                     <th className="p-4">Price</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4 text-right">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {vehicles.map((car) => (
//                     <tr key={car._id} className="border-t border-gray-800">
//                       <td className="p-4 flex gap-3 items-center">
//                         <img
//                           src={car.images?.[0]}
//                           className="w-14 h-10 rounded object-cover"
//                         />
//                         <div>
//                           <p>{car.make} {car.model}</p>
//                           <p className="text-xs text-gray-500">{car._id.slice(-6)}</p>
//                         </div>
//                       </td>

//                       <td className="p-4 text-[#D4AF37]">
//                         ₹ {car.price?.toLocaleString()}
//                       </td>

//                       <td className="p-4">{car.status}</td>

//                       <td className="p-4 text-right flex justify-end gap-2">
//                         <IconBtn to={`/vehicle/${car._id}`} icon={<Eye size={16} />} />
//                         <IconBtn to={`/seller/edit-vehicle/${car._id}`} icon={<Edit3 size={16} />} />
//                         <IconBtn to={`/seller/add-inspection/${car._id}`} icon={<ClipboardCheck size={16} />} />

//                         <button onClick={() => handleDelete(car._id)}>
//                           <Trash2 size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {vehicles.length === 0 && <EmptyState />}
//             </div>

//           </Card>
//         </div>

//       </div>
//     </div>
//   );
// };

// // 🔹 Components
// const StatBox = ({ icon, label, count }) => (
//   <div className="bg-[#111] p-4 rounded-xl flex items-center gap-4">
//     {icon}
//     <div>
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="font-bold">{count}</p>
//     </div>
//   </div>
// );

// const IconBtn = ({ to, icon }) => (
//   <Link to={to} className="bg-[#222] p-2 rounded flex justify-center">
//     {icon}
//   </Link>
// );

// const EmptyState = () => (
//   <div className="p-10 text-center text-gray-500">
//     No vehicles listed yet
//   </div>
// );

// export default SellerDashboard;




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