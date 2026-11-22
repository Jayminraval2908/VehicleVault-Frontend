import React, { useId } from "react";
import clsx from "clsx";
import { body, mono, focusRing } from "../../utils/theme";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  error = "",
  required = false,
  disabled = false,
  className = "",
  ...props
}) {
  const inputId = useId();
  const isNumeric = type === "number";

  return (
    <div style={body} className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wider text-[#8EA0B5]"
        >
          {label}
          {required && <span className="ml-1 text-[#2DD4BF]">*</span>}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={isNumeric ? mono : undefined}
        className={clsx(
          "w-full rounded-xl border bg-[#0A1628] px-4 py-2.5 text-sm text-white placeholder-[#8EA0B5] sm:py-3",
          "transition-colors duration-200 focus:outline-none",
          error
            ? "border-rose-400/50 focus:border-rose-400"
            : "border-white/15 focus:border-[#2DD4BF]",
          focusRing,
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs font-medium text-rose-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}