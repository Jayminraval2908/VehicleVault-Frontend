import React from "react";

export default function Loader({ size = "md", fullScreen = false }) {
  
  const sizes = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-4",
    lg: "w-16 h-16 border-4",
  };

  const loader = (
    <div
      className={`
        ${sizes[size]}
        border-[#D4AF37] border-t-transparent
        rounded-full animate-spin
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0D0D0D]">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      {loader}
    </div>
  );
}