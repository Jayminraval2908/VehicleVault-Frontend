import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PendingVehicle from "./PendingVehicle";
import adminService from "../../services/adminService";
import { toast } from "react-toastify";

const MainLayout = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

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

  const handleApprove = async (id) => {
    try {
      await adminService.approveVehicle(id);
      toast.success("Vehicle Approved Successfully!");
      setPendingVehicles((prev) => prev.filter((v) => v._id !== id));
      setPendingCount((prev) => prev - 1);
      fetchPendingData();
    } catch (err) {
      console.error("Approval failed");
      toast.error("Failed to approve vehicle.");
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectVehicle(id);
      toast.error("Vehicle Listing Rejected!");
      setPendingVehicles((prev) => prev.filter((v) => v._id !== id));
      setPendingCount((prev) => prev - 1);
      fetchPendingData();
    } catch (err) {
      console.error("Rejection failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A1628] font-sans text-[#C8D3E0]">
      <Sidebar
        role={role}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pendingCount={pendingCount}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      <PendingVehicle
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        vehicles={pendingVehicles}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div className="flex min-h-screen flex-1 flex-col transition-all duration-300 md:ml-64">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} role={role} />

        <main className="w-full flex-1 overflow-x-hidden p-6 lg:p-10">
          <Outlet context={{ fetchPendingData }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;