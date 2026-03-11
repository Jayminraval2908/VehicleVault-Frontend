import React from "react";
import { NavLink } from "react-router-dom";
import { FaCar, FaUsers, FaChartLine, FaDollarSign, FaEnvelope } from "react-icons/fa";

const Sidebar = ({ role, isOpen }) => {

  const menus = {
    buyer: [
      { name: "Dashboard", path: "/buyer", icon: <FaChartLine /> },
      { name: "Browse Cars", path: "/browse", icon: <FaCar /> },
      { name: "Saved Cars", path: "/saved", icon: <FaDollarSign /> },
      { name: "Messages", path: "/messages", icon: <FaEnvelope /> },
    ],

    seller: [
      { name: "Dashboard", path: "/seller", icon: <FaChartLine /> },
      { name: "Add Car", path: "/add-car", icon: <FaCar /> },
      { name: "My Listings", path: "/my-listings", icon: <FaDollarSign /> },
      { name: "Inquiries", path: "/inquiries", icon: <FaEnvelope /> },
    ],

    admin: [
      { name: "Dashboard", path: "/admin", icon: <FaChartLine /> },
      { name: "Users", path: "/users", icon: <FaUsers /> },
      { name: "Listings", path: "/listings", icon: <FaCar /> },
      { name: "Reports", path: "/reports", icon: <FaDollarSign /> },
    ]
  };

  const menu = menus[role] || [];

  return (
    <aside
      className={`bg-gray-900 text-yellow-400 w-64 min-h-screen pt-24 px-4 fixed md:relative
      shadow-xl transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >

      {/* Logo */}
      <div className="absolute top-6 left-4 text-2xl font-bold tracking-wider">
        Vehicle Vault
      </div>

      {/* Menu */}
      {menu.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all duration-300
            ${isActive
              ? "bg-yellow-500 text-gray-900 font-semibold"
              : "hover:bg-yellow-500 hover:text-gray-900"}`
          }
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}

    </aside>
  );
};

export default Sidebar;