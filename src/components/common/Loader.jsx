import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { display, body } from "../../utils/theme";

export default function Loader({
  size = "md",
  fullScreen = false,
  label = "Loading...",
}) {
  const reduceMotion = useReducedMotion();

  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-14 w-14 border-4",
  };

  const spinner = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="flex flex-col items-center justify-center gap-3"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizes[size]} rounded-full border-white/10 border-t-[#2DD4BF] animate-spin`}
        />
        {size === "lg" && (
          <span className="sr-only">{label}</span>
        )}
      </div>

      {fullScreen && (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0.5 }}
          animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs font-medium tracking-wider text-[#8EA0B5] uppercase"
          style={display}
        >
          {label}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="flex min-h-screen w-full items-center justify-center bg-[#0A1628] px-4 text-[#C8D3E0]"
        style={body}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center py-6">
      {spinner}
    </div>
  );
}