// // import React from "react";
// // import { NavLink } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   CarFront,
// //   MessageSquare,
// //   DollarSign,
// //   Calendar,
// //   PlusCircle,
// //   ShieldCheck,
// //   Users,
// //   IndianRupeeIcon,
// //   Warehouse
// // } from "lucide-react";
// // import { path } from "framer-motion/m";

// // const Sidebar = ({ role, isOpen, onClose }) => {

// //   const menus = {
// //     buyer: [
// //       { name: "Dashboard", path: "/buyer/dashboard", icon: <LayoutDashboard size={20} /> },
// //       { name: "Collection", path: "/vehicles", icon: <CarFront size={20} /> },
// //       { name: "My Bids", path: "/buyer/offers", icon: <DollarSign size={20} /> },
// //       { name: "Inquiries", path: "/buyer/inquiries", icon: <MessageSquare size={20} /> },
// //       { name: "Test Drives", path: "/buyer/bookings", icon: <Calendar size={20} /> },
// //     ],

// //     seller: [
// //       { name: "Dashboard", path: "/seller/dashboard", icon: <LayoutDashboard size={20} /> },
// //       { name: "My Garage" , path :"/seller/garage", icon:<Warehouse  size={20}/> }, 
// //       { name: "Add Listing", path: "/seller/add-vehicle", icon: <PlusCircle size={20} /> },
// //       { name: "View Market", path: "/vehicles", icon: <CarFront size={20} /> },
// //       { name: "Inquiries", path: "/seller/inquiries", icon: <MessageSquare size={20} /> },
// //       { name: "Offers" , path:"/seller/offers", icon: <IndianRupeeIcon size={20}/> },
// //       { name: "Test Drives", path: "/seller/test-drives", icon: <Calendar size={20} /> } 

// //     ],

// //     admin: [
// //       { name: "System", path: "/admin/dashboard", icon: <ShieldCheck size={20} /> },
// //       { name: "Marketplace", path: "/vehicles", icon: <CarFront size={20} /> },
// //       { name: "Members", path: "/admin/users", icon: <Users size={20} /> }, // Placeholder for future feature
// //     ]
// //   };

// //   const menu = menus[role] || [];

// //   return (
// //     <>
// //       {/* Mobile Overlay Background */}
// //       {isOpen && (
// //         <div
// //           className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
// //           onClick={onClose}
// //         />
// //       )}

// //       {/* Sidebar Container */}
// //       <aside
// //         className={`bg-[#111111] border-r border-gray-800 w-64 min-h-screen fixed top-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
// //           }`}
// //       >
// //         {/* Branding / Logo */}
// //         <div className="h-20 flex items-center justify-center border-b border-gray-800 bg-[#0D0D0D]">
// //           <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
// //             Vehicle<span className="text-[#D4AF37]">Vault</span>
// //           </h1>
// //         </div>

// //         {/* Navigation Links */}
// //         <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
// //           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2 px-4">
// //             {role} Menu
// //           </p>

// //           {menu.map((item, index) => (
// //             <NavLink
// //               key={index}
// //               to={item.path}
// //               onClick={onClose} // Closes sidebar on mobile after clicking a link
// //               className={({ isActive }) =>
// //                 `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
// //                   ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg"
// //                   : "text-gray-500 hover:bg-white/[0.02] hover:text-white border border-transparent"
// //                 }`
// //               }
// //             >
// //               {item.icon}
// //               <span className="text-sm tracking-wide">{item.name}</span>
// //             </NavLink>
// //           ))}
// //         </div>

// //         {/* Bottom Profile/Logout Area */}
// //         <div className="p-4 border-t border-gray-800 text-center">
// //           <p className="text-xs text-gray-500 italic uppercase tracking-widest">
// //             Identity Verified
// //           </p>
// //         </div>
// //       </aside>
// //     </>
// //   );
// // };

// // export default Sidebar;



// import React from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   CarFront,
//   MessageSquare,
//   DollarSign,
//   Calendar,
//   PlusCircle,
//   ShieldCheck,
//   Users,
//   IndianRupeeIcon,
//   Warehouse,
//   Clock
// } from "lucide-react";

// // 🚩 Added 'pendingCount' as a prop
// const Sidebar = ({ role, isOpen, onClose, pendingCount = 0 }) => {

//   const menus = {
//     buyer: [
//       { name: "Dashboard", path: "/buyer/dashboard", icon: <LayoutDashboard size={20} /> },
//       { name: "Collection", path: "/vehicles", icon: <CarFront size={20} /> },
//       { name: "My Bids", path: "/buyer/offers", icon: <DollarSign size={20} /> },
//       { name: "Inquiries", path: "/buyer/inquiries", icon: <MessageSquare size={20} /> },
//       { name: "Test Drives", path: "/buyer/bookings", icon: <Calendar size={20} /> },
//     ],

//     seller: [
//       { name: "Dashboard", path: "/seller/dashboard", icon: <LayoutDashboard size={20} /> },
//       { name: "My Garage" , path :"/seller/garage", icon:<Warehouse  size={20}/> }, 
//       { name: "Add Listing", path: "/seller/add-vehicle", icon: <PlusCircle size={20} /> },
//       { name: "View Market", path: "/vehicles", icon: <CarFront size={20} /> },
//       { name: "Inquiries", path: "/seller/inquiries", icon: <MessageSquare size={20} /> },
//       { name: "Offers" , path:"/seller/offers", icon: <IndianRupeeIcon size={20}/> },
//       { name: "Test Drives", path: "/seller/test-drives", icon: <Calendar size={20} /> } 
//     ],

//     admin: [
//       { name: "System", path: "/admin/dashboard", icon: <ShieldCheck size={20} /> },
//       { name: "Marketplace", path: "/vehicles", icon: <CarFront size={20} /> },
//       { name: "Pending Vehicles", path: "/admin/pending-vehicles", icon:<Clock size={20}/>},
//       { name: "Members", path: "/admin/users", icon: <Users size={20} /> },
//     ]
//   };

//   const menu = menus[role] || [];

//   return (
//     <>
//       {/* Mobile Overlay Background */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
//           onClick={onClose}
//         />
//       )}

//       {/* Sidebar Container */}
//       <aside
//         className={`bg-[#111111] border-r border-gray-800 w-64 min-h-screen fixed top-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         {/* Branding / Logo */}
//         <div className="h-20 flex items-center justify-center border-b border-gray-800 bg-[#0D0D0D]">
//           <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
//             Vehicle<span className="text-[#D4AF37]">Vault</span>
//           </h1>
//         </div>

//         {/* Navigation Links */}
//         <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
//           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2 px-4">
//             {role} Menu
//           </p>

//           {menu.map((item, index) => (
//             <NavLink
//               key={index}
//               to={item.path}
//               onClick={onClose}
//               className={({ isActive }) =>
//                 `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium group ${
//                   isActive
//                     ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg"
//                     : "text-gray-500 hover:bg-white/[0.02] hover:text-white border border-transparent"
//                 }`
//               }
//             >
//               <div className="relative">
//                 {item.icon}
                
//                 {/* 🚩 NOTIFICATION DOT LOGIC */}
//                 {/* Shows only for Admin on the 'Marketplace' link if count > 0 */}
//                 {role === "admin" && item.name === "Marketplace" && pendingCount > 0 && (
//                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-[#111111]"></span>
//                   </span>
//                 )}
//               </div>

//               <span className="text-sm tracking-wide flex-1">{item.name}</span>

//               {/* 🚩 OPTIONAL: NUMBER BADGE AT THE END */}
//               {role === "admin" && item.name === "Marketplace" && pendingCount > 0 && (
//                 <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-md shadow-sm group-hover:scale-110 transition-transform">
//                   {pendingCount}
//                 </span>
//               )}
//             </NavLink>
//           ))}
//         </div>

//         {/* Bottom Area */}
//         <div className="p-4 border-t border-gray-800 text-center">
//           <p className="text-xs text-gray-500 italic uppercase tracking-widest">
//             Identity Verified
//           </p>
//         </div>
//       </aside>
//     </>
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
  Users,
  IndianRupeeIcon,
  Warehouse,
  Clock
} from "lucide-react";

// 🚩 Added 'onOpenDrawer' prop to handle the sidebar click
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
      { name: "My Garage" , path :"/seller/garage", icon:<Warehouse  size={20}/> }, 
      { name: "Add Listing", path: "/seller/add-vehicle", icon: <PlusCircle size={20} /> },
      { name: "View Market", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "Inquiries", path: "/seller/inquiries", icon: <MessageSquare size={20} /> },
      { name: "Offers" , path:"/seller/offers", icon: <IndianRupeeIcon size={20}/> },
      { name: "Test Drives", path: "/seller/test-drives", icon: <Calendar size={20} /> } 
    ],

    admin: [
      { name: "System", path: "/admin/dashboard", icon: <ShieldCheck size={20} /> },
      { name: "Marketplace", path: "/vehicles", icon: <CarFront size={20} /> },
      { name: "Pending Vehicles", path: "#", icon: <Clock size={20} /> }, // 🚩 Changed path to # for drawer
      { name: "Members", path: "/admin/users", icon: <Users size={20} /> },
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
        <div className="h-20 flex items-center justify-center border-b border-gray-800 bg-[#0D0D0D]">
          <h1 className="text-xl font-black uppercase tracking-[0.2em] text-white">
            Vehicle<span className="text-[#D4AF37]">Vault</span>
          </h1>
        </div>

        <div className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-2 px-4">
            {role} Menu
          </p>

          {menu.map((item, index) => {
            // 🚩 Logic to render a Button for Pending Vehicles instead of a Link
            const isPendingItem = item.name === "Pending Vehicles" && role === "admin";

            const commonStyles = `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-medium group w-full text-left`;
            const activeStyles = `bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-lg`;
            const inactiveStyles = `text-gray-500 hover:bg-white/[0.02] hover:text-white border border-transparent`;

            if (isPendingItem) {
              return (
                <button
                  key={index}
                  onClick={() => {
                    onOpenDrawer(); // Opens the PendingVehicleDrawer
                    onClose();      // Closes sidebar on mobile
                  }}
                  className={`${commonStyles} ${inactiveStyles}`}
                >
                  <div className="relative">
                    {item.icon}
                    {pendingCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-[#111111]"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-sm tracking-wide flex-1">{item.name}</span>
                  {pendingCount > 0 && (
                    <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-md">
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
                  `${commonStyles} ${isActive ? activeStyles : inactiveStyles}`
                }
              >
                <div className="relative">
                  {item.icon}
                </div>
                <span className="text-sm tracking-wide flex-1">{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500 italic uppercase tracking-widest">
            Identity Verified
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;