import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { display, body, focusRing } from "../../utils/theme";
import logoImg from "../../assets/LOGO.png";

const ROUTES = {
  login: "/login",
  signup: "/signup",
  about: "/about",
  contact: "/contact",
};

const NAV_ITEMS = [
  { label: "About Us", to: ROUTES.about },
  { label: "Contact", to: ROUTES.contact },
];

export default function SiteLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const desktopLinkClass = ({ isActive }) =>
    `text-sm transition-colors hover:text-white ${focusRing} ${
      isActive ? "text-white" : "text-[#C8D3E0]"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `py-3 ${isActive ? "text-[#2DD4BF]" : "text-[#C8D3E0]"}`;

  return (
    <div
      className="min-h-screen overflow-x-clip bg-[#0A1628] text-[#C8D3E0]"
      style={body}
    >
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur transition-colors duration-300 ${
          scrolled
            ? "border-white/15 bg-[#0A1628]/95"
            : "border-white/5 bg-[#0A1628]/60"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <Link
            to="/"
            className={`flex items-center gap-2.5 text-xl font-bold text-white ${focusRing}`}
            style={display}
          >
            <img
              src={logoImg}
              alt="Vehicle Vault Logo"
              className="h-9 w-9 shrink-0 rounded-lg object-cover transition-transform duration-200 hover:scale-105"
            />
            <span>
              Vehicle<span className="text-[#2DD4BF]">Vault</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={desktopLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to={ROUTES.login}
              className={`px-3 py-2 text-sm font-medium text-white transition-colors hover:text-[#2DD4BF] ${focusRing}`}
            >
              Log in
            </Link>
            <Link
              to={ROUTES.signup}
              className={`rounded-lg bg-[#2DD4BF] px-4 py-2 text-sm font-semibold text-[#0A1628] transition-colors hover:bg-[#5EEAD4] ${focusRing}`}
            >
              Sign up
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`rounded-md p-2 text-white md:hidden ${focusRing}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-white/10 bg-[#0A1628] md:hidden"
            >
              <div className="flex flex-col gap-1 px-5 pb-6 pt-3 sm:px-6">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="mt-3 flex gap-3">
                  <Link
                    to={ROUTES.login}
                    onClick={closeMenu}
                    className="flex-1 rounded-lg border border-white/20 py-3 text-center font-medium text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    to={ROUTES.signup}
                    onClick={closeMenu}
                    className="flex-1 rounded-lg bg-[#2DD4BF] py-3 text-center font-semibold text-[#0A1628]"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-8 text-sm text-[#8EA0B5] sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Vehicle Vault Logo"
              className="h-7 w-7 shrink-0 rounded-md object-cover opacity-85 transition-opacity hover:opacity-100"
            />
            <p>© {new Date().getFullYear()} Vehicle Vault. Excellence in motion.</p>
          </div>
          <div className="flex gap-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`transition-colors hover:text-white ${focusRing}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}