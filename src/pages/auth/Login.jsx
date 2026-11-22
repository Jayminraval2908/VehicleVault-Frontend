import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../components/context/AuthContext";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField, { inputClass } from "../../components/common/FormField";
import { display, focusRing } from "../../utils/theme";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const reduceMotion = useReducedMotion();

  const [showPass, setShowPass] = useState(false);
  const [loggingRole, setLoggingRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  const handleRoleRedirect = (role) => {
    const formattedRole = role.toLowerCase();
    setLoggingRole(formattedRole);

    setTimeout(() => {
      navigate(`/${formattedRole}/dashboard`);
    }, 800);
  };

  const submitHandler = async (data) => {
    toast.dismiss();
    setIsLoading(true);

    try {
      const response = await axios.post("/user/login", {
        ...data,
        email: data.email.trim(),
      });
      const { token, role, user } = response.data;

      login(user, token);
      toast.success(`Welcome back, ${user.firstName}`);
      handleRoleRedirect(role);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  const googleHandler = async (credentialResponse) => {
    setIsLoading(true);

    try {
      const res = await axios.post("/user/google-signin", {
        token: credentialResponse.credential,
      });
      const { token, role, user } = res.data;

      login(user, token);
      toast.success(`Welcome ${user.firstName}`);
      handleRoleRedirect(role);
    } catch (error) {
      setIsLoading(false);

      if (error.response?.status === 404) {
        toast.info("No account found. Please sign up first.");
        navigate("/signup");
      } else {
        toast.error("Google login failed");
      }
    }
  };

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Cars parked in a row"
      heading="Pick up where you left off."
      blurb="Check your inquiries, offers, and test drives in one place."
    >
      <motion.div
        className="w-full max-w-md"
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-white sm:text-4xl" style={display}>
            Welcome back
          </h1>
          <p className="mt-2 text-[#8EA0B5]">
            Log in to your Vehicle Vault account.
          </p>
        </motion.div>

        <motion.div
          variants={item}
          className="relative mt-8 rounded-2xl border border-white/10 bg-[#0D1D33] p-6 sm:p-8"
        >
          {isLoading && (
            <div
              role="status"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[#0A1628]/85"
            >
              <Loader2 className="animate-spin text-[#2DD4BF]" size={36} />
              <p className="mt-3 text-sm text-[#C8D3E0]">
                {loggingRole
                  ? `Opening your ${loggingRole} dashboard...`
                  : "Checking your details..."}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5"
            noValidate
          >
            <FormField id="login-email" label="Email address" error={errors.email}>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                className={inputClass(errors.email)}
                {...register("email", {
                  required: "Enter your email address",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </FormField>

            <FormField id="login-password" label="Password" error={errors.password}>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "login-password-error" : undefined
                  }
                  className={`${inputClass(errors.password)} pr-12`}
                  {...register("password", {
                    required: "Enter your password",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#8EA0B5] hover:text-white ${focusRing}`}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            <div className="flex justify-end">
              <Link
                to="/forgotpassword"
                className={`text-sm text-[#8EA0B5] transition-colors hover:text-[#2DD4BF] ${focusRing}`}
              >
                Forgot your password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={reduceMotion || isLoading ? undefined : { y: -2 }}
              whileTap={reduceMotion || isLoading ? undefined : { scale: 0.97 }}
              className={`w-full rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              Log in
            </motion.button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-[#8EA0B5]">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={googleHandler}
              onError={() => toast.error("Google login failed")}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
            />
          </div>
        </motion.div>

        <motion.p variants={item} className="mt-6 text-center text-[#8EA0B5]">
          New to Vehicle Vault?{" "}
          <Link
            to="/signup"
            className={`font-semibold text-[#2DD4BF] hover:text-[#5EEAD4] ${focusRing}`}
          >
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}