import React from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { body } from "../../utils/theme";

export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      style={body}
      whileHover={hover && !reduceMotion ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl border border-white/10 bg-[#0D1D33] p-4 text-[#C8D3E0] shadow-lg sm:p-6",
        "transition-colors duration-200",
        hover &&
          "hover:border-[#2DD4BF]/40 hover:bg-[#102238] hover:shadow-[0_12px_30px_rgba(45,212,191,0.06)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}