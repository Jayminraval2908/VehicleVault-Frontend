import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

// ✅ import your axios instance
import api from '../../services/api'; 

const ForgotPassword = () => {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // ✅ use api instead of fetch + localhost
            const res = await api.post("/user/forgotpassword", {
                email
            });

            toast.success(res.data.message);
            setEmail("");

        } catch (err) {
            console.log(err);
            toast.error(
                err.response?.data?.message || "Something went wrong"
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
                        Reset <span className="text-[#D4AF37]">Password</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Enter your email to receive a secure reset link
                    </p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>

                </form>

                {/* FOOTER */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Remember your password?{" "}
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

export default ForgotPassword;