import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">

      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

      <Sidebar role={role} isOpen={isOpen} />

      <main className="flex-1 pt-20 p-6 text-gray-200 w-full">
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;