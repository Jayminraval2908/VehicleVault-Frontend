import React, { useEffect, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { display, body, focusRing } from "../../utils/theme";

export default function Modal({ isOpen, onClose, title, children }) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          style={body}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* BACKDROP */}
          <motion.div
            aria-hidden="true"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050C17]/80 backdrop-blur-sm"
          />

          {/* MODAL BOX */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={
              reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }
            }
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/15 bg-[#0D1D33] p-5 text-[#C8D3E0] shadow-2xl sm:p-6"
          >
            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-3.5">
              {title ? (
                <h2
                  id={titleId}
                  style={display}
                  className="text-lg font-bold tracking-tight text-white sm:text-xl"
                >
                  {title}
                </h2>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2DD4BF]">
                  Vault Dialog
                </span>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={`rounded-lg p-1.5 text-[#8EA0B5] transition-colors hover:bg-white/5 hover:text-[#2DD4BF] ${focusRing}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="text-sm leading-relaxed text-[#C8D3E0]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}