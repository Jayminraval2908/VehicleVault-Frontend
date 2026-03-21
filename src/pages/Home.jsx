import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react"; // Added for mobile menu
import Button from "../components/common/Button";

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const navLinkStyle = "text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 text-sm uppercase tracking-widest font-medium";

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen text-white flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1646650922663-9b49d6daef4f?w=1200&auto=format&fit=crop&q=80')` 
      }}
    >
      {/* NAVBAR */}
      <motion.nav 
        variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
        className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-white/10 backdrop-blur-md sticky top-0 z-50"
      >
        <Link to="/" className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tighter">
          Vehicle Vault
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-10">
          <Link to="/about" className={navLinkStyle}>About Us</Link>
          <Link to="/contact" className={navLinkStyle}>Contact</Link>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex gap-4 items-center">
          <button onClick={() => navigate("/login")} className="text-gray-300 hover:text-white transition-colors">
            Login
          </button>
          <Button onClick={() => navigate("/signup")}>Sign Up</Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-[#D4AF37]" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </motion.nav>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 border-b border-white/10 overflow-hidden flex flex-col items-center py-6 gap-6"
          >
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>About Us</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={navLinkStyle}>Contact</Link>
            <div className="flex gap-4 mt-2">
              <button onClick={() => navigate("/login")} className="text-gray-300">Login</button>
              <Button onClick={() => navigate("/signup")}>Sign Up</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div className="flex flex-col justify-center items-center text-center flex-1 px-6 z-10 py-20 md:py-0">
        <motion.h1 
          variants={fadeInUp}
          className="text-4xl sm:text-6xl md:text-8xl font-bold text-[#D4AF37] drop-shadow-2xl tracking-tight leading-tight"
        >
          Buy & Sell <br className="hidden sm:block" /> Premium Vehicles
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mt-6 max-w-2xl text-base md:text-xl leading-relaxed drop-shadow-md"
        >
          Explore a curated selection of luxury assets. 
          Connect with vetted sellers and secure your next masterpiece.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <Button 
            onClick={() => navigate("/signup")} 
            className="px-10 py-4 text-lg w-full sm:w-auto"
          >
            Get Started
          </Button>
          <button 
            onClick={() => navigate("/login")}
            className="border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] px-10 py-4 rounded-xl transition-all duration-300 backdrop-blur-sm"
          >
            Browse Inventory
          </button>
        </motion.div>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-600 py-8 border-t border-white/5 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.3em]">
          © 2026 Vehicle Vault • Excellence in Motion
        </p>
      </footer>
    </motion.div>
  );
}