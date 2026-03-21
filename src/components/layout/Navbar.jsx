// import React, { useState } from "react";
// import { Menu } from "lucide-react";

// const Navbar = ({ toggleSidebar }) => {
//   const [open, setOpen] = useState(false);

//   return (

//     <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10
// px-6 py-3 flex items-center justify-between fixed w-full z-50">

//       <div className="flex items-center gap-3">
//         <button className="md:hidden text-gray-300" onClick={toggleSidebar}>
//           <Menu size={24} />
//         </button>

//         <h1 className="text-2xl font-bold text-amber-400">
//           Vehicle Vault
//         </h1>
//       </div>

//       <div className="relative">
//         <button
//           onClick={() => setOpen(!open)}
//           className="flex items-center gap-2 bg-white/10 text-gray-200
//       px-4 py-2 rounded-full hover:bg-white/20 transition"
//         >
//           Profile
//         </button>

//         {open && (
//           <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10
//       shadow-lg rounded-lg p-2 text-gray-200">

//             <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">
//               My Profile
//             </button>

//             <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded text-amber-400">
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import React, { useState } from "react";
// import { Menu, User, LogOut, ChevronDown } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const Navbar = ({ toggleSidebar, role }) => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();
//   const user = JSON.parse(localStorage.getItem("user")) || { name: "Collector" };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <nav className="h-20 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-40">

//       {/* Left Side: Mobile Toggle & Context */}
//       <div className="flex items-center gap-4">
//         <button 
//           className="md:hidden text-gray-400 hover:text-[#D4AF37] transition-colors" 
//           onClick={toggleSidebar}
//         >
//           <Menu size={24} />
//         </button>

//         {/* Breadcrumb style indicator */}
//         <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
//           <span className="text-[#D4AF37]">{role}</span>
//           <span className="opacity-20">/</span>
//           <span className="text-white">Live Session</span>
//         </div>
//       </div>

//       {/* Right Side: Profile Dropdown */}
//       <div className="relative">
//         <button
//           onClick={() => setOpen(!open)}
//           className="flex items-center gap-3 bg-[#111111] border border-gray-800 text-gray-200 px-4 py-2 rounded-xl hover:border-[#D4AF37]/50 transition-all shadow-lg"
//         >
//           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#fcf6ba] flex items-center justify-center text-black">
//             <User size={16} />
//           </div>
//           <span className="text-xs font-bold hidden md:block">{user.name}</span>
//           <ChevronDown size={14} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
//         </button>

//         {/* Dropdown Menu */}
//         {open && (
//           <>
//             {/* Invisible click-away overlay */}
//             <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>

//             <div className="absolute right-0 mt-3 w-56 bg-[#111111] border border-gray-800 shadow-2xl rounded-2xl p-2 text-gray-200 z-20 animate-in fade-in slide-in-from-top-2">
//               <div className="px-4 py-3 border-b border-gray-800 mb-2">
//                 <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Account Type</p>
//                 <p className="text-sm font-bold text-[#D4AF37] capitalize">{role}</p>
//               </div>

//               <button className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition text-sm">
//                 <User size={16} className="text-gray-500" />
//                 My Profile
//               </button>

//               <button 
//                 onClick={handleLogout}
//                 className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/10 rounded-xl transition text-sm text-red-500 font-bold"
//               >
//                 <LogOut size={16} />
//                 Sign Out
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState } from "react";
import { Menu, User, LogOut, ChevronDown, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar, role }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data from localStorage
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear(); // Clears token, user, and role
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="h-20 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 z-40">

      {/* Left Side: Role Indicator */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-gray-400 hover:text-[#D4AF37]"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Dynamic Role Badge */}
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20">
            {role || user?.role || "Guest"}
          </span>
          <span className="opacity-20 text-white">/</span>
          <span className="text-white">
            {isAuthenticated ? "Live Session" : "Public Access"}
          </span>
        </div>
      </div>

      {/* Right Side: Dynamic Name & Profile */}
      {/* Right Side: Profile / Auth Actions */}
      <div className="relative">
        {isAuthenticated ? (
          // --- Logged In View ---
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 bg-[#111111] border border-gray-800 text-gray-200 px-4 py-2 rounded-xl hover:border-[#D4AF37]/50 transition-all shadow-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#fcf6ba] flex items-center justify-center text-black font-bold text-xs">
              {user?.firstName ? user.firstName.charAt(0).toUpperCase() : <User size={16} />}
            </div>

            <div className="text-left hidden md:block">
              <p className="text-[11px] font-black leading-none text-white uppercase">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "SECURE USER"}
              </p>
              <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                Account Settings
              </p>
            </div>

            <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          // --- Guest View (Login Button) ---
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#fcf6ba] transition-all"
          >
            <LogIn size={16} />
            Authorize
          </button>
        )}

        {/* Dropdown Menu */}
        {open && isAuthenticated && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)}></div>
            <div className="absolute right-0 mt-3 w-56 bg-[#111111] border border-gray-800 shadow-2xl rounded-2xl p-2 z-20">
              <div className="px-4 py-3 border-b border-gray-800 mb-2">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active Identity</p>
                <p className="text-sm font-bold text-[#D4AF37] truncate">{user?.email || "Encrypted"}</p>
              </div>

              <button className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl transition text-sm text-gray-300">
                <Shield size={16} className="text-gray-500" />
                Security Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/10 rounded-xl transition text-sm text-red-500 font-bold"
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