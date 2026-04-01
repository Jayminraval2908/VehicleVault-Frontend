import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../components/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loggingRole, setLoggingRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 

  const { register, handleSubmit } = useForm();
  const { login } = useAuth(); // ✅ FIXED

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
      const response = await axios.post("/user/login", data);
      const { token, role, user } = response.data;

      login(user, token); // ✅ context

      toast.success(`Welcome back, ${user.firstName}`);
      handleRoleRedirect(role);

    } catch (err) {
      setIsLoading(false);
      toast.error(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0D0D0D]">

      {/* ✅ LEFT IMAGE SECTION (RESTORED) */}
      <div className="hidden md:flex w-1/2 h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80"
          alt="parking"
          className="object-cover w-full h-full grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>

        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="text-5xl font-black text-amber-500 tracking-tighter italic">
            VEHICLE VAULT
          </h1>
          <p className="text-gray-400 text-lg uppercase tracking-[0.3em] mt-2">
            The Elite Marketplace
          </p>
        </div>
      </div>

      {/* ✅ RIGHT FORM SECTION */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-8 py-12">
        <div className="w-full max-w-md space-y-8">

          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">
              Member <span className="text-amber-500">Access</span>
            </h2>
            <p className="text-gray-500 text-sm italic">
              Unlock your digital garage
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">

            {/* LOADING OVERLAY */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-50">
                <Loader2 className="animate-spin text-amber-500" size={40} />
                <p className="text-amber-500 text-xs mt-2">
                  {loggingRole ? `Opening ${loggingRole} Vault...` : "Verifying Identity..."}
                </p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

              <input
                type="email"
                placeholder="Email"
                className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white"
                {...register("email", { required: true })}
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white"
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-4 text-gray-500"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgotpassword")}
                  className="text-xs text-gray-500 hover:text-amber-500 transition"
                >
                  Forgot your password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-amber-500 text-black rounded-xl font-bold"
              >
                Enter Vault
              </button>
            </form>

            {/* DIVIDER */}
            <div className="text-center my-6 text-gray-600 text-xs">
              OR
            </div>

            {/* GOOGLE LOGIN */}
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setIsLoading(true);

                try {
                  const res = await axios.post("/user/google-signin", {
                    token: credentialResponse.credential
                  });

                  const { token, role, user } = res.data;

                  login(user, token); // ✅ context

                  toast.success(`Welcome ${user.firstName}`);
                  handleRoleRedirect(role);

                } catch (error) {
                  setIsLoading(false);

                  if (error.response?.status === 404) {
                    toast.info("No account found. Please signup first.");
                    navigate("/signup");
                  } else {
                    toast.error("Google Login Failed");
                  }
                }
              }}
              onError={() => toast.error("Google Login Failed")}
              theme="filled_black"
              size="large"
              text="continue_with"
              shape="pill"
            />

          </div>

          <p className="text-center text-gray-500 text-sm">
            New user?{" "}
            <Link to="/signup" className="text-amber-500">
              Signup
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}