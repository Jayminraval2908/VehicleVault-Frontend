import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ClipboardCheck, ShieldCheck, Clock } from "lucide-react";
import SiteLayout from "../components/layout/SiteLayout";
import Reveal from "../components/common/Reveal";
import { PrimaryLink, OutlineLink } from "../components/common/SiteButtons";
import { display } from "../utils/theme";

const ROUTES = {
  signup: "/signup",
  contact: "/contact",
  inventory: "/login",
};

const PRINCIPLES = [
  {
    Icon: ClipboardCheck,
    title: "Transparency",
    text: "Inspection reports and vehicle details sit on the listing, not in a follow-up call.",
  },
  {
    Icon: ShieldCheck,
    title: "Security",
    text: "Accounts are password-protected, and you can sign in with your Google account.",
  },
  {
    Icon: Clock,
    title: "Respect for your time",
    text: "Test drives and offers are requested in the app, so nobody has to chase the other side.",
  },
];

const AUDIENCES = [
  {
    title: "For buyers",
    text: "Compare listings, read the inspection report, and make an offer when you’re ready.",
  },
  {
    title: "For sellers",
    text: "List your vehicle with photos and details, then answer inquiries and offers from one dashboard.",
  },
];

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export default function About() {
  const reduceMotion = useReducedMotion();
  const imageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

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
            className="max-w-3xl text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-6xl"
            style={display}
          >
            Buying a premium vehicle should feel certain.
          </motion.h1>

          <div className="mt-12 grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <motion.div variants={heroItem} className="space-y-5">
              <p className="max-w-lg text-base leading-relaxed text-[#C8D3E0] sm:text-lg">
                Vehicle Vault is a marketplace for premium vehicles, built
                around one idea: the proof should sit next to the listing.
              </p>
              <p className="max-w-lg leading-relaxed text-[#8EA0B5]">
                Sellers publish details, photos, and inspection reports. Buyers
                read them, ask questions, book a test drive, and make an offer.
                Every step happens in one place.
              </p>
              <div className="flex flex-col gap-4 pt-3 sm:flex-row">
                <PrimaryLink to={ROUTES.signup}>Create an account</PrimaryLink>
                <OutlineLink to={ROUTES.contact}>Contact us</OutlineLink>
              </div>
            </motion.div>

            <motion.div variants={heroItem}>
              <div
                ref={imageRef}
                className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-[#C8D3E0]/20 bg-[#102238]"
              >
                <motion.img
                  src="https://images.unsplash.com/photo-1646650922663-9b49d6daef4f?w=1200&auto=format&fit=crop&q=80"
                  alt="Premium vehicles on display"
                  className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover"
                  style={reduceMotion ? undefined : { y: imageY }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/60 to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-white/10 bg-[#0D1D33]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 md:grid-cols-[1fr_1.4fr] md:gap-12 md:py-24">
          <Reveal>
            <h2
              className="text-3xl font-bold text-white sm:text-4xl"
              style={display}
            >
              What we hold to.
            </h2>
          </Reveal>

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {PRINCIPLES.map(({ Icon, title, text }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 0.1}
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

      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 md:grid-cols-2 md:gap-14 md:py-24">
          {AUDIENCES.map(({ title, text }, i) => (
            <Reveal key={title} delay={i * 0.12}>
              <h3
                className="border-l-2 border-[#2DD4BF] pl-4 text-2xl font-semibold text-white"
                style={display}
              >
                {title}
              </h3>
              <p className="mt-4 max-w-md pl-4 leading-relaxed text-[#C8D3E0]">
                {text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#102238]">
        <Reveal className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-14 sm:px-6 md:flex-row md:items-center md:py-16">
          <h2 className="max-w-md text-3xl font-bold text-white" style={display}>
            Ready to take a look?
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