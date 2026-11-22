import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { display, body, focusRing } from "../../utils/theme";

export default function AuthLayout({
  imageSrc,
  imageAlt,
  heading,
  blurb,
  children,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen bg-[#0A1628] text-[#C8D3E0]" style={body}>
      <div className="relative hidden h-screen w-1/2 overflow-hidden lg:sticky lg:top-0 lg:block">
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover"
          initial={reduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/50 to-[#0A1628]/20" />

        <Link
          to="/"
          className={`absolute left-10 top-8 text-xl font-bold text-white ${focusRing}`}
          style={display}
        >
          Vehicle<span className="text-[#2DD4BF]">Vault</span>
        </Link>

        <motion.div
          className="absolute bottom-12 left-10 right-10"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <h2
            className="max-w-md text-4xl font-bold leading-tight text-white"
            style={display}
          >
            {heading}
          </h2>
          <p className="mt-3 max-w-sm text-[#C8D3E0]">{blurb}</p>
        </motion.div>
      </div>

      <div className="flex min-h-screen w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link
            to="/"
            className={`text-xl font-bold text-white lg:invisible ${focusRing}`}
            style={display}
          >
            Vehicle<span className="text-[#2DD4BF]">Vault</span>
          </Link>
          <Link
            to="/"
            className={`flex items-center gap-2 text-sm text-[#C8D3E0] transition-colors hover:text-white ${focusRing}`}
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}