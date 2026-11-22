import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  ClipboardCheck,
  CalendarClock,
  BadgeDollarSign,
} from "lucide-react";
import SiteLayout from "../components/layout/SiteLayout";
import Reveal from "../components/common/Reveal";
import { PrimaryLink, OutlineLink } from "../components/common/SiteButtons";
import { display } from "../utils/theme";

const ROUTES = {
  signup: "/signup",
  inventory: "/login",
};

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: "Vetted sellers",
    text: "Every seller has an account and a contact number on file, so each listing has a real person behind it.",
  },
  {
    Icon: ClipboardCheck,
    title: "Inspection reports",
    text: "Listings can carry an inspection report. Read the condition details before you spend a day travelling.",
  },
  {
    Icon: CalendarClock,
    title: "Test drives on request",
    text: "Pick a vehicle, choose a slot, and the seller confirms. No phone tag.",
  },
  {
    Icon: BadgeDollarSign,
    title: "Offers, not guesswork",
    text: "Send an offer straight from the listing and track the seller’s response in your dashboard.",
  },
];

const BUYER_STEPS = [
  "Browse the inventory and open a listing.",
  "Check the photos, details, and inspection report.",
  "Book a test drive or send an offer.",
];

const SELLER_STEPS = [
  "Create a seller account.",
  "List your vehicle with photos and details.",
  "Answer inquiries and review offers.",
];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

function Steps({ title, steps }) {
  return (
    <div>
      <Reveal>
        <h3 className="text-2xl font-semibold text-white" style={display}>
          {title}
        </h3>
      </Reveal>
      <ol className="mt-6 space-y-5">
        {steps.map((step, i) => (
          <Reveal as="li" key={step} delay={0.1 + i * 0.1} className="flex gap-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2DD4BF]/50 text-sm font-semibold text-[#2DD4BF]"
              style={display}
            >
              {i + 1}
            </span>
            <p className="pt-1 text-[#C8D3E0]">{step}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <SiteLayout>
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#2DD4BF]/15 blur-3xl sm:h-[28rem] sm:w-[28rem]"
          animate={reduceMotion ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#3B82F6]/10 blur-3xl sm:h-96 sm:w-96"
          animate={reduceMotion ? undefined : { x: [0, -30, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pb-28 md:pt-20">
          <motion.div
            variants={heroContainer}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
          >
            <motion.h1
              variants={heroItem}
              className="text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
              style={display}
            >
              Premium vehicles, inspected before you visit.
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-6 max-w-lg text-base leading-relaxed text-[#C8D3E0] sm:text-lg"
            >
              Browse a curated inventory from vetted sellers. Read the
              inspection report, book a test drive, and send your offer without
              leaving the vault.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <PrimaryLink to={ROUTES.inventory}>Browse inventory</PrimaryLink>
              <OutlineLink to={ROUTES.signup}>Sell a vehicle</OutlineLink>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-[#C8D3E0]/20 bg-[#102238]">
              <motion.img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury sports car parked on a quiet street"
                className="aspect-[5/4] w-full object-cover md:aspect-[4/5]"
                initial={reduceMotion ? false : { scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A1628] to-transparent" />
            </div>

            <motion.ul
              className="absolute bottom-4 left-4 right-4 grid gap-2 rounded-xl border border-white/15 bg-[#0A1628]/80 p-4 text-sm text-white backdrop-blur sm:grid-cols-3 md:bottom-5 md:left-5 md:right-5"
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.12, delayChildren: 0.9 },
                },
              }}
            >
              {[
                { Icon: ShieldCheck, label: "Vetted seller" },
                { Icon: ClipboardCheck, label: "Inspection report" },
                { Icon: CalendarClock, label: "Test drive" },
              ].map(({ Icon, label }) => (
                <motion.li
                  key={label}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-2"
                >
                  <Icon size={16} className="shrink-0 text-[#2DD4BF]" />
                  {label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0D1D33]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr] md:gap-12 md:py-28">
          <Reveal>
            <h2
              className="text-3xl font-bold text-white sm:text-4xl"
              style={display}
            >
              A marketplace that shows its work.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-[#8EA0B5]">
              Vehicle Vault connects buyers and sellers of premium vehicles,
              with the checks and conversations kept in one place.
            </p>
          </Reveal>

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {FEATURES.map(({ Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.08}
                className="group flex gap-5 py-6"
              >
                <Icon
                  size={24}
                  className="mt-1 shrink-0 text-[#2DD4BF] transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <div>
                  <h3
                    className="text-lg font-semibold text-white"
                    style={display}
                  >
                    {title}
                  </h3>
                  <p className="mt-1 max-w-md leading-relaxed text-[#8EA0B5]">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section id="how" className="scroll-mt-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 md:py-28">
          <Reveal>
            <h2
              className="max-w-xl text-3xl font-bold text-white sm:text-4xl"
              style={display}
            >
              From first look to handshake.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-14">
            <Steps title="If you’re buying" steps={BUYER_STEPS} />
            <Steps title="If you’re selling" steps={SELLER_STEPS} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#102238]">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-6 md:flex-row md:items-center md:py-16">
          <h2 className="max-w-md text-3xl font-bold text-white" style={display}>
            Your next vehicle is already listed.
          </h2>
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <PrimaryLink to={ROUTES.inventory}>Browse inventory</PrimaryLink>
            <OutlineLink to={ROUTES.signup}>Create an account</OutlineLink>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}