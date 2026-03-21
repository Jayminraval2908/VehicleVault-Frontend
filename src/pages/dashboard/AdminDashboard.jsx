// import React from "react";

// export default function AdminDashboard() {
//   return (
//     <div className="p-6 text-gray-200">

//       <h1 className="text-3xl font-bold text-amber-400 mb-6">
//         Admin Dashboard
//       </h1>

//       {/* STATS */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-2xl font-bold text-amber-400">120</h2>
//           <p className="text-gray-400 text-sm">Total Users</p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-2xl font-bold text-amber-400">25</h2>
//           <p className="text-gray-400 text-sm">Total Sellers</p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-2xl font-bold text-amber-400">78</h2>
//           <p className="text-gray-400 text-sm">Vehicles Listed</p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-2xl font-bold text-amber-400">6</h2>
//           <p className="text-gray-400 text-sm">Pending Approvals</p>
//         </div>

//       </div>

//       {/* ADMIN ACTIONS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Manage Users</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             View and manage platform users.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Vehicle Listings</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             Monitor all car listings.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Platform Analytics</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             Track platform activity.
//           </p>
//         </div>

//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import vehicleService from "../../services/vehicleService";
import inquiryService from "../../services/inquiryService";
import offerService from "../../services/offerService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { 
  ShieldCheck, 
  Users, 
  Layers, 
  Activity, 
  DollarSign, 
  AlertCircle,
  ArrowUpRight,
  Settings
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ cars: 0, inquiries: 0, revenue: 0, users: 42 }); // Mock users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        const [vRes, iRes, oRes] = await Promise.all([
          vehicleService.getAllVehicles(),
          inquiryService.getAllInquiries(),
          offerService.getBuyerOffers("all") // Assuming admin can fetch all
        ]);

        const totalRevenue = (oRes.data || [])
          .filter(o => o.status === "accepted")
          .reduce((sum, o) => sum + o.amount, 0);

        setStats({
          cars: vRes.data?.length || 0,
          inquiries: iRes.data?.length || 0,
          revenue: totalRevenue,
          users: 128 // Mocking user count for UI
        });
      } catch (err) {
        console.error("Admin Stats Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalStats();
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP ADMIN BAR */}
        <div className="flex justify-between items-center mb-12 bg-[#111111] p-6 rounded-3xl border border-gray-800 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-[#D4AF37] p-3 rounded-2xl text-black shadow-lg shadow-[#D4AF37]/20">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-widest">System <span className="text-[#D4AF37]">Admin</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Vault Management Protocol v3.0</p>
            </div>
          </div>
          <Button variant="ghost" className="flex items-center gap-2 border border-gray-800">
            <Settings size={18} /> SETTINGS
          </Button>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <AdminStat icon={<DollarSign />} label="Estimated Revenue" value={`$${stats.revenue.toLocaleString()}`} color="text-green-500" />
          <AdminStat icon={<Users />} label="Total Members" value={stats.users} color="text-blue-500" />
          <AdminStat icon={<Layers />} label="Live Inventory" value={stats.cars} color="text-[#D4AF37]" />
          <AdminStat icon={<Activity />} label="Global Inquiries" value={stats.inquiries} color="text-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SYSTEM ALERTS */}
          <Card className="lg:col-span-1 border-red-900/20 bg-[#111111]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-red-500 mb-6 flex items-center gap-2">
              <AlertCircle size={16} /> Critical Alerts
            </h3>
            <div className="space-y-4">
              <AlertItem message="New Seller verification pending" time="2m ago" />
              <AlertItem message="Unusual offer activity detected" time="15m ago" />
              <AlertItem message="Server backup completed" time="1h ago" />
            </div>
          </Card>

          {/* GLOBAL FEED */}
          <Card className="lg:col-span-2 border-gray-800 bg-[#111111]">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Global Activity Stream</h3>
                <span className="text-[10px] text-gray-600 bg-gray-900 px-3 py-1 rounded-full">LIVE UPDATE</span>
             </div>
             
             <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-2xl border border-gray-800/50 group hover:border-[#D4AF37]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        USR
                      </div>
                      <div>
                        <p className="text-sm font-bold">New Offer Placed on <span className="text-[#D4AF37]">Ferrari F8</span></p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Target Price: $280,000</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-gray-700 group-hover:text-[#D4AF37] transition" />
                  </div>
                ))}
             </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

// SUB-COMPONENTS
const AdminStat = ({ icon, label, value, color }) => (
  <div className="bg-[#111111] border border-gray-800 p-8 rounded-3xl shadow-xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
       {React.cloneElement(icon, { size: 60 })}
    </div>
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-2">{label}</p>
    <p className={`text-3xl font-black ${color}`}>{value}</p>
  </div>
);

const AlertItem = ({ message, time }) => (
  <div className="flex justify-between items-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
    <span className="text-xs text-gray-300 font-medium">{message}</span>
    <span className="text-[10px] text-gray-600 font-mono">{time}</span>
  </div>
);

export default AdminDashboard;