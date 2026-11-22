import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import FormField, { inputClass } from "../../components/common/FormField";
import { display } from "../../utils/theme";
import api from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await api.post(`/user/resetpassword/${token}`, {
        newPassword,
      });

      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Error resetting password"
      );
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
          <h2 className="text-3xl font-bold text-white" style={display}>
            Create <span className="text-[#2DD4BF]">New Password</span>
          </h2>
          <p className="mt-2 text-sm text-[#8EA0B5]">
            Enter a strong password to secure your account
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <FormField id="newPassword" label="New Password">
            <input
              id="newPassword"
              type="password"
              required
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass(false)}
            />
          </FormField>

          <FormField id="confirmPassword" label="Confirm Password">
            <input
              id="confirmPassword"
              type="password"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8EA0B5]">
          Back to{" "}
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

export default ResetPassword;