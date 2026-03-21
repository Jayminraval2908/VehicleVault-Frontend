import React from "react";
import clsx from "clsx";

export default function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={clsx(
        "bg-[#111111] border border-gray-800 rounded-2xl p-6",
        "shadow-lg transition-all duration-300",
        hover && "hover:border-[#D4AF37]/40 hover:shadow-[#D4AF37]/5",
        className
      )}
    >
      {children}
    </div>
  );
}