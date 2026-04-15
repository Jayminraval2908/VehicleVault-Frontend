import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { Users, ShieldCheck, UserCircle, CheckCircle, Ban } from "lucide-react";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("buyer");
  const [statusFilter, setStatusFilter] = useState("active");

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) => u.role === activeRole && u.status === statusFilter
  );

  const handleBlockToggle = async (user) => {
    try {
      if (user.status === "block") {
        await adminService.unblockUser(user._id);
        toast.success(`${user.firstName} restored ✅`);
      } else {
        await adminService.blockUser(user._id);
        toast.warning(`${user.firstName} blocked 🚫`);
      }
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 bg-[#0D0D0D] min-h-screen text-white">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-[#D4AF37]">
        Member <span className="text-white">Management</span>
      </h1>

      {/* ROLE TABS */}
      <div className="flex overflow-x-auto gap-2 mb-4 border-b border-gray-800">
        <RoleTab active={activeRole === "buyer"} onClick={() => setActiveRole("buyer")} icon={<UserCircle size={16} />} label="Buyers" />
        <RoleTab active={activeRole === "seller"} onClick={() => setActiveRole("seller")} icon={<Users size={16} />} label="Sellers" />
        <RoleTab active={activeRole === "admin"} onClick={() => setActiveRole("admin")} icon={<ShieldCheck size={16} />} label="Admins" />
      </div>

      {/* STATUS FILTER */}
      <div className="flex flex-wrap gap-3 mb-6">
        <FilterBtn
          active={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
          icon={<CheckCircle size={14} />}
          label={`Active (${users.filter(u => u.role === activeRole && u.status === "active").length})`}
          color="green"
        />
        <FilterBtn
          active={statusFilter === "block"}
          onClick={() => setStatusFilter("block")}
          icon={<Ban size={14} />}
          label={`Blocked (${users.filter(u => u.role === activeRole && u.status === "block").length})`}
          color="red"
        />
      </div>

      {/* ✅ MOBILE VIEW (CARD) */}
      <div className="space-y-4 md:hidden">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="bg-[#111] border border-gray-800 p-4 rounded-xl">

              <p className="font-bold text-white">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-xs text-[#D4AF37] uppercase">{user.role}</p>

              <p className="text-sm text-gray-400 mt-2">{user.email}</p>
              <p className="text-xs text-gray-500">{user.phone || "No Phone"}</p>

              <button
                onClick={() => handleBlockToggle(user)}
                className={`mt-4 w-full py-2 rounded-lg text-xs font-bold ${
                  user.status === "block"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {user.status === "block" ? "Restore" : "Block"}
              </button>

            </div>
          ))
        ) : (
          <EmptyState activeRole={activeRole} statusFilter={statusFilter} />
        )}
      </div>

      {/* ✅ DESKTOP VIEW (TABLE) */}
      <div className="hidden md:block">
        <Card className="p-0 overflow-hidden border-gray-800 bg-[#111]/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-500 text-xs border-b border-gray-800">
                  <th className="p-4">Identity</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4 text-right">Access</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-800/30 hover:bg-white/[0.02]">
                      <td className="p-4">
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-[#D4AF37]">{user.role}</p>
                      </td>

                      <td className="p-4">
                        <p className="text-sm">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleBlockToggle(user)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold ${
                            user.status === "block"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {user.status === "block" ? "Restore" : "Block"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">
                      <EmptyState activeRole={activeRole} statusFilter={statusFilter} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

// 🔹 Components
const RoleTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap ${
      active ? "text-[#D4AF37] border-b-2 border-[#D4AF37]" : "text-gray-500"
    }`}
  >
    {icon} {label}
  </button>
);

const FilterBtn = ({ active, onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
      active
        ? color === "green"
          ? "bg-green-500/10 text-green-500"
          : "bg-red-500/10 text-red-500"
        : "text-gray-500"
    }`}
  >
    {icon} {label}
  </button>
);

const EmptyState = ({ activeRole, statusFilter }) => (
  <div className="p-10 text-center text-gray-500">
    No {statusFilter} {activeRole}s found
  </div>
);

export default AdminUsers;