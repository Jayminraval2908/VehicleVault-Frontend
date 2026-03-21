// import React from "react";

// export default function BuyerDashboard() {
//   return (
//     <div className="p-6 text-gray-200">
//       <h1 className="text-3xl font-bold text-amber-400 mb-4">
//         Buyer Dashboard
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Browse Cars</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             Explore available cars from sellers.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Saved Vehicles</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             View your favorite cars.
//           </p>
//         </div>

//         <div className="bg-black/40 border border-gray-700 rounded-xl p-5">
//           <h2 className="text-lg text-amber-400">Test Drives</h2>
//           <p className="text-gray-400 text-sm mt-2">
//             Manage scheduled test drives.
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import offerService from "../../services/offerService";
// import inquiryService from "../../services/inquiryService";
// import testDriveService from "../../services/testDriveService";
// import Loader from "../../components/common/Loader";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
// import { 
//   User, 
//   MessageSquare, 
//   DollarSign, 
//   Calendar, 
//   ArrowRight,
//   TrendingUp,
//   ShieldCheck
// } from "lucide-react";

// const BuyerDashboard = () => {
//   const [data, setData] = useState({ offers: [], inquiries: [], bookings: [] });
//   const [loading, setLoading] = useState(true);
//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [offersRes, inquiryRes, bookingRes] = await Promise.all([
//           offerService.getBuyerOffers(user._id),
//           inquiryService.getInquiriesByBuyer(user._id),
//           testDriveService.getBuyerBookings(user._id)
//         ]);
        
//         setData({
//           offers: offersRes.data || [],
//           inquiries: inquiryRes.data || [],
//           bookings: bookingRes.data || []
//         });
//       } catch (err) {
//         console.error("Dashboard Load Error", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, [user._id]);

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="min-h-screen bg-[#0D0D0D] p-6 lg:p-12 text-white">
//       <div className="max-w-7xl mx-auto">
        
//         {/* WELCOME HEADER */}
//         <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#fcf6ba] flex items-center justify-center border-2 border-black">
//               <User size={32} className="text-black" />
//             </div>
//             <div>
//               <h1 className="text-4xl font-black uppercase tracking-tighter">
//                 Welcome, <span className="text-[#D4AF37]">{user.name || "Collector"}</span>
//               </h1>
//               <p className="text-gray-500 text-sm flex items-center gap-2">
//                 <ShieldCheck size={14} className="text-[#D4AF37]" /> Verified Buyer Account
//               </p>
//             </div>
//           </div>
//           <Link to="/vehicles">
//             <Button variant="outline" className="flex items-center gap-2">
//               BROWSE COLLECTION <ArrowRight size={16} />
//             </Button>
//           </Link>
//         </header>

//         {/* STATS OVERVIEW */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
//           <StatCard icon={<DollarSign />} label="Active Offers" count={data.offers.length} />
//           <StatCard icon={<MessageSquare />} label="Open Inquiries" count={data.inquiries.length} />
//           <StatCard icon={<Calendar />} label="Scheduled Drives" count={data.bookings.length} />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
//           {/* RECENT BIDS */}
//           <Card className="border-gray-800">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">Recent Bids</h3>
//               <Link to="/offer/my-offers" className="text-xs text-gray-500 hover:text-white transition underline">VIEW ALL</Link>
//             </div>
//             <div className="space-y-4">
//               {data.offers.slice(0, 3).map((offer) => (
//                 <div key={offer._id} className="flex justify-between items-center bg-[#0D0D0D] p-4 rounded-xl border border-gray-800">
//                   <div>
//                     <p className="text-sm font-bold">${offer.amount?.toLocaleString()}</p>
//                     <p className="text-[10px] text-gray-500 uppercase">Status: {offer.status}</p>
//                   </div>
//                   <TrendingUp size={16} className="text-[#D4AF37]/40" />
//                 </div>
//               ))}
//               {data.offers.length === 0 && <p className="text-gray-600 text-sm italic">No bids placed yet.</p>}
//             </div>
//           </Card>

//           {/* UPCOMING TEST DRIVES */}
//           <Card className="border-gray-800">
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">Appointments</h3>
//               <Link to="/testdrive/my-bookings" className="text-xs text-gray-500 hover:text-white transition underline">VIEW ALL</Link>
//             </div>
//             <div className="space-y-4">
//               {data.bookings.slice(0, 3).map((booking) => (
//                 <div key={booking._id} className="flex gap-4 items-center bg-[#0D0D0D] p-4 rounded-xl border border-gray-800">
//                   <div className="bg-[#D4AF37]/10 p-2 rounded-lg text-[#D4AF37]">
//                     <Calendar size={18} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-bold">{new Date(booking.preferred_date).toLocaleDateString()}</p>
//                     <p className="text-[10px] text-gray-500 uppercase">{booking.preferred_time}</p>
//                   </div>
//                 </div>
//               ))}
//               {data.bookings.length === 0 && <p className="text-gray-600 text-sm italic">No scheduled drives.</p>}
//             </div>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// };

// // HELPER STAT COMPONENT
// const StatCard = ({ icon, label, count }) => (
//   <div className="bg-[#111111] border border-gray-800 p-8 rounded-2xl flex items-center justify-between shadow-xl">
//     <div>
//       <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
//       <p className="text-3xl font-black text-white">{count}</p>
//     </div>
//     <div className="text-[#D4AF37] opacity-40">
//       {React.cloneElement(icon, { size: 40 })}
//     </div>
//   </div>
// );

// export default BuyerDashboard;



import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import offerService from "../../services/offerService";
import inquiryService from "../../services/inquiryService";
import testDriveService from "../../services/testDriveService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { 
  User, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ offers: [], inquiries: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  
  // 1. Safe parsing of user data
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // 2. Guard: If no user, stop loading and wait (MainLayout usually handles redirect)
    if (!user || !user._id) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [offersRes, inquiryRes, bookingRes] = await Promise.all([
          offerService.getBuyerOffers(user._id),
          inquiryService.getInquiriesByBuyer(user._id),
          testDriveService.getBuyerBookings(user._id)
        ]);
        
        setData({
          offers: offersRes.data || [],
          inquiries: inquiryRes.data || [],
          bookings: bookingRes.data || []
        });
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array as we use the constant 'user' defined above

  // 3. Render Loader if still fetching
  if (loading) return <Loader fullScreen />;

  // 4. Render Error if user session is missing
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Session Missing</h2>
        <p className="text-gray-500 mb-6">Please sign in to access your collector dashboard.</p>
        <Button onClick={() => navigate("/login")}>GO TO LOGIN</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-6 lg:p-12 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* WELCOME HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#fcf6ba] flex items-center justify-center border-2 border-black shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <User size={32} className="text-black" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">
                Welcome, <span className="text-[#D4AF37]">{user.name || "Collector"}</span>
              </h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#D4AF37]" /> Verified Buyer Account
              </p>
            </div>
          </div>
          <Link to="/vehicles">
            <Button variant="outline" className="flex items-center gap-2 border-gray-800 hover:border-[#D4AF37]">
              BROWSE COLLECTION <ArrowRight size={16} />
            </Button>
          </Link>
        </header>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<DollarSign />} label="Active Offers" count={data.offers.length} />
          <StatCard icon={<MessageSquare />} label="Open Inquiries" count={data.inquiries.length} />
          <StatCard icon={<Calendar />} label="Scheduled Drives" count={data.bookings.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* RECENT BIDS */}
          <Card className="border-gray-800 bg-[#111111]/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">Recent Bids</h3>
              <Link to="/buyer/offers" className="text-[10px] text-gray-500 hover:text-white transition font-black tracking-widest border-b border-gray-800 pb-1">VIEW ALL</Link>
            </div>
            <div className="space-y-4">
              {data.offers.slice(0, 3).map((offer) => (
                <div key={offer._id} className="flex justify-between items-center bg-[#0D0D0D] p-4 rounded-xl border border-gray-800 hover:border-[#D4AF37]/30 transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">${offer.amount?.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Status: <span className="text-[#D4AF37]">{offer.status}</span></p>
                  </div>
                  <TrendingUp size={16} className="text-[#D4AF37]/40" />
                </div>
              ))}
              {data.offers.length === 0 && <p className="text-gray-600 text-sm italic py-4">No bids placed yet.</p>}
            </div>
          </Card>

          {/* UPCOMING TEST DRIVES */}
          <Card className="border-gray-800 bg-[#111111]/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">Appointments</h3>
              <Link to="/buyer/bookings" className="text-[10px] text-gray-500 hover:text-white transition font-black tracking-widest border-b border-gray-800 pb-1">VIEW ALL</Link>
            </div>
            <div className="space-y-4">
              {data.bookings.slice(0, 3).map((booking) => (
                <div key={booking._id} className="flex gap-4 items-center bg-[#0D0D0D] p-4 rounded-xl border border-gray-800 hover:border-[#D4AF37]/30 transition-all">
                  <div className="bg-[#D4AF37]/10 p-2 rounded-lg text-[#D4AF37]">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{new Date(booking.preferred_date).toLocaleDateString()}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{booking.preferred_time}</p>
                  </div>
                </div>
              ))}
              {data.bookings.length === 0 && <p className="text-gray-600 text-sm italic py-4">No scheduled drives.</p>}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count }) => (
  <div className="bg-[#111111] border border-gray-800 p-8 rounded-2xl flex items-center justify-between shadow-xl group hover:border-[#D4AF37]/20 transition-all">
    <div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{count}</p>
    </div>
    <div className="text-[#D4AF37] opacity-20 group-hover:opacity-100 transition-opacity duration-500">
      {React.cloneElement(icon, { size: 40 })}
    </div>
  </div>
);

export default BuyerDashboard;