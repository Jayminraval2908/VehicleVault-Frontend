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