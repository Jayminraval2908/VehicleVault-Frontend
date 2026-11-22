import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
}) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
}