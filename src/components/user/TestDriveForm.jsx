import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, Info, Loader2 } from "lucide-react";
import FormField, { inputClass } from "../common/FormField";
import { focusRing } from "../../utils/theme";

const pad = (n) => String(n).padStart(2, "0");

const toLocalDateString = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatTime = (value) => {
  const [h, m] = value.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
};

export default function TestDriveForm({
  onSubmit,
  loading = false,
  openTime = "09:00",
  closeTime = "18:00",
  maxDaysAhead = 30,
  minLeadMinutes = 60,
}) {
  const uid = useId();
  const reduceMotion = useReducedMotion();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const busy = loading || submitting;
  const today = toLocalDateString(new Date());
  const maxDate = toLocalDateString(
    new Date(Date.now() + maxDaysAhead * 24 * 60 * 60 * 1000)
  );

  const validate = () => {
    const next = {};

    if (!date) {
      next.date = { message: "Choose a date" };
    } else if (date < today) {
      next.date = { message: "Choose today or a later date" };
    } else if (date > maxDate) {
      next.date = {
        message: `Choose a date within the next ${maxDaysAhead} days`,
      };
    }

    if (!time) {
      next.time = { message: "Choose a time" };
    } else if (time < openTime || time > closeTime) {
      next.time = {
        message: `Choose a time between ${formatTime(openTime)} and ${formatTime(closeTime)}`,
      };
    } else if (date && !next.date) {
      const slot = new Date(`${date}T${time}`);
      const earliest = Date.now() + minLeadMinutes * 60 * 1000;
      if (slot.getTime() < earliest) {
        next.time = {
          message:
            minLeadMinutes >= 60
              ? "Choose a time at least an hour from now"
              : `Choose a time at least ${minLeadMinutes} minutes from now`,
        };
      }
    }

    return next;
  };

  const clearError = (field) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const result = await onSubmit({ date, time });
      if (result !== false) {
        setDate("");
        setTime("");
      }
    } catch (err) {
      console.error("Test drive submit failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id={`${uid}-date`} label="Preferred date" error={errors.date}>
          <input
            id={`${uid}-date`}
            type="date"
            min={today}
            max={maxDate}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              clearError("date");
              clearError("time");
            }}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? `${uid}-date-error` : undefined}
            className={`${inputClass(errors.date)} [color-scheme:dark]`}
          />
        </FormField>

        <FormField
          id={`${uid}-time`}
          label="Preferred time"
          error={errors.time}
          hint={`Available ${formatTime(openTime)} to ${formatTime(closeTime)}`}
        >
          <input
            id={`${uid}-time`}
            type="time"
            min={openTime}
            max={closeTime}
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              clearError("time");
            }}
            aria-invalid={!!errors.time}
            aria-describedby={errors.time ? `${uid}-time-error` : undefined}
            className={`${inputClass(errors.time)} [color-scheme:dark]`}
          />
        </FormField>
      </div>

      <div className="flex gap-3 rounded-xl border border-white/10 bg-[#0A1628] p-4">
        <Info size={18} className="mt-0.5 shrink-0 text-[#2DD4BF]" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[#C8D3E0]">
          Bring your driver’s license. It will be checked when you arrive.
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={busy}
        whileHover={reduceMotion || busy ? undefined : { y: -2 }}
        whileTap={reduceMotion || busy ? undefined : { scale: 0.97 }}
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-6 py-3 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
      >
        {busy ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Booking...
          </>
        ) : (
          <>
            <CalendarCheck size={18} />
            Book test drive
          </>
        )}
      </motion.button>
    </form>
  );
}