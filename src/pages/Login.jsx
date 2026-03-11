import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loggingRole, setLoggingRole] = useState(""); // new state to show role

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const response = await axios.post("/user/login", data);
      if (response.status === 200) {
        toast.success("Login Success");

        const role = response.data.role.toLowerCase();
        setLoggingRole(role); // show role on UI

        // delay for 1.5s so user can see the role before redirect
        setTimeout(() => {
          switch (role) {
            case "buyer":
              navigate("/buyer/dashboard");
              break;
            case "seller":
              navigate("/seller/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            default:
              navigate("/");
          }
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80"
          alt="parking"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-4xl font-bold text-amber-400">🚗 Vehicle Vault</h1>
          <p className="text-gray-300 mt-2">Secure Vehicle Management System</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-gray-200">

            <h2 className="text-3xl font-bold text-center mb-2 text-amber-400">Welcome Back</h2>
            <p className="text-gray-400 text-center mb-6">Login to access your vault</p>

            {/* Show role while logging in */}
            {loggingRole && (
              <p className="text-center text-amber-400 mb-4">
                Logging in as <span className="font-semibold">{loggingRole.toUpperCase()}</span>...
              </p>
            )}

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-black/40 rounded-lg border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-black/40 rounded-lg border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("password", { required: "Password is required" })}
                />
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-400"
                >
                  {showPass ? "🙈" : "👁"}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-black p-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                Login Securely
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}