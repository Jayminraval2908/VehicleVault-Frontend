import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {

  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await axios.post(
        "https://node5.onrender.com/user/login",
        data
      );

      if (res.status === 200) {
        toast.success("Login success");
        navigate("/user");
      }
    } catch (err) {
      toast.error("Login failed..");
    }
  };

  // return (

  //   <div className="min-h-screen flex bg-gray-900">

  //     {/* LEFT IMAGE */}
  //     <div className="hidden md:flex w-1/2 h-screen relative">

  //       <img
  //         src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80"
  //         alt="parking"
  //         className="object-cover w-full h-full"
  //       />

  //       <div className="absolute inset-0 bg-black/60"></div>

  //       <div className="absolute bottom-10 left-10 text-white z-10">
  //         <h1 className="text-4xl font-bold tracking-wide">
  //           🚗 Vehicle Vault
  //         </h1>
  //         <p className="text-gray-300 mt-2">
  //           Secure Vehicle Management System
  //         </p>
  //       </div>
  //     </div>


  //     {/* RIGHT FORM */}
  //     <div className="flex items-center justify-center w-full md:w-1/2 px-6 bg-gradient-to-br from-gray-900 to-gray-800">

  //       <div className="w-full max-w-md">

  //         <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

  //           <h2 className="text-3xl font-bold text-center mb-2">
  //             Welcome Back 👋
  //           </h2>

  //           <p className="text-gray-300 text-center mb-6">
  //             Login to access your vault
  //           </p>

  //           <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

  //             {/* EMAIL */}
  //             <div>
  //               <input
  //                 type="email"
  //                 placeholder="Email"
  //                 className="w-full p-3 bg-white/20 rounded-lg border border-white/30
  //                 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400
  //                 transition duration-300"
  //                 {...register("email", {
  //                   required: "Email is required"
  //                 })}
  //               />
  //               {errors.email && (
  //                 <p className="text-red-400 text-sm mt-1">
  //                   {errors.email.message}
  //                 </p>
  //               )}
  //             </div>

  //             {/* PASSWORD */}
  //             <div className="relative">
  //               <input
  //                 type={showPass ? "text" : "password"}
  //                 placeholder="Password"
  //                 className="w-full p-3 bg-white/20 rounded-lg border border-white/30
  //                 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400
  //                 transition duration-300"
  //                 {...register("password", {
  //                   required: "Password is required",
  //                   minLength: {
  //                     value: 6,
  //                     message: "Minimum 6 characters"
  //                   }
  //                 })}
  //               />

  //               {/* eye icon */}
  //               <span
  //                 onClick={() => setShowPass(!showPass)}
  //                 className="absolute right-3 top-3 cursor-pointer text-sm text-gray-300"
  //               >
  //                 {showPass ? "🙈" : "👁"}
  //               </span>

  //               {errors.password && (
  //                 <p className="text-red-400 text-sm mt-1">
  //                   {errors.password.message}
  //                 </p>
  //               )}
  //             </div>

  //             {/* OPTIONS */}
  //             <div className="flex justify-between text-sm text-gray-300">
  //               <label className="flex items-center gap-2 cursor-pointer">
  //                 <input type="checkbox" />
  //                 Remember me
  //               </label>
  //               <span className="hover:text-blue-400 cursor-pointer">
  //                 Forgot password?
  //               </span>
  //             </div>

  //             {/* BUTTON */}
  //             <button
  //               type="submit"
  //               className="w-full bg-gradient-to-r from-blue-600 to-blue-500
  //               hover:from-blue-700 hover:to-blue-600
  //               p-3 rounded-lg font-semibold shadow-lg
  //               transition-all duration-300 hover:scale-105"
  //             >
  //               Login Securely
  //             </button>

  //           </form>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
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
          <h1 className="text-4xl font-bold text-amber-400">
            🚗 Vehicle Vault
          </h1>
          <p className="text-gray-300 mt-2">
            Secure Vehicle Management System
          </p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">

        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-gray-200">

            <h2 className="text-3xl font-bold text-center mb-2 text-amber-400">
              Welcome Back
            </h2>

            <p className="text-gray-400 text-center mb-6">
              Login to access your vault
            </p>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-black/40 rounded-lg border border-gray-700
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                {...register("email", { required: "Email is required" })}
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-black/40 rounded-lg border border-gray-700
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("password", { required: true })}
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
                className="w-full bg-amber-500 hover:bg-amber-600
              text-black p-3 rounded-lg font-semibold
              transition-all duration-300 hover:scale-105"
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


