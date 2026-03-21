import React from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative bg-[#111111] border border-gray-800 rounded-2xl w-[90%] max-w-lg p-6 shadow-xl animate-fadeIn">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#D4AF37]">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
}