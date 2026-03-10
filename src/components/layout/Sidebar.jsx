import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ role, isOpen }) => {

  const buyerMenu = [
    { name: "Dashboard", path: "/buyer-dashboard" },
    { name: "Browse Cars", path: "/browse" },
    { name: "Saved Cars", path: "/saved" },
    { name: "Messages", path: "/messages" },
  ];

  const sellerMenu = [
    { name: "Dashboard", path: "/seller-dashboard" },
    { name: "Add Car", path: "/add-car" },
    { name: "My Listings", path: "/my-listings" },
    { name: "Inquiries", path: "/inquiries" },
  ];

  const adminMenu = [
    { name: "Dashboard", path: "/admin-dashboard" },
    { name: "Users", path: "/users" },
    { name: "Listings", path: "/listings" },
    { name: "Reports", path: "/reports" },
  ];

  const menu =
    role === "buyer"
      ? buyerMenu
      : role === "seller"
        ? sellerMenu
        : adminMenu;

  return (
    <aside
      className={`bg-white/5 backdrop-blur-xl border-r border-white/10
  text-gray-200 w-64 min-h-screen pt-20 px-4 fixed md:relative
  transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {menu.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `block px-4 py-3 rounded-lg mb-2 transition-all duration-300 ${isActive
              ? "bg-amber-500 text-black font-semibold"
              : "hover:bg-white/10 hover:text-white"
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar; 