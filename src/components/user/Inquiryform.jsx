import React, { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { focusRing } from "../../utils/theme";

export default function InquiryForm({
  onSubmit,
  loading = false,
  minLength = 10,
  maxLength = 500,
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;
  const nearLimit = message.length >= maxLength * 0.9;

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    if (error && value.trim().length >= minLength) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const trimmed = message.trim();
    if (trimmed.length < minLength) {
      setError(
        `Write at least ${minLength} characters so the seller can help.`
      );
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const result = await onSubmit(trimmed);
      if (result !== false) setMessage("");
    } catch (err) {
      console.error("Inquiry submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <label
        htmlFor={`${id}-message`}
        className="flex items-center gap-2 text-sm font-medium text-white"
      >
        <MessageCircle size={16} className="text-[#2DD4BF]" />
        Message to the seller
      </label>

      <textarea
        id={`${id}-message`}
        value={message}
        onChange={handleChange}
        maxLength={maxLength}
        rows={5}
        placeholder="Ask about service history, ownership, or anything else."
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : `${id}-count`}
        className={`h-36 w-full resize-none rounded-xl border bg-[#0A1628] p-4 text-white placeholder:text-[#8EA0B5]/70 outline-none transition-colors focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] ${
          error ? "border-red-400" : "border-white/15"
        }`}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <AnimatePresence>
            {error && (
              <motion.p
                id={`${id}-error`}
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <p
          id={`${id}-count`}
          className={`shrink-0 text-sm tabular-nums ${
            nearLimit ? "text-amber-300" : "text-[#8EA0B5]"
          }`}
        >
          {message.length}/{maxLength}
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={reduceMotion || busy ? undefined : { y: -2 }}
        whileTap={reduceMotion || busy ? undefined : { scale: 0.97 }}
        className={`group flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
      >
        {busy ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
            Send inquiry
          </>
        )}
      </motion.button>
    </form>
  );
}