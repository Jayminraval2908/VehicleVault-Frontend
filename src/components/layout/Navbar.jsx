import React, { useState } from "react";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);

  return (

    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10
px-6 py-3 flex items-center justify-between fixed w-full z-50">

      <div className="flex items-center gap-3">
        <button className="md:hidden text-gray-300" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>

        <h1 className="text-2xl font-bold text-amber-400">
          Vehicle Vault
        </h1>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/10 text-gray-200
      px-4 py-2 rounded-full hover:bg-white/20 transition"
        >
          Profile
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-white/10
      shadow-lg rounded-lg p-2 text-gray-200">

            <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded">
              My Profile
            </button>

            <button className="block w-full text-left px-3 py-2 hover:bg-white/10 rounded text-amber-400">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;