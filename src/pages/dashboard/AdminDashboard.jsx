import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import { display, body, mono, focusRing } from "../../utils/theme";
import {
  Users,
  Layers,
  Activity,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { toast } from "react-toastify";

const headerMotion = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const AdminDashboard = () => {
  const reduceMotion = useReducedMotion();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalInquiries: 0,
    pendingVehicles: 0,
    blockedUsers: 0,
    recentActivities: [],
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
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Loader fullScreen />;

  const handleUserToggle = async (user) => {
    try {
      if (user.status === "block") {
        await adminService.unblockUser(user._id);
        toast.success("User unblocked");
      } else {
        await adminService.blockUser(user._id);
        toast.success("User blocked");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                status: user.status === "block" ? "active" : "block",
              }
            : u
        )
      );
    } catch (err) {
      console.error("User action failed:", err);
      toast.error("Action failed");
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.approveVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vehicle approved");
    } catch (err) {
      console.error("Approve failed:", err);
      toast.error("Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      toast.success("Vehicle rejected");
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject");
    }
  };

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[#0A1628] px-4 py-6 text-[#C8D3E0] sm:px-6 lg:px-10 lg:py-10"
      style={body}
    >
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <motion.header
          variants={headerMotion}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#2DD4BF]">
              Operations & Moderation
            </p>
            <h1
              className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={display}
            >
              Admin <span className="text-[#2DD4BF]">Command</span>
            </h1>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-[#0D1D33] px-3.5 py-1.5 text-xs font-medium text-[#8EA0B5]">
            <span className="h-2 w-2 rounded-full bg-[#2DD4BF]" />
            Auto-syncing every 5s
          </span>
        </motion.header>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:mb-10">
          <Stat
            icon={<Users size={22} />}
            label="Total Users"
            value={stats.totalUsers || 0}
          />
          <Stat
            icon={<Layers size={22} />}
            label="Total Vehicles"
            value={stats.totalVehicles || 0}
          />
          <Stat
            icon={<Activity size={22} />}
            label="Active Inquiries"
            value={stats.totalInquiries || 0}
          />
        </div>

        {/* MODERATION GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* USER MANAGEMENT */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <h2
                className="text-lg font-semibold text-white sm:text-xl"
                style={display}
              >
                User management
              </h2>
              <span
                className="rounded-md bg-[#102238] px-2.5 py-1 text-xs text-[#8EA0B5]"
                style={mono}
              >
                {users.length}
              </span>
            </div>

            <div className="space-y-3">
              {users.slice(0, 5).map((user) => {
                const isBlocked = user.status === "block";
                return (
                  <div
                    key={user._id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5 transition-colors hover:border-white/20 sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-300">
                            <ShieldAlert size={12} />
                            Blocked
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs capitalize text-[#8EA0B5]">
                        {user.role || "member"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleUserToggle(user)}
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors sm:w-auto ${focusRing} ${
                        isBlocked
                          ? "border border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#2DD4BF] hover:bg-[#2DD4BF]/20"
                          : "border border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                      }`}
                    >
                      {isBlocked ? (
                        <>
                          <ShieldCheck size={14} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={14} />
                          Block
                        </>
                      )}
                    </button>
                  </div>
                );
              })}

              {users.length === 0 && (
                <p className="rounded-xl border border-dashed border-white/10 py-8 text-center text-sm text-[#8EA0B5]">
                  No users found.
                </p>
              )}
            </div>
          </section>

          {/* VEHICLE APPROVAL */}
          <section className="rounded-2xl border border-white/10 bg-[#0D1D33] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <h2
                className="text-lg font-semibold text-white sm:text-xl"
                style={display}
              >
                Pending approvals
              </h2>
              <span
                className="rounded-md bg-[#102238] px-2.5 py-1 text-xs text-[#2DD4BF]"
                style={mono}
              >
                {vehicles.length}
              </span>
            </div>

            {vehicles.length > 0 ? (
              <div className="space-y-3">
                {vehicles.slice(0, 5).map((v) => (
                  <div
                    key={v._id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0A1628]/80 p-3.5 transition-colors hover:border-[#2DD4BF]/30 sm:flex-row sm:items-center sm:p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {v.make} {v.model}
                      </p>
                      <p
                        className="mt-0.5 text-xs text-[#8EA0B5]"
                        style={mono}
                      >
                        ID: {v._id?.slice(-6)}
                      </p>
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleApprove(v._id)}
                        className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#2DD4BF] px-3 py-2 text-xs font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] sm:flex-initial ${focusRing}`}
                      >
                        <Check size={14} />
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(v._id)}
                        className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/15 bg-[#102238] px-3 py-2 text-xs font-semibold text-[#C8D3E0] transition-colors hover:border-rose-400/40 hover:text-rose-300 sm:flex-initial ${focusRing}`}
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 py-10 text-center">
                <p className="text-sm text-[#8EA0B5]">
                  No pending vehicles to review.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* SYSTEM LOGS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0D1D33] p-5 sm:p-6 lg:mt-8">
          <div className="mb-4 flex items-center gap-2.5 border-b border-white/10 pb-4">
            <Terminal size={18} className="text-[#2DD4BF]" />
            <h2
              className="text-lg font-semibold text-white sm:text-xl"
              style={display}
            >
              System logs
            </h2>
          </div>

          {stats.recentActivities?.length ? (
            <ul className="divide-y divide-white/10">
              {stats.recentActivities.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 py-3 text-sm text-[#C8D3E0] first:pt-1 last:pb-1"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]" />
                  <p className="leading-relaxed">{a.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 text-sm text-[#8EA0B5]">
              No recent activity recorded.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1D33] p-5 transition-colors hover:border-[#2DD4BF]/40 hover:bg-[#102238] sm:p-6"
  >
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]">
        {label}
      </p>
      <p
        className="mt-2 text-2xl font-bold text-white sm:text-3xl"
        style={display}
      >
        {value}
      </p>
    </div>
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>
  </motion.div>
);

export default AdminDashboard;  