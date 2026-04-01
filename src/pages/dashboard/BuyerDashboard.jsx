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
  Calendar, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  IndianRupeeIcon
} from "lucide-react";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ offers: [], inquiries: [], bookings: [] });
  const [loading, setLoading] = useState(true);
  
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

   const fetchDashboardData = async () => {
      try {
        // 🚩 Parallel fetching ensures all counters update simultaneously
        const [offersRes, inquiryRes, bookingRes] = await Promise.all([
          offerService.getBuyerOffers(),
          inquiryService.getBuyerInquiries(),
          testDriveService.getBuyerBookings()
        ]);
        
        setData({
          // 🚩 Handle both direct array or nested .data object
          offers: offersRes.data || offersRes || [],
          inquiries: inquiryRes.data || inquiryRes || [],
          bookings: bookingRes || []
        });
      } catch (err) {
        console.error("Dashboard Load Error", err);
      } finally {
        setLoading(false);
      }
    };
  
 useEffect(() => {
  if (!user || (!user.id && !user._id)) {
    setLoading(false);
    return;
  }

  fetchDashboardData(); // initial load

  // 🔁 Polling every 5 sec
  const interval = setInterval(() => {
    fetchDashboardData();
  }, 5000);

  // 🔄 Refresh when user comes back to tab
  const handleFocus = () => {
    fetchDashboardData();
  };

  window.addEventListener("focus", handleFocus);

  return () => {
    clearInterval(interval);
    window.removeEventListener("focus", handleFocus);
  };
}, []); 

  if (loading) return <Loader fullScreen />;

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

        {/* STATS OVERVIEW - Real-time Counts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard icon={<IndianRupeeIcon />} label="Active Offers" count={data.offers.length} />
          <StatCard icon={<MessageSquare />} label="Open Inquiries" count={data.inquiries.length} />
          <StatCard icon={<Calendar />} label="Scheduled Drives" count={data.bookings.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* RECENT BIDS - Dynamic List */}
          <Card className="border-gray-800 bg-[#111111]/50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#D4AF37]">Recent Bids</h3>
              <Link to="/buyer/offers" className="text-[10px] text-gray-500 hover:text-white transition font-black tracking-widest border-b border-gray-800 pb-1">VIEW ALL</Link>
            </div>
            <div className="space-y-4">
              {data.offers.slice(0, 3).map((offer) => (
                <div key={offer._id} className="flex justify-between items-center bg-[#0D0D0D] p-4 rounded-xl border border-gray-800 hover:border-[#D4AF37]/30 transition-all">
                  <div>
                    {/* 🚩 FIX: Changed .amount to .offered_amount to show the dollar value */}
                    <p className="text-sm font-bold text-white">${offer.offered_amount?.toLocaleString() || "0"}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Status: <span className="text-[#D4AF37]">{offer.status}</span></p>
                  </div>
                  <TrendingUp size={16} className="text-[#D4AF37]/40" />
                </div>
              ))}
              {data.offers.length === 0 && <p className="text-gray-600 text-sm italic py-4 text-center">No bids placed yet.</p>}
            </div>
          </Card>

          {/* UPCOMING TEST DRIVES - Dynamic List */}
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
                    <p className="text-sm font-bold text-white">{booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : 'TBD'}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{booking.preferred_time || "Pending Time"}</p>
                  </div>
                </div>
              ))}
              {data.bookings.length === 0 && <p className="text-gray-600 text-sm italic py-4 text-center">No scheduled drives.</p>}
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