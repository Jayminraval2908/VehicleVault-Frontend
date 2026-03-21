import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const baseStyle =
    "px-4 py-2 rounded-xl font-medium transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-[#D4AF37] text-black hover:bg-[#c9a633] shadow-lg shadow-[#D4AF37]/20",
    outline:
      "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
    ghost:
      "text-[#D4AF37] hover:bg-[#D4AF37]/10",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyle,
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}