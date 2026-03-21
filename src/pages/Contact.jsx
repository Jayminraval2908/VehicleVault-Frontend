import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Contact() {
  // 1. Initialize useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
    },
  });

  // 2. Define the Submit Handler
  const onSubmit = async (data) => {
    try {
      // Replace this with your actual API call to your backend/EmailJS/etc.
      console.log("Form Data:", data);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Message sent! Our concierge will contact you shortly.");
      reset(); // Clear form after success
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl grid md:grid-cols-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Contact Info Section */}
        <div className="p-12 bg-[#D4AF37] text-black flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="font-medium opacity-80 mb-8">
              Have a specific vehicle in mind? Our concierge team is ready to assist you.
            </p>
            <div className="space-y-6 text-sm">
              <div className="border-b border-black/10 pb-4">
                <p className="font-bold uppercase tracking-wider mb-1">Jaymin Raval</p>
                <p>ravaljaymin2908@gmail.com</p>
                <p>+91 99253 96071</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider mb-1">Dhyey Soni</p>
                <p>dhyeysoni201@gmail.com</p>
                <p>+91 93270 99839</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
            Available 24/7 for Members
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-12 space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Name is required" })}
              type="text"
              className={`w-full bg-white/5 border ${
                errors.fullName ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-all`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="text-red-500 text-[10px] mt-1 uppercase">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className={`w-full bg-white/5 border ${
                errors.email ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-all`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] mt-1 uppercase">{errors.email.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Message
            </label>
            <textarea
              {...register("message", { 
                required: "Please enter a message",
                minLength: { value: 10, message: "Message too short" }
              })}
              rows="4"
              className={`w-full bg-white/5 border ${
                errors.message ? "border-red-500" : "border-white/10"
              } rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-all resize-none`}
              placeholder="Tell us about your requirements..."
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-[10px] mt-1 uppercase">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-[#D4AF37] disabled:bg-gray-600 text-black font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-[#b8972f] transition-all shadow-lg"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}