import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

// ✅ use your axios instance
import api from "../../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      // ✅ FIXED: use api instead of fetch + localhost
      const res = await api.post(`/user/resetpassword/${token}`, {
        newPassword,
      });

      toast.success(res.data.message);

      // ✅ redirect after success
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
    <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D] px-4">

      <Card className="w-full max-w-md p-8">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Create <span className="text-[#D4AF37]">New Password</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Enter a strong password to secure your account
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleReset} className="space-y-5">

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Updating...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#D4AF37] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </Card>
    </div>
  );
};

export default ResetPassword;