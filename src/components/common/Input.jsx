import React from "react";
import clsx from "clsx";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  className = "",
}) {
  return (
    <div className="w-full flex flex-col gap-1">
      
      {label && (
        <label className="text-sm text-gray-400 font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={clsx(
          "w-full px-4 py-2 rounded-xl",
          "bg-[#0D0D0D] border border-gray-700",
          "text-gray-200 placeholder-gray-500",
          "focus:outline-none focus:border-[#D4AF37]",
          "focus:ring-1 focus:ring-[#D4AF37]",
          "transition-all duration-300",
          className
        )}
      />
    </div>
  );
}