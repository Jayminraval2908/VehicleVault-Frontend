import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Users,
  Layers,
  Activity,
  IndianRupeeIcon
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    pendingVehicles: 0,
    blockedUsers: 0,
    recentActivities: [],
    chartData: []
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

    const interval = setInterval(fetchData, 5000); // 🔥 realtime refresh
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader fullScreen />;

  // 🔥 fallback chart if backend not ready
  const chartData = stats.chartData?.length
    ? stats.chartData
    : [
      { name: "Jan", revenue: 20000 },
      { name: "Feb", revenue: 40000 },
      { name: "Mar", revenue: 30000 },
      { name: "Apr", revenue: stats.totalRevenue || 0 }
    ];

  // =============================
  // 🔥 USER BLOCK / UNBLOCK
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

      // ✅ instant UI update
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
  // 🚗 VEHICLE APPROVE / REJECT
  // =============================
  const handleApprove = async (id) => {
    try {
      await adminService.approveVehicle(id);

      // ✅ remove from UI instantly
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

      // ✅ remove instantly
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

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Stat icon={<IndianRupeeIcon />} label="Revenue" value={`₹${stats?.totalRevenue || 0}`} />
        <Stat icon={<Users />} label="Users" value={stats.totalUsers || 0} />
        <Stat icon={<Layers />} label="Vehicles" value={stats.totalVehicles || 0} />
        <Stat icon={<Activity />} label="Inquiries" value={stats.totalInquiries || 0} />
      </div>

      {/* CHART */}
      <Card className="mb-10">
        <h2 className="mb-4 font-bold">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* USERS */}
        <Card>
          <h2 className="mb-4 font-bold">User Management</h2>
          {users.slice(0, 5).map(user => (
            <div key={user._id} className="flex justify-between mb-3">
              <span>{user.firstName} ({user.role})</span>

              <Button onClick={() => handleUserToggle(user)}>
                {user.status === "block" ? "Unblock" : "Block"}
              </Button>
            </div>
          ))}
        </Card>

        {/* VEHICLE APPROVAL */}
        <Card>
          <h2 className="mb-4 font-bold">Pending Vehicles</h2>
          {vehicles.slice(0, 5).map(v => (
            <div key={v._id} className="flex justify-between mb-3">
              <span>{v.make} {v.model}</span>
              <div className="flex gap-2">
                <Button onClick={() => handleApprove(v._id)}>
                  Approve
                </Button>
                <Button onClick={() => handleReject(v._id)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </Card>

      </div>

      {/* ACTIVITY */}
      <Card className="mt-10">
        <h2 className="mb-4 font-bold">Recent Activity</h2>
        {stats.recentActivities?.length ? (
          stats.recentActivities.map((a, i) => (
            <p key={i} className="text-sm text-gray-400 mb-2">
              {a.message}
            </p>
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
  <div className="bg-[#111] p-6 rounded-xl flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
    {icon}
  </div>
);

export default AdminDashboard;