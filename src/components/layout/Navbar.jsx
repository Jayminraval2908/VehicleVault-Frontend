import React, { useState } from "react";
import { Menu, User, LogOut, ChevronDown, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, role }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#0A1628]/80 px-6 backdrop-blur-xl">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="text-[#8EA0B5] transition hover:text-[#2DD4BF] md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        <div className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] sm:flex">
          <span className="rounded border border-[#2DD4BF]/20 bg-[#2DD4BF]/10 px-2 py-1 text-[#2DD4BF]">
            {role || user?.role || "Guest"}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-white">
            {isAuthenticated ? "Live Session" : "Public Access"}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="relative">
        {isAuthenticated ? (
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#102238] px-4 py-2 text-[#C8D3E0] shadow-lg transition hover:border-[#2DD4BF]/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#2DD4BF] to-[#3B82F6] text-xs font-bold text-[#0A1628]">
              {user?.firstName ? (
                user.firstName.charAt(0).toUpperCase()
              ) : (
                <User size={16} />
              )}
            </div>

            <div className="hidden text-left md:block">
              <p className="text-[11px] font-black uppercase leading-none text-white">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : "SECURE USER"}
              </p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-tighter text-[#8EA0B5]">
                Account Settings
              </p>
            </div>

            <ChevronDown
              size={14}
              className={`text-[#8EA0B5] transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#0A1628] transition hover:bg-[#2DD4BF]/90"
          >
            <LogIn size={16} />
            Authorize
          </button>
        )}

        {/* Dropdown */}
        {open && isAuthenticated && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-white/10 bg-[#102238] p-2 shadow-2xl">
              <div className="mb-2 border-b border-white/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#8EA0B5]">
                  Active Identity
                </p>
                <p className="truncate text-sm font-bold text-[#2DD4BF]">
                  {user?.email || "Encrypted"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10"
              >
                <LogOut size={16} />
                Terminate Session
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;