import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Users,
  Layers,
  Activity
} from "lucide-react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalInquiries: 0,
    pendingVehicles: 0,
    blockedUsers: 0,
    recentActivities: []
  });

  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const dashboard = await adminService.getDashboard();
      const usersData = await adminService.getUsers();
      const pendingVehicles = await adminService.getPendingVehicles();

      setStats(dashboard || {});
      setUsers(usersData || []);
      setVehicles(pendingVehicles || []);
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // realtime refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader fullScreen />;

  // =============================
  // USER BLOCK / UNBLOCK
  // =============================
  const handleUserToggle = async (user) => {
    try {
      if (user.status === "block") {
        await adminService.unblockUser(user._id);
        toast.success("User Unblocked ✅")
      } else {
        await adminService.blockUser(user._id);
        toast.success("User Blocked 🚫")
      }

      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? {
              ...u,
              status: user.status === "block" ? "active" : "block"
            }
            : u
        )
      );
    } catch (err) {
      console.error("User action failed:", err);
      toast.error("Action Failed ❌")
    }
  };

  // =============================
  // VEHICLE APPROVE / REJECT
  // =============================
  const handleApprove = async (id) => {
    try {
      await adminService.approveVehicle(id);
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success("Vehicle Approved ✅")
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Failed to approve ❌")
    }
  };
  
  const handleReject = async (id) => {
    try {
      await adminService.rejectVehicle(id);
      setVehicles(prev => prev.filter(v => v._id !== id));
      toast.success("Vehicle Rejected ❌")
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject ❌")
    }
  };

  return (
    <div className="p-6 text-white bg-[#0D0D0D] min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8 text-[#D4AF37]">
        Admin Dashboard
      </h1>

      {/* STATS - Revenue removed from here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Stat icon={<Users className="text-[#D4AF37]" />} label="Total Users" value={stats.totalUsers || 0} />
        <Stat icon={<Layers className="text-[#D4AF37]" />} label="Total Vehicles" value={stats.totalVehicles || 0} />
        <Stat icon={<Activity className="text-[#D4AF37]" />} label="Active Inquiries" value={stats.totalInquiries || 0} />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* USERS */}
        <Card>
          <h2 className="mb-4 font-bold border-b border-gray-800 pb-2">User Management</h2>
          {users.slice(0, 5).map(user => (
            <div key={user._id} className="flex justify-between items-center mb-4 p-2 hover:bg-white/5 rounded-lg transition">
              <div>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{user.role}</p>
              </div>

              <Button 
                variant={user.status === "block" ? "outline" : "danger"} 
                onClick={() => handleUserToggle(user)}
                className="text-xs px-4 py-1"
              >
                {user.status === "block" ? "Unblock" : "Block"}
              </Button>
            </div>
          ))}
        </Card>

        {/* VEHICLE APPROVAL */}
        <Card>
          <h2 className="mb-4 font-bold border-b border-gray-800 pb-2">Pending Approvals</h2>
          {vehicles.length > 0 ? (
            vehicles.slice(0, 5).map(v => (
                <div key={v._id} className="flex justify-between items-center mb-4 p-2 hover:bg-white/5 rounded-lg transition">
                  <span>{v.make} {v.model}</span>
                  <div className="flex gap-2">
                    <button 
                        onClick={() => handleApprove(v._id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-3 py-1 rounded font-bold uppercase"
                    >
                      Approve
                    </button>
                    <button 
                        onClick={() => handleReject(v._id)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-3 py-1 rounded font-bold uppercase"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-sm italic">No pending vehicles</p>
          )}
        </Card>
      </div>

      {/* ACTIVITY */}
      <Card className="mt-10">
        <h2 className="mb-4 font-bold border-b border-gray-800 pb-2 text-sm uppercase tracking-widest">System Logs</h2>
        {stats.recentActivities?.length ? (
          stats.recentActivities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <p className="text-sm text-gray-400">
                    {a.message}
                </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No recent activity</p>
        )}
      </Card>

    </div>
  );
};

// STAT CARD
const Stat = ({ icon, label, value }) => (
  <div className="bg-[#111] p-6 rounded-xl border border-gray-800 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    <div className="bg-white/5 p-3 rounded-lg">
        {icon}
    </div>
  </div>
);

export default AdminDashboard;