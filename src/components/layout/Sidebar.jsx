// import React from "react";
// import { NavLink } from "react-router-dom";
// import { FaCar, FaUsers, FaChartLine, FaDollarSign, FaEnvelope } from "react-icons/fa";

// const Sidebar = ({ role, isOpen }) => {

//   const menus = {
//     buyer: [
//       { name: "Dashboard", path: "/buyer", icon: <FaChartLine /> },
//       { name: "Browse Cars", path: "/browse", icon: <FaCar /> },
//       { name: "Saved Cars", path: "/saved", icon: <FaDollarSign /> },
//       { name: "Messages", path: "/messages", icon: <FaEnvelope /> },
//     ],

//     seller: [
//       { name: "Dashboard", path: "/seller", icon: <FaChartLine /> },
//       { name: "Add Car", path: "/add-car", icon: <FaCar /> },
//       { name: "My Listings", path: "/my-listings", icon: <FaDollarSign /> },
//       { name: "Inquiries", path: "/inquiries", icon: <FaEnvelope /> },
//     ],

//     admin: [
//       { name: "Dashboard", path: "/admin", icon: <FaChartLine /> },
//       { name: "Users", path: "/users", icon: <FaUsers /> },
//       { name: "Listings", path: "/listings", icon: <FaCar /> },
//       { name: "Reports", path: "/reports", icon: <FaDollarSign /> },
//     ]
//   };

//   const menu = menus[role] || [];

//   return (
//     <aside
//       className={`bg-gray-900 text-yellow-400 w-64 min-h-screen pt-24 px-4 fixed md:relative
//       shadow-xl transition-transform duration-300
//       ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
//     >

//       {/* Logo */}
//       <div className="absolute top-6 left-4 text-2xl font-bold tracking-wider">
//         Vehicle Vault
//       </div>

//       {/* Menu */}
//       {menu.map((item, index) => (
//         <NavLink
//           key={index}
//           to={item.path}
//           className={({ isActive }) =>
//             `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-300
//             ${isActive
//               ? "bg-yellow-500 text-gray-900 font-semibold"
//               : "hover:bg-yellow-500 hover:text-gray-900"}`
//           }
//         >
//           <span className="text-lg">{item.icon}</span>
//           <span>{item.name}</span>
//         </NavLink>
//       ))}

//     </aside>
//   );
// };

// export default Sidebar;



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
  Users 
} from "lucide-react";

const Sidebar = ({ role, isOpen, onClose }) => {

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
      { name: "Add Listing", path: "/seller/add-vehicle", icon: <PlusCircle size={20} /> },
      { name: "View Market", path: "/vehicles", icon: <CarFront size={20} /> },
    ],

    admin: [
      { name: "System", path: "/admin/dashboard", icon: <ShieldCheck size={20} /> },
      { name: "Marketplace", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "Members", path: "/admin/users", icon: <Users size={20} /> }, // Placeholder for future feature
    ]
  };

  const menu = menus[role] || [];

  return (
    <>
      {/* Mobile Overlay Background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`bg-[#111111] border-r border-gray-800 w-64 min-h-screen fixed top-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Branding / Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-800 bg-[#0D0D0D]">
          <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
            Vehicle<span className="text-[#D4AF37]">Vault</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2 px-4">
            {role} Menu
          </p>
          
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={onClose} // Closes sidebar on mobile after clicking a link
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg"
                    : "text-gray-500 hover:bg-white/[0.02] hover:text-white border border-transparent"
                }`
              }
            >
              {item.icon}
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Bottom Profile/Logout Area (Optional placeholder) */}
        <div className="p-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 italic">V 3.0.1</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;