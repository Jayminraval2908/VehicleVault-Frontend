import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CarFront,
  MessageSquare,
  DollarSign,
  Calendar,
  PlusCircle,
  ShieldCheck,
  Users,
  IndianRupeeIcon,
  Warehouse,
  Clock,
} from "lucide-react";
import { display } from "../../utils/theme";

const Sidebar = ({ role, isOpen, onClose, pendingCount = 0, onOpenDrawer }) => {
  const menus = {
    buyer: [
      { name: "Dashboard", path: "/buyer/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Collection", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "My Bids", path: "/buyer/offers", icon: <DollarSign size={20} /> },
      { name: "Inquiries", path: "/buyer/inquiries", icon: <MessageSquare size={20} /> },
      { name: "Test Drives", path: "/buyer/bookings", icon: <Calendar size={20} /> },
    ],
    seller: [
      { name: "Dashboard", path: "/seller/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Garage", path: "/seller/garage", icon: <Warehouse size={20} /> },
      { name: "Add Listing", path: "/seller/add-vehicle", icon: <PlusCircle size={20} /> },
      { name: "View Market", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "Inquiries", path: "/seller/inquiries", icon: <MessageSquare size={20} /> },
      { name: "Offers", path: "/seller/offers", icon: <IndianRupeeIcon size={20} /> },
      { name: "Test Drives", path: "/seller/test-drives", icon: <Calendar size={20} /> },
    ],
    admin: [
      { name: "System", path: "/admin/dashboard", icon: <ShieldCheck size={20} /> },
      { name: "Marketplace", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "Pending Vehicles", path: "#", icon: <Clock size={20} /> },
      { name: "Members", path: "/admin/users", icon: <Users size={20} /> },
    ],
  };

  const menu = menus[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex min-h-screen w-64 flex-col border-r border-white/10 bg-[#0A1628] transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-center border-b border-white/10 bg-[#0D1D33]">
          <h1
            className="text-xl font-black uppercase tracking-[0.2em] text-white"
            style={display}
          >
            Vehicle<span className="text-[#2DD4BF]">Vault</span>
          </h1>
        </div>

        {/* Menu */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-[#8EA0B5]">
            {role} Menu
          </p>

          {menu.map((item, index) => {
            const isPendingItem =
              item.name === "Pending Vehicles" && role === "admin";

            const base =
              "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200";

            if (isPendingItem) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    onOpenDrawer();
                    onClose();
                  }}
                  className={`${base} border border-transparent text-[#8EA0B5] hover:bg-white/[0.04] hover:text-white`}
                >
                  <div className="relative">
                    {item.icon}
                    {pendingCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2DD4BF] opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0A1628] bg-[#2DD4BF]" />
                      </span>
                    )}
                  </div>
                  <span className="flex-1 tracking-wide">{item.name}</span>
                  {pendingCount > 0 && (
                    <span className="rounded-md bg-[#2DD4BF] px-1.5 py-0.5 text-[10px] font-bold text-[#0A1628]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `${base} ${
                    isActive
                      ? "border border-[#2DD4BF]/25 bg-[#2DD4BF]/10 text-[#2DD4BF] shadow-sm"
                      : "border border-transparent text-[#8EA0B5] hover:bg-white/[0.04] hover:text-white"
                  }`
                }
              >
                <div className="relative">{item.icon}</div>
                <span className="flex-1 tracking-wide">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 text-center">
          <p className="text-[10px] uppercase tracking-widest text-[#8EA0B5]">
            Identity Verified
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;