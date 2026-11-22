import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import SiteLayout from "../components/layout/SiteLayout";
import Reveal from "../components/common/Reveal";
import { display, focusRing } from "../utils/theme";

const TEAM = [
  {
    name: "Jaymin Raval",
    email: "ravaljaymin2908@gmail.com",
    phone: "+91 99253 96071",
    tel: "+919925396071",
  },
  {
    name: "Dhyey Soni",
    email: "dhyeysoni201@gmail.com",
    phone: "+91 93270 99839",
    tel: "+919327099839",
  },
];

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const inputClass = (hasError) =>
  `w-full rounded-lg border bg-[#0A1628] px-4 py-3 text-white placeholder:text-[#8EA0B5]/70 outline-none transition-colors focus:border-[#2DD4BF] focus:ring-1 focus:ring-[#2DD4BF] ${
    hasError ? "border-red-400" : "border-white/15"
  }`;

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-1.5 text-sm text-red-400"
          >
            {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const reduceMotion = useReducedMotion();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { fullName: "", email: "", message: "" },
  });

  const onSubmit = async (data) => {
    setSent(false);

    try {
      const res = await axios.post("/contact", {
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        message: data.message.trim(),
      });

      if (res.data?.success) {
        toast.success("Message sent. We’ll reply by email.");
        setSent(true);
        reset();
      } else {
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Contact error:", error);

      if (error.response) {
        toast.error(error.response.data?.message || "Server error");
      } else if (error.request) {
        toast.error("Server not responding. Try again in a minute.");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20">
        <motion.div
          variants={heroContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <motion.h1
            variants={heroItem}
            className="max-w-2xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={display}
          >
            Talk to the team.
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="mt-5 max-w-lg text-base leading-relaxed text-[#C8D3E0] sm:text-lg"
          >
            Have a question about a vehicle, an account, or listing your own?
            Send a message or reach us directly.
          </motion.p>
        </motion.div>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-14">
          <ul className="divide-y divide-white/10 self-start border-y border-white/10">
            {TEAM.map((person, i) => (
              <Reveal as="li" key={person.email} delay={i * 0.1} className="py-6">
                <h2
                  className="text-xl font-semibold text-white"
                  style={display}
                >
                  {person.name}
                </h2>
                <div className="mt-3 space-y-2 text-[#C8D3E0]">
                  <a
                    href={`mailto:${person.email}`}
                    className={`flex items-center gap-3 break-all transition-colors hover:text-[#2DD4BF] ${focusRing}`}
                  >
                    <Mail size={18} className="shrink-0 text-[#2DD4BF]" />
                    {person.email}
                  </a>
                  <a
                    href={`tel:${person.tel}`}
                    className={`flex items-center gap-3 transition-colors hover:text-[#2DD4BF] ${focusRing}`}
                  >
                    <Phone size={18} className="shrink-0 text-[#2DD4BF]" />
                    {person.phone}
                  </a>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6 rounded-[1.5rem] border border-white/10 bg-[#0D1D33] p-6 sm:p-8"
            >
              <Field id="contact-name" label="Full name" error={errors.fullName}>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.fullName}
                  aria-describedby={
                    errors.fullName ? "contact-name-error" : undefined
                  }
                  className={inputClass(errors.fullName)}
                  {...register("fullName", {
                    required: "Enter your name",
                    validate: (v) => v.trim().length > 0 || "Enter your name",
                  })}
                />
              </Field>

              <Field id="contact-email" label="Email address" error={errors.email}>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  className={inputClass(errors.email)}
                  {...register("email", {
                    required: "Enter your email address",
                    pattern: {
                      value: EMAIL_REGEX,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </Field>

              <Field id="contact-message" label="Message" error={errors.message}>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Tell us what you need"
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  className={`${inputClass(errors.message)} resize-y`}
                  {...register("message", {
                    required: "Enter a message",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                    maxLength: {
                      value: 1000,
                      message: "Message must be 1000 characters or fewer",
                    },
                  })}
                />
              </Field>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={reduceMotion || isSubmitting ? undefined : { y: -2 }}
                whileTap={reduceMotion || isSubmitting ? undefined : { scale: 0.97 }}
                className={`w-full rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </motion.button>

              <AnimatePresence>
                {sent && (
                  <motion.p
                    role="status"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-[#2DD4BF]"
                  >
                    <CheckCircle2 size={18} className="shrink-0" />
                    Message sent. We’ll reply by email.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}