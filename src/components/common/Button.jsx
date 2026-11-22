import React from "react";
import clsx from "clsx";
import { motion, useReducedMotion } from "framer-motion";
import { body, focusRing } from "../../utils/theme";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const reduceMotion = useReducedMotion();

  const baseStyle =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 select-none";

  const sizes = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-sm sm:text-base",
  };

  const variants = {
    primary:
      "bg-[#2DD4BF] text-[#0A1628] hover:bg-[#5EEAD4] shadow-sm shadow-[#2DD4BF]/15",
    outline:
      "border border-[#2DD4BF]/50 bg-[#0D1D33]/60 text-[#2DD4BF] hover:border-[#2DD4BF] hover:bg-[#2DD4BF] hover:text-[#0A1628]",
    ghost:
      "text-[#C8D3E0] hover:bg-white/5 hover:text-[#2DD4BF]",
    danger:
      "border border-rose-400/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 hover:text-white",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={body}
      whileTap={disabled || reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
      className={clsx(
        baseStyle,
        sizes[size],
        variants[variant],
        focusRing,
        disabled && "cursor-not-allowed opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}