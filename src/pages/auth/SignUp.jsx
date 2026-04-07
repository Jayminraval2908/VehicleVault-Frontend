// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { GoogleLogin } from '@react-oauth/google';
// import { Eye, EyeOff, User, ShieldCheck, CheckCircle2 } from "lucide-react";

// export default function Signup() {
//   const [showPass, setShowPass] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Initialize form with default role as empty
//   const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
//     defaultValues: { role: "" }
//   });

//   const navigate = useNavigate();
//   const selectedRole = watch("role"); // Watches the hidden input to update UI cards

//   // --- LOGIC: Select Role & Sync with Hook Form ---
//   const handleRoleSelect = (role) => {
//     setValue("role", role, { shouldValidate: true });
//   };

//   // --- LOGIC: Standard Manual Registration ---
//   const submitHandler = async (data) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.post("/user/register", data);
//       if (res.status === 201) {
//         toast.success("Identity Created. Please Login.");
//         navigate("/");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- LOGIC: Google Registration ---

//   <GoogleLogin
//     onSuccess={async (credentialResponse) => {
//       if (!selectedRole) {
//         toast.warn("Please select your intended path first.");
//         return;
//       }

//       setIsLoading(true);

//       try {
//         const res = await axios.post("/user/google-signin", {
//           token: credentialResponse.credential, // ✅ CORRECT TOKEN
//           role: selectedRole
//         });

//         toast.success("Welcome to the Vault!");

//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("user", JSON.stringify(res.data.user));

//         navigate(`/${selectedRole}/dashboard`);

//       } catch (error) {
//         toast.error("Google Signup Failed");
//       } finally {
//         setIsLoading(false);
//       }
//     }}
//     onError={() => toast.error("Google Signup Failed")}
//   />


//   return (
//     <div className="min-h-screen flex bg-[#0D0D0D]">

//       {/* LEFT SIDE IMAGE */}
//       <div className="hidden md:flex w-1/2 h-screen relative">
//         <img
//           src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
//           alt="luxury car"
//           className="object-cover w-full h-full grayscale-[20%]"
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
//         <div className="absolute bottom-12 left-12 text-white z-10">
//           <h1 className="text-5xl font-black text-amber-500 tracking-tighter italic">THE VAULT</h1>
//           <p className="text-gray-400 text-lg uppercase tracking-[0.3em] mt-2">Secure your asset collection</p>
//         </div>
//       </div>

//       {/* RIGHT SIDE FORM */}
//       <div className="flex items-center justify-center w-full md:w-1/2 px-8 py-12 overflow-y-auto">
//         <div className="w-full max-w-md">
//           <header className="mb-8 text-center">
//             <h2 className="text-4xl font-bold text-white mb-2">Create <span className="text-amber-500">Account</span></h2>
//             <p className="text-gray-500 text-sm italic tracking-wide">Select your access tier to continue</p>
//           </header>

//           {/* INTERACTIVE ROLE CARDS */}
//           <div className="grid grid-cols-2 gap-4 mb-8">
//             <div
//               onClick={() => handleRoleSelect("buyer")}
//               className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${selectedRole === 'buyer' ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-gray-800 bg-black/40 grayscale opacity-60 hover:opacity-100 hover:border-gray-600'
//                 }`}
//             >
//               {selectedRole === 'buyer' && <CheckCircle2 className="absolute top-2 right-2 text-amber-500" size={14} />}
//               <User size={28} className={selectedRole === 'buyer' ? 'text-amber-500' : 'text-gray-500'} />
//               <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'buyer' ? 'text-white' : 'text-gray-500'}`}>Buyer</span>
//             </div>

//             <div
//               onClick={() => handleRoleSelect("seller")}
//               className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${selectedRole === 'seller' ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-gray-800 bg-black/40 grayscale opacity-60 hover:opacity-100 hover:border-gray-600'
//                 }`}
//             >
//               {selectedRole === 'seller' && <CheckCircle2 className="absolute top-2 right-2 text-amber-500" size={14} />}
//               <ShieldCheck size={28} className={selectedRole === 'seller' ? 'text-amber-500' : 'text-gray-500'} />
//               <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'seller' ? 'text-white' : 'text-gray-500'}`}>Seller</span>
//             </div>
//             {/* Hidden Input for Form Validation */}
//             <input type="hidden" {...register("role", { required: "Role selection is mandatory" })} />
//           </div>

//           <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
//             {/* GOOGLE SIGNUP SECTION */}
//             <div className="space-y-4 flex flex-col items-center">

//               {/* Google Button */}
//               <GoogleLogin
//                 onSuccess={async (credentialResponse) => {
//                   if (!selectedRole) {
//                     toast.warn("Please select your intended path first.");
//                     return;
//                   }

//                   setIsLoading(true);

//                   try {
//                     const res = await axios.post("/user/google-signin", {
//                       token: credentialResponse.credential,
//                       role: selectedRole
//                     });

//                     toast.success("Welcome to the Vault!");

//                     localStorage.setItem("token", res.data.token);
//                     localStorage.setItem("user", JSON.stringify(res.data.user));

//                     navigate(`/${selectedRole}/dashboard`);

//                   } catch (error) {
//                     toast.error("Google Signup Failed");
//                   } finally {
//                     setIsLoading(false);
//                   }
//                 }}
//                 onError={() => toast.error("Google Signup Failed")}
//               />

//               {/* Divider */}
//               <div className="relative my-8 text-center w-full">
//                 <hr className="border-gray-800" />
//                 <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121212] px-4 text-[10px] text-gray-700 font-bold uppercase tracking-tighter">
//                   Or Manual Entry
//                 </span>
//               </div>

//             </div>

//             <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   placeholder="First Name"
//                   className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
//                   {...register("firstName", { required: "Required" })}
//                 />
//                 <input
//                   placeholder="Last Name"
//                   className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
//                   {...register("lastName", { required: "Required" })}
//                 />
//               </div>

//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
//                 {...register("email", { required: "Email is required" })}
//               />

//               <p className="text-gray-400 text-[10px] mb-2 text-center italic">
//                 Please enter your phone number. Required for both Buyer and Seller accounts.
//               </p>



//               <input
//                 type="text"
//                 placeholder="Contact Number"
//                 className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
//                 {...register("contact", {
//                   required: "Contact is required",
//                   pattern: {
//                     value: /^[0-9]{10}$/,
//                     message: "Enter a valid 10-digit number",
//                   },
//                 })}
//               />
//               {errors.contact && (
//                 <p className="text-amber-500 text-[10px] text-center uppercase tracking-widest">
//                   {errors.contact.message}
//                 </p>
//               )}

//               <div className="relative">
//                 <input
//                   type={showPass ? "text" : "password"}
//                   placeholder="Security Password"
//                   className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
//                   {...register("password", { required: "Required", minLength: 6 })}
//                 />
//                 <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
//                   {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>

//               {errors.role && <p className="text-amber-500 text-[10px] text-center uppercase tracking-widest">{errors.role.message}</p>}

//               <button
//                 type="submit"
//                 disabled={isLoading || !selectedRole}
//                 className="w-full bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-500/10 active:scale-95 disabled:grayscale disabled:opacity-20"
//               >
//                 {isLoading ? "Validating..." : "Create Account"}
//               </button>
//             </form>
//           </div>

//           <p className="mt-8 text-center text-gray-600 text-sm font-medium tracking-tight">
//             Already registered? <Link to="/" className="text-amber-500 hover:text-amber-400 font-black ml-1">Login</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }  

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, User, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { role: "" }
  });

  const navigate = useNavigate();
  const selectedRole = watch("role");
  const contact = watch("contact"); // watch contact field for Google login

  // --- Role Selection ---
  const handleRoleSelect = (role) => {
    setValue("role", role, { shouldValidate: true });
  };

  // --- Manual Signup ---
  const submitHandler = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post("/user/register", data);
      if (res.status === 201) {
        toast.success("Identity Created. Please Login.");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Google Signup ---
  const handleGoogleLogin = async (credentialResponse) => {
    if (!selectedRole) {
      toast.warn("Please select your intended path first.");
      return;
    }
    if (!contact || !/^[0-9]{10}$/.test(contact)) {
      toast.warn("Please enter a valid 10-digit contact number before Google signup.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/user/google-signin", {
        token: credentialResponse.credential,
        role: selectedRole,
        contact: contact // send contact along with Google token
      });

      toast.success("Welcome to the Vault!");
      // localStorage.setItem("token", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));
      // navigate(`/${selectedRole}/dashboard`);
      // ✅ NEW LOGIC: Just notify and send to Login
toast.success("Account Created! Please sign in to enter the Vault.");
navigate("/login"); // Or "/login" depending on your route
    } catch (error) {
      toast.error("Google Signup Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0D0D0D]">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
          alt="luxury car"
          className="object-cover w-full h-full grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white z-10">
          <h1 className="text-5xl font-black text-amber-500 tracking-tighter italic">THE VAULT</h1>
          <p className="text-gray-400 text-lg uppercase tracking-[0.3em] mt-2">Secure your asset collection</p>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-8 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <header className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Create <span className="text-amber-500">Account</span></h2>
            <p className="text-gray-500 text-sm italic tracking-wide">Select your access tier to continue</p>
          </header>

          {/* ROLE CARDS */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              onClick={() => handleRoleSelect("buyer")}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${selectedRole === 'buyer' ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-gray-800 bg-black/40 grayscale opacity-60 hover:opacity-100 hover:border-gray-600'}`}
            >
              {selectedRole === 'buyer' && <CheckCircle2 className="absolute top-2 right-2 text-amber-500" size={14} />}
              <User size={28} className={selectedRole === 'buyer' ? 'text-amber-500' : 'text-gray-500'} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'buyer' ? 'text-white' : 'text-gray-500'}`}>Buyer</span>
            </div>

            <div
              onClick={() => handleRoleSelect("seller")}
              className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${selectedRole === 'seller' ? 'border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'border-gray-800 bg-black/40 grayscale opacity-60 hover:opacity-100 hover:border-gray-600'}`}
            >
              {selectedRole === 'seller' && <CheckCircle2 className="absolute top-2 right-2 text-amber-500" size={14} />}
              <ShieldCheck size={28} className={selectedRole === 'seller' ? 'text-amber-500' : 'text-gray-500'} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'seller' ? 'text-white' : 'text-gray-500'}`}>Seller</span>
            </div>

            <input type="hidden" {...register("role", { required: "Role selection is mandatory" })} />
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            {/* GOOGLE SIGNUP SECTION */}
            <div className="space-y-4 flex flex-col items-center">
              <p className="text-gray-400 text-[10px] mb-2 text-center italic">
  Please enter your phone number. Required for both Buyer and Seller accounts.
</p>

              {/* Contact for Google Signup */}
              <input
                type="text"
                placeholder="Contact Number"
                className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
                {...register("contact", {
                  required: "Contact is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                })}
              />
              {errors.contact && <p className="text-amber-500 text-[10px] text-center uppercase tracking-widest">{errors.contact.message}</p>}

              {/* Google Button */}
              {selectedRole && contact && /^[0-9]{10}$/.test(contact) && (
  <GoogleLogin
    onSuccess={handleGoogleLogin}
    onError={() => toast.error("Google Signup Failed")}
  />
)}
              {/* Divider */}
              <div className="relative my-8 text-center w-full">
                <hr className="border-gray-800" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121212] px-4 text-[10px] text-gray-700 font-bold uppercase tracking-tighter">
                  Or Manual Entry
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="First Name"
                  className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
                  {...register("firstName", { required: "Required" })}
                />
                <input
                  placeholder="Last Name"
                  className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
                  {...register("lastName", { required: "Required" })}
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
                {...register("email", { required: "Email is required" })}
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Security Password"
                  className="w-full p-4 bg-black/50 rounded-xl border border-gray-800 text-white text-sm focus:border-amber-500 outline-none transition-all"
                  {...register("password", { required: "Required", minLength: 6 })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-4 text-gray-500 hover:text-white">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.role && <p className="text-amber-500 text-[10px] text-center uppercase tracking-widest">{errors.role.message}</p>}

              <button
                type="submit"
                disabled={isLoading || !selectedRole}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-amber-500/10 active:scale-95 disabled:grayscale disabled:opacity-20"
              >
                {isLoading ? "Validating..." : "Create Account"}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-gray-600 text-sm font-medium tracking-tight">
            Already registered? <Link to="/" className="text-amber-500 hover:text-amber-400 font-black ml-1">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}