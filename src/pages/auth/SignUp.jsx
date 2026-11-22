import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Eye,
  EyeOff,
  ShoppingCart,
  Store,
  CheckCircle2,
  Check,
  X,
} from "lucide-react";
import AuthLayout from "../../components/layout/AuthLayout";
import FormField, { inputClass } from "../../components/common/FormField";
import { passwordRules, validatePassword } from "../../utils/PasswordRules";
import { display, focusRing } from "../../utils/theme";

const ROLES = [
  {
    value: "buyer",
    label: "Buyer",
    description: "Find and buy vehicles",
    Icon: ShoppingCart,
  },
  {
    value: "seller",
    label: "Seller",
    description: "List and sell vehicles",
    Icon: Store,
  },
];

const PHONE_REGEX = /^[0-9]{10}$/;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Signup() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { role: "" },
  });

  const selectedRole = watch("role");
  const phone = watch("phone");
  const password = watch("password") || "";
  const googleReady = !!selectedRole && PHONE_REGEX.test(phone || "");

  const handleRoleSelect = (role) => {
    setValue("role", role, { shouldValidate: true });
  };

  const submitHandler = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/register", {
        ...data,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
      });

      if (res.status === 201) {
        toast.success("Account created. Please log in.");
        navigate("/login");
      }
    } catch (error) {
      const serverErrors = error.response?.data?.errors;
      toast.error(
        serverErrors?.length
          ? `Password needs: ${serverErrors.join(", ").toLowerCase()}`
          : error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async (credentialResponse) => {
    if (!googleReady) {
      toast.warn("Choose Buyer or Seller and enter your phone number first.");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("/user/google-signin", {
        token: credentialResponse.credential,
        role: selectedRole,
        phone,
      });

      toast.success("Account created. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
      imageAlt="Luxury sports car"
      heading="List it or find it."
      blurb="Create a buyer or seller account in a minute."
    >
      <motion.div
        className="w-full max-w-md"
        variants={container}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-white sm:text-4xl" style={display}>
            Create your account
          </h1>
          <p className="mt-2 text-[#8EA0B5]">
            Choose how you’ll use Vehicle Vault.
          </p>
        </motion.div>

        <motion.div variants={item} className="mt-8">
          <div
            role="radiogroup"
            aria-label="Account type"
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {ROLES.map(({ value, label, description, Icon }) => {
              const active = selectedRole === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => handleRoleSelect(value)}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className={`relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${focusRing} ${
                    active
                      ? "border-[#2DD4BF] bg-[#2DD4BF]/10"
                      : "border-white/15 bg-[#0D1D33] hover:border-white/40"
                  }`}
                >
                  {active && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-3 top-3 text-[#2DD4BF]"
                    />
                  )}
                  <Icon
                    size={24}
                    className={active ? "text-[#2DD4BF]" : "text-[#8EA0B5]"}
                  />
                  <span className="font-semibold text-white" style={display}>
                    {label}
                  </span>
                  <span className="text-sm text-[#8EA0B5]">{description}</span>
                </motion.button>
              );
            })}
          </div>
          <input
            type="hidden"
            {...register("role", { required: "Choose Buyer or Seller" })}
          />
          <AnimatePresence>
            {errors.role && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-2 text-sm text-red-400"
              >
                {errors.role.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 rounded-2xl border border-white/10 bg-[#0D1D33] p-6 sm:p-8"
        >
          <div className="space-y-5">
            <FormField
              id="signup-phone"
              label="Phone number"
              error={errors.phone}
              hint="Required for both buyer and seller accounts."
            >
              <input
                id="signup-phone"
                type="text"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit number"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "signup-phone-error" : undefined}
                className={inputClass(errors.phone)}
                {...register("phone", {
                  required: "Enter your phone number",
                  pattern: {
                    value: PHONE_REGEX,
                    message: "Enter a valid 10-digit number",
                  },
                })}
              />
            </FormField>

            <div className="flex min-h-[44px] justify-center">
              {googleReady ? (
                <GoogleLogin
                  onSuccess={handleGoogleSignup}
                  onError={() => toast.error("Google signup failed")}
                  theme="filled_black"
                  size="large"
                  text="signup_with"
                  shape="pill"
                />
              ) : (
                <p className="text-center text-sm text-[#8EA0B5]">
                  Choose Buyer or Seller and enter your phone number to sign up
                  with Google.
                </p>
              )}
            </div>
          </div>

          <div className="my-6 flex items-center gap-4 text-sm text-[#8EA0B5]">
            <span className="h-px flex-1 bg-white/10" />
            or use your email
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-5"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="signup-first" label="First name" error={errors.firstName}>
                <input
                  id="signup-first"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "signup-first-error" : undefined
                  }
                  className={inputClass(errors.firstName)}
                  {...register("firstName", {
                    required: "Enter your first name",
                    validate: (v) =>
                      v.trim().length > 0 || "Enter your first name",
                  })}
                />
              </FormField>
              <FormField id="signup-last" label="Last name" error={errors.lastName}>
                <input
                  id="signup-last"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "signup-last-error" : undefined
                  }
                  className={inputClass(errors.lastName)}
                  {...register("lastName", {
                    required: "Enter your last name",
                    validate: (v) =>
                      v.trim().length > 0 || "Enter your last name",
                  })}
                />
              </FormField>
            </div>

            <FormField id="signup-email" label="Email address" error={errors.email}>
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "signup-email-error" : undefined}
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

            <div>
              <FormField id="signup-password" label="Password" error={errors.password}>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPass ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "signup-password-error" : undefined
                    }
                    className={`${inputClass(errors.password)} pr-12`}
                    {...register("password", {
                      required: "Enter a password",
                      validate: validatePassword,
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

              <AnimatePresence>
                {password.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <li className="pt-3" aria-hidden="true" />
                    {passwordRules.map((rule) => {
                      const passed = rule.test(password);
                      return (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-2 py-0.5 text-sm transition-colors ${
                            passed ? "text-[#2DD4BF]" : "text-[#8EA0B5]"
                          }`}
                        >
                          {passed ? <Check size={14} /> : <X size={14} />}
                          {rule.label}
                          <span className="sr-only">
                            {passed ? "(done)" : "(not met)"}
                          </span>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={reduceMotion || isLoading ? undefined : { y: -2 }}
              whileTap={reduceMotion || isLoading ? undefined : { scale: 0.97 }}
              className={`w-full rounded-lg bg-[#2DD4BF] px-6 py-3.5 font-semibold text-[#0A1628] shadow-[0_8px_24px_-8px_rgba(45,212,191,0.55)] transition-colors hover:bg-[#5EEAD4] disabled:cursor-not-allowed disabled:opacity-60 ${focusRing}`}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </motion.button>
          </form>
        </motion.div>

        <motion.p variants={item} className="mt-6 text-center text-[#8EA0B5]">
          Already have an account?{" "}
          <Link
            to="/login"
            className={`font-semibold text-[#2DD4BF] hover:text-[#5EEAD4] ${focusRing}`}
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
}