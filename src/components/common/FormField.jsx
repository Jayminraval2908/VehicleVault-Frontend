import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export const inputClass = (hasError) =>
  `w-full rounded-lg border bg-[#0A1628] px-4 py-3 text-white placeholder:text-[#8EA0B5]/70 outline-none transition-colors focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] ${
    hasError ? "border-red-400" : "border-white/15"
  }`;

export default function FormField({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="pt-1.5 text-sm text-[#8EA0B5]">{hint}</p>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1.5 text-sm text-red-400"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}