import React, { useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import FormField, { inputClass } from "../../components/common/FormField";
import { display } from "../../utils/theme";
import api from "../../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/user/forgotpassword", { email });
      toast.success(res.data.message);
      setEmail("");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0A1628] px-4 overflow-hidden">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#2DD4BF]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-[#3B82F6]/10 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#102238] p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <h2
            className="text-3xl font-bold text-white"
            style={display}
          >
            Reset <span className="text-[#2DD4BF]">Password</span>
          </h2>
          <p className="mt-2 text-sm text-[#8EA0B5]">
            Enter your email to receive a secure reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField id="email" label="Email Address">
            <input
              id="email"
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass(false)}
            />
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2DD4BF] px-4 py-3 text-sm font-semibold text-[#0A1628] transition hover:bg-[#2DD4BF]/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8EA0B5]">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-medium text-[#2DD4BF] hover:underline"
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;