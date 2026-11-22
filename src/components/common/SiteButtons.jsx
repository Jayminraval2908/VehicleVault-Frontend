import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { focusRing } from "../../utils/theme";

const MotionLink = motion.create(Link);

export function PrimaryLink({ to, children, className = "" }) {
  return (
    <MotionLink
      to={to}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] ${focusRing} ${className}`}
    >
      {children}
    </MotionLink>
  );
}

export function OutlineLink({ to, children, className = "" }) {
  return (
    <MotionLink
      to={to}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center rounded-lg border border-[#C8D3E0]/40 px-6 py-3.5 font-semibold text-white transition-colors hover:border-[#2DD4BF] hover:text-[#2DD4BF] ${focusRing} ${className}`}
    >
      {children}
    </MotionLink>
  );
}