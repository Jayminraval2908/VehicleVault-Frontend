import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

export default function About() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white selection:bg-[#D4AF37] selection:text-black">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto px-8 pt-32 pb-20"
      >
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-[#D4AF37] mb-8"
        >
          Redefining the <br /> Luxury Experience.
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={itemVariants} className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              Vehicle Vault was born out of a passion for automotive excellence. We don't just list cars; we curate a collection of the world's most prestigious machines.
            </p>
            <p>
              Whether you are looking to acquire a rare classic or part with a modern supercar, our platform provides the security, transparency, and elegance that the premium market demands.
            </p>
            <Button onClick={() => navigate("/signup")} className="mt-4">
              Join the Elite
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative h-[400px] bg-gray-900 rounded-lg overflow-hidden border border-white/10"
          >
            <img
              src="https://media.istockphoto.com/id/1366606754/photo/new-cars-at-dealer-showroom.jpg?s=2048x2048&w=is&k=20&c=UmeAevF532JVsBxaHUzEiDjoIr2_UX-Uh0K4P1nUTjg="
              alt="Luxury Showroom"
              className="object-cover w-full h-full opacity-60 hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}