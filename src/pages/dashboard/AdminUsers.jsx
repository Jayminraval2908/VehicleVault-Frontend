import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Users,
  ShieldCheck,
  UserCircle,
  CheckCircle,
  Ban,
  Mail,
  Phone,
} from "lucide-react";
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
        toast.success(`${user.firstName} restored`);
      } else {
        await adminService.blockUser(user._id);
        toast.warning(`${user.firstName} blocked`);
      }
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  const activeCount = users.filter(
    (u) => u.role === activeRole && u.status === "active"
  ).length;
  const blockedCount = users.filter(
    (u) => u.role === activeRole && u.status === "block"
  ).length;

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-10 lg:py-10"
      style={body}
    >
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
            Access Control
          </p>
          <h1
            className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
            style={display}
          >
            Member <span className="text-[#2DD4BF]">Management</span>
          </h1>
          <p className="mt-1.5 text-sm text-[#8EA0B5]">
            Review verified buyers, sellers, and administrators across the platform.
          </p>
        </header>

        {/* ROLE TABS */}
        <div className="mb-5 flex gap-2 overflow-x-auto border-b border-white/10">
          <RoleTab
            active={activeRole === "buyer"}
            onClick={() => setActiveRole("buyer")}
            icon={<UserCircle size={16} />}
            label="Buyers"
            count={users.filter((u) => u.role === "buyer").length}
          />
          <RoleTab
            active={activeRole === "seller"}
            onClick={() => setActiveRole("seller")}
            icon={<Users size={16} />}
            label="Sellers"
            count={users.filter((u) => u.role === "seller").length}
          />
          <RoleTab
            active={activeRole === "admin"}
            onClick={() => setActiveRole("admin")}
            icon={<ShieldCheck size={16} />}
            label="Admins"
            count={users.filter((u) => u.role === "admin").length}
          />
        </div>

        {/* STATUS FILTER */}
        <div className="mb-6 flex flex-wrap gap-3">
          <FilterBtn
            active={statusFilter === "active"}
            onClick={() => setStatusFilter("active")}
            icon={<CheckCircle size={15} />}
            label="Active"
            count={activeCount}
            tone="teal"
          />
          <FilterBtn
            active={statusFilter === "block"}
            onClick={() => setStatusFilter("block")}
            icon={<Ban size={15} />}
            label="Blocked"
            count={blockedCount}
            tone="rose"
          />
        </div>

        {/* MOBILE VIEW (CARDS) */}
        <div className="space-y-4 md:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isBlocked = user.status === "block";
              return (
                <div
                  key={user._id}
                  className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="truncate text-base font-semibold text-white"
                        style={display}
                      >
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="mt-1 inline-block rounded-full border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 px-2.5 py-0.5 text-[11px] font-medium capitalize text-[#2DD4BF]">
                        {user.role}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                        isBlocked
                          ? "bg-rose-500/10 text-rose-300"
                          : "bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3.5 text-xs text-[#8EA0B5]">
                    <p className="flex items-center gap-2 truncate text-[#C8D3E0]">
                      <Mail size={13} className="shrink-0 text-[#2DD4BF]" />
                      <span className="truncate">{user.email}</span>
                    </p>
                    <p
                      className="flex items-center gap-2"
                      style={mono}
                    >
                      <Phone size={13} className="shrink-0 text-[#8EA0B5]" />
                      <span>{user.phone || "No phone"}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBlockToggle(user)}
                    className={`mt-4 w-full rounded-lg py-2.5 text-xs font-semibold transition-colors ${focusRing} ${
                      isBlocked
                        ? "border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF] hover:bg-[#2DD4BF]/20"
                        : "border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                    }`}
                  >
                    {isBlocked ? "Restore access" : "Block member"}
                  </button>
                </div>
              );
            })
          ) : (
            <EmptyState activeRole={activeRole} statusFilter={statusFilter} />
          )}
        </div>

        {/* DESKTOP VIEW (TABLE) */}
        <div className="hidden md:block">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1D33]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-[#0A1628]/70 text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
                    <th className="px-6 py-4">Identity</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-right">Access</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const isBlocked = user.status === "block";
                      return (
                        <tr
                          key={user._id}
                          className="transition-colors hover:bg-[#102238]/70"
                        >
                          <td className="px-6 py-4">
                            <p
                              className="text-sm font-semibold text-white"
                              style={display}
                            >
                              {user.firstName} {user.lastName}
                            </p>
                            <span className="mt-1 inline-block text-xs font-medium capitalize text-[#2DD4BF]">
                              {user.role}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm text-[#C8D3E0]">
                              {user.email}
                            </p>
                            <p
                              className="mt-0.5 text-xs text-[#8EA0B5]"
                              style={mono}
                            >
                              {user.phone || "No phone"}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleBlockToggle(user)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors ${focusRing} ${
                                isBlocked
                                  ? "border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF] hover:bg-[#2DD4BF]/20"
                                  : "border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                              }`}
                            >
                              {isBlocked ? "Restore" : "Block"}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3">
                        <EmptyState
                          activeRole={activeRole}
                          statusFilter={statusFilter}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RoleTab = ({ active, onClick, icon, label, count }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${focusRing} ${
      active
        ? "border-[#2DD4BF] text-[#2DD4BF]"
        : "border-transparent text-[#8EA0B5] hover:text-white"
    }`}
  >
    {icon}
    <span>{label}</span>
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] ${
        active
          ? "bg-[#2DD4BF]/15 text-[#2DD4BF]"
          : "bg-white/5 text-[#8EA0B5]"
      }`}
      style={mono}
    >
      {count}
    </span>
  </button>
);

const FilterBtn = ({ active, onClick, icon, label, count, tone }) => {
  const activeStyle =
    tone === "teal"
      ? "border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF]"
      : "border-rose-400/40 bg-rose-500/10 text-rose-300";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${focusRing} ${
        active
          ? activeStyle
          : "border-white/10 bg-[#0D1D33] text-[#8EA0B5] hover:border-white/20 hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
      <span style={mono}>({count})</span>
    </button>
  );
};

const EmptyState = ({ activeRole, statusFilter }) => (
  <div className="rounded-2xl border border-dashed border-white/10 bg-[#0D1D33]/50 p-10 text-center text-sm text-[#8EA0B5]">
    No {statusFilter === "block" ? "blocked" : "active"} {activeRole}s found.
  </div>
);

export default AdminUsers;