// import React, { useState } from "react";
// import { useForm } from "react-hook-form";

// export default function Signup() {

//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors }
//   } = useForm();

//   const password = watch("password");

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <div className="min-h-screen flex bg-gray-900">

//       {/* LEFT SIDE IMAGE */}
//       <div className="hidden md:flex w-1/2 h-screen relative">

//         <img
//           src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
//           alt="vehicle garage"
//           className="object-cover w-full h-full"
//         />

//         {/* overlay */}
//         <div className="absolute inset-0 bg-black/60"></div>

//         {/* title */}
//         <div className="absolute bottom-10 left-10 text-white z-10">
//           <h1 className="text-4xl font-bold">🚗 Vehicle Vault</h1>
//           <p className="text-gray-300 mt-2">Create your secure account</p>
//         </div>
//       </div>


//       {/* RIGHT SIDE FORM */}
//       <div className="flex items-center justify-center w-full md:w-1/2 px-6 bg-gradient-to-br from-gray-900 to-gray-800">

//         <div className="w-full max-w-md">

//           {/* GLASS CARD */}
//           <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

//             <h2 className="text-3xl font-bold text-center mb-2">
//               Create Account 🚀
//             </h2>

//             <p className="text-gray-300 text-center mb-6">
//               Signup to get started
//             </p>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

//               {/* NAME */}
//               <div>
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   className="w-full p-3 bg-white/20 border border-white/30 rounded-lg
//                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                   {...register("name", { required: "Name is required" })}
//                 />
//                 {errors.name && (
//                   <p className="text-red-400 text-sm mt-1">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               {/* EMAIL */}
//               <div>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   className="w-full p-3 bg-white/20 border border-white/30 rounded-lg
//                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                   {...register("email", { required: "Email is required" })}
//                 />
//                 {errors.email && (
//                   <p className="text-red-400 text-sm mt-1">
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* PASSWORD */}
//               <div className="relative">
//                 <input
//                   type={showPass ? "text" : "password"}
//                   placeholder="Password"
//                   className="w-full p-3 bg-white/20 border border-white/30 rounded-lg
//                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                   {...register("password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Minimum 6 characters"
//                     }
//                   })}
//                 />

//                 <span
//                   onClick={() => setShowPass(!showPass)}
//                   className="absolute right-3 top-3 cursor-pointer text-sm"
//                 >
//                   {showPass ? "🙈" : "👁"}
//                 </span>

//                 {errors.password && (
//                   <p className="text-red-400 text-sm mt-1">
//                     {errors.password.message}
//                   </p>
//                 )}
//               </div>

//               {/* CONFIRM PASSWORD */}
//               <div className="relative">
//                 <input
//                   type={showConfirm ? "text" : "password"}
//                   placeholder="Confirm Password"
//                   className="w-full p-3 bg-white/20 border border-white/30 rounded-lg
//                   placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//                   {...register("confirmPassword", {
//                     required: "Confirm your password",
//                     validate: (value) =>
//                       value === password || "Passwords do not match"
//                   })}
//                 />

//                 <span
//                   onClick={() => setShowConfirm(!showConfirm)}
//                   className="absolute right-3 top-3 cursor-pointer text-sm"
//                 >
//                   {showConfirm ? "🙈" : "👁"}
//                 </span>

//                 {errors.confirmPassword && (
//                   <p className="text-red-400 text-sm mt-1">
//                     {errors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>

//               {/* BUTTON */}
//               <button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-500
//                 hover:from-blue-700 hover:to-blue-600
//                 p-3 rounded-lg font-semibold shadow-lg
//                 transition-all duration-300 hover:scale-105"
//               >
//                 Create Account
//               </button>

//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import {toast} from "react-toastify";

export default function Signup() {

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const navigate= useNavigate()
  const password = watch("password");

  const submitHandler =async (data) => {
    console.log(data);
    try {
      const res = await axios.post("/user/register",data)
      if (res.status==201) {
        toast.success("User Registered Successfully");
        navigate("/")
      } 
      
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen relative">

        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
          alt="vehicle garage"
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="absolute bottom-10 left-10 text-white z-10">
          <h1 className="text-4xl font-bold text-amber-400">
            🚗 Vehicle Vault
          </h1>
          <p className="text-gray-300 mt-2">
            Create your secure account
          </p>
        </div>
      </div>


      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-6">

        <div className="w-full max-w-md">

          {/* GLASS CARD */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 text-gray-200">

            <h2 className="text-3xl font-bold text-center mb-2 text-amber-400">
              Create Account
            </h2>

            <p className="text-gray-400 text-center mb-6">
              Signup to get started
            </p>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

              {/* firstnAME */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("firstname", { required: "firstname is required" })}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Lastname */}
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("Lastname", { required: "Lastname is required" })}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters"
                    }
                  })}
                />

                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-400"
                >
                  {showPass ? "🙈" : "👁"}
                </span>

                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  {...register("confirmPassword", {
                    required: "Confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match"
                  })}
                />

                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-400"
                >
                  {showConfirm ? "🙈" : "👁"}
                </span>

                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600
                text-black p-3 rounded-lg font-semibold
                transition-all duration-300 hover:scale-105"
              >
                Create Account
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}