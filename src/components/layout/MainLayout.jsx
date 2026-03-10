import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ role, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // <div className="flex">
    //   <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
    //   <Sidebar role={role} isOpen={isOpen} />

    //   <main className="flex-1 pt-20 p-6 bg-gray-100 min-h-screen w-full">
    //     {children}
    //   </main>
    // </div>
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen">
      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      <Sidebar role={role} isOpen={isOpen} />

      <main className="flex-1 pt-20 p-6 text-gray-200 w-full">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;  