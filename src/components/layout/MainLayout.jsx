// // import React, { useState } from "react";
// // import { Outlet } from "react-router-dom";
// // import Navbar from "./Navbar";
// // import Sidebar from "./Sidebar";
// // import adminService from "../../services/adminService";

// // const MainLayout = ({ role }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [pendingCount , setPendingCount] = useState(0);

// //   return (
// //     <div className="bg-[#0D0D0D] min-h-screen font-sans text-gray-200 flex">

// //       {/* Sidebar is fixed. 
// //         We pass onClose={() => setIsOpen(false)} so clicking a link on mobile closes the menu.
// //       */}
// //       <Sidebar
// //         role={role}
// //         isOpen={isOpen}
// //         onClose={() => setIsOpen(false)}
// //       />

// //       {/* Main Content Wrapper 
// //         md:ml-64 pushes the content to the right on desktop so it doesn't hide behind the 64-width Sidebar.
// //       */}
// //       <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">

// //         {/* Navbar sits at the top of the content area */}
// //         <Navbar toggleSidebar={() => setIsOpen(!isOpen)} role={role} />

// //         {/* The actual page content gets injected here */}
// //         <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
// //           <Outlet />
// //         </main>

// //       </div>

// //     </div>
// //   );
// // };

// // export default MainLayout;




// import React, { useState, useEffect } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import PendingVehicle from "./PendingVehicle";
// import adminService from "../../services/adminService"; // 🚩 Ensure this path is correct

// const MainLayout = ({ role }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 🚩 Drawer state
//   const [pendingVehicles, setPendingVehicles] = useState([]); // Store actual data for drawer
//   const [pendingCount, setPendingCount] = useState(0); // 🚩 State for the notification dot

//   // --- FETCH PENDING COUNT ---
//   const fetchCount = async () => {
//     try {
//       // We only need to fetch if the user is an Admin
//       if (role === "admin") {
//         const vehicles = await adminService.getPendingVehicles();
//         setPendingCount(vehicles?.length || 0);
//       }
//     } catch (err) {
//       console.error("Failed to sync pending count:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCount();

//     // 🔄 REAL-TIME SYNC: Refresh the count every 20 seconds 
//     // so the dot appears even if you don't refresh the page.
//     const interval = setInterval(fetchCount, 20000);
//     return () => clearInterval(interval);
//   }, [role]);

//   return (
//     <div className="bg-[#0D0D0D] min-h-screen font-sans text-gray-200 flex">
      
//       {/* 🚩 PASSING PENDING COUNT TO SIDEBAR */}
//       <Sidebar
//         role={role}
//         isOpen={isOpen}
//         onClose={() => setIsOpen(false)}
//         pendingCount={pendingCount} 
//       />

//       {/* Main Content Wrapper */}
//       <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        
//         <Navbar toggleSidebar={() => setIsOpen(!isOpen)} role={role} />

//         {/* The actual page content gets injected here */}
//         <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
//           {/* 🚩 We pass 'fetchCount' as context so children (like AdminDashboard) 
//               can trigger a refresh after they approve a car! */}
//           <Outlet context={{ fetchCount }} />
//         </main>

//       </div>
//     </div>
//   );
// };

// export default MainLayout;





import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PendingVehicle from "./PendingVehicle"; // 🚩 Ensure naming matches your file
import adminService from "../../services/adminService";
import { toast } from "react-toastify";

const MainLayout = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false); // Mobile Sidebar state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 🚩 Drawer state
  const [pendingVehicles, setPendingVehicles] = useState([]); // Store actual data for drawer
  const [pendingCount, setPendingCount] = useState(0);

  // --- FETCH PENDING DATA ---
  const fetchPendingData = async () => {
    try {
      if (role === "admin") {
        const vehicles = await adminService.getPendingVehicles();
        setPendingVehicles(vehicles || []);
        setPendingCount(vehicles?.length || 0);
      }
    } catch (err) {
      console.error("Failed to sync pending data:", err);
    }
  };

  useEffect(() => {
    fetchPendingData();
    const interval = setInterval(fetchPendingData, 20000);
    return () => clearInterval(interval);
  }, [role]);

  // --- HANDLERS FOR DRAWER ---
  const handleApprove = async (id) => {
    try {
      await adminService.approveVehicle(id);
      toast.success("Vehicle Approved Successfully! ✅")
      // Optimistic UI update: remove from local state immediately
      setPendingVehicles((prev) => prev.filter((v) => v._id !== id));
      setPendingCount((prev) => prev - 1);
      fetchPendingData(); // Re-sync with server
    } catch (err) {
      console.error("Approval failed");
      toast.error("Failed to approve vehicle. ❌");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectVehicle(id);
      toast.error("Vehicle Listing Rejected! 🚫")
      setPendingVehicles((prev) => prev.filter((v) => v._id !== id));
      setPendingCount((prev) => prev - 1);
      fetchPendingData();
    } catch (err) {
      console.error("Rejection failed");
    }
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen font-sans text-gray-200 flex">
      
      {/* SIDEBAR */}
      <Sidebar
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pendingCount={pendingCount}
        onOpenDrawer={() => setIsDrawerOpen(true)} // 🚩 Function to trigger drawer
      />

      {/* 🚩 PENDING VEHICLES SLIDE-OVER DRAWER */}
      <PendingVehicle
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        vehicles={pendingVehicles}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} role={role} />

        <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
          {/* Provide fetchPendingData to children so they can refresh the sidebar dot */}
          <Outlet context={{ fetchPendingData }} />
        </main>

      </div>
    </div>
  );
};

export default MainLayout;