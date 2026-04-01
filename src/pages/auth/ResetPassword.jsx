import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

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
      const res = await fetch(
        `http://localhost:3000/user/resetpassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );

      const data = await res.json();

      toast.success(data.message);

      // ✅ redirect after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);
      toast.error("Error resetting password");
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

          {/* NEW PASSWORD */}
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* CONFIRM PASSWORD */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* BUTTON */}
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