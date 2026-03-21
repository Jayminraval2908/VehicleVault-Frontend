import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#0D0D0D] min-h-screen font-sans text-gray-200 flex">
      
      {/* Sidebar is fixed. 
        We pass onClose={() => setIsOpen(false)} so clicking a link on mobile closes the menu.
      */}
      <Sidebar 
        role={role} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />

      {/* Main Content Wrapper 
        md:ml-64 pushes the content to the right on desktop so it doesn't hide behind the 64-width Sidebar.
      */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64 transition-all duration-300">
        
        {/* Navbar sits at the top of the content area */}
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} role={role} />

        {/* The actual page content gets injected here */}
        <main className="flex-1 p-6 lg:p-10 w-full overflow-x-hidden">
          <Outlet />
        </main>
        
      </div>

    </div>
  );
};

export default MainLayout;