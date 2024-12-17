'use client';
import Input from "@/components/atom/Input";
import React, { Suspense, useEffect, useState } from 'react';
import Button from "@/components/atom/Button";
import { Typography, Box, Divider } from "@mui/material";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import OTPInput from "@/components/atom/OtpInput";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import axios from "axios";
import { CircularProgress } from "@mui/material";

interface ILoginPageProps { }

const VerifyAccount: React.FC<ILoginPageProps> = (props) => {
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [isResendingOtp, setIsResendingOtp] = React.useState(false); // For full-page loading state
    const [isVerified, setIsVerified] = React.useState(false); // OTP verification state
    const toast = useToast();
    const router = useRouter();

    // Use state to track if we're on the client side
    const [isClient, setIsClient] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [OTP, setOTP] = useState<string | null>(null);

    // Set isClient to true on client-side mount
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setEmail(searchParams.get("email"));
            setOTP(searchParams.get("OTP"));
        }
    }, []);

    const handlePressVerifyAccount = async (values: any) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/auth/check-otp-change-password?OTP=${values.otp}&email=${email}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();
            if (response.ok) {
                setLoading(false);
                toast.sendToast("Success", "Verify user successfully");
                setIsVerified(true); // Update state when OTP is correct
            } else {
                setLoading(false);
                toast.sendToast("Error", result?.message || "Verification failed", "error");
            }
        } catch (error) {
            setLoading(false);
            toast.sendToast("Error", "Verification failed", "error");
        }
    };

    const handlePressSendOtp = async () => {
        try {
            setIsResendingOtp(true); // Start loading
            const response = await axios.post(
                `${API_URL}/api/auth/send-otp?email=${email}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.sendToast("Success", response.data.message);
        } catch (error) {
            toast.sendToast("Error", "Verification failed", "error");
        } finally {
            setIsResendingOtp(false); // End loading
        }
    };

    const handlePasswordSubmit = async (values: any) => {
        const { password, confirmpassword } = values;

        if (password !== confirmpassword) {
            toast.sendToast("Error", "Passwords do not match", "error");
            return;
        }

        try {
            setLoading(true);

            const bodyData = {
                email: email,
                password: password,
                confirmPassword: confirmpassword,
            };

            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            const result = await response.json();

            if (response.ok) {
                setLoading(false);
                toast.sendToast("Success", "Password changed successfully");
                router.replace(`/login`);
            } else {
                setLoading(false);
                toast.sendToast("Error", result?.message || "Password change failed", "error");
            }
        } catch (error) {
            setLoading(false);
            toast.sendToast("Error", "An error occurred", "error");
        }
    };

    if (!isClient) {
        return null; // Don't render anything until the component has mounted on the client side
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full h-screen flex justify-center items-center bg-white relative">
                {/* Show loading circle if resending OTP */}
                {isResendingOtp && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999, // Ensure overlay is on top
                        }}
                    >
                        <CircularProgress color="primary" />
                    </Box>
                )}

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "24px",
                        width: "500px",
                        alignItems: "center",
                        padding: "36px 36px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                    }}
                >
                    <Box>
                        <Typography sx={{ fontWeight: "600" }} variant="h4">
                            Forgot password
                        </Typography>
                        <Typography sx={{ marginTop: "16px", fontSize: "14px", color: "GrayText" }}>
                            We have sent a verification code to your email, please enter it to verify.
                        </Typography>
                    </Box>

                    <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

                    {!isVerified && (
                        <form onSubmit={handleSubmit(handlePressVerifyAccount)} className="w-full flex gap-y-6 flex-col">
                            <OTPInput
                                control={control}
                                name="otp"
                                label="OTP"
                                placeholder="Enter your OTP code"
                            />
                            <Button type="submit" variant="primary" className="mt-2" isLoading={loading}>
                                Verify account
                            </Button>
                        </form>
                    )}

                    {isVerified && (
                        <form onSubmit={handleSubmit(handlePasswordSubmit)} className="w-full flex gap-y-6 flex-col mt-6">
                            <Input
                                control={control}
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                mode="password"
                                rules={{ required: "Password is required" }}
                            />
                            <Input
                                name="confirmpassword"
                                control={control}
                                label="Confirm password"
                                placeholder="Confirm password"
                                rules={{ required: "Confirm password is required" }}
                            />
                            <Button type="submit" variant="primary" className="mt-2" isLoading={loading}>
                                Change Password
                            </Button>
                        </form>
                    )}

                    <Box>
                        <Typography sx={{ fontSize: "14px", color: "GrayText" }}></Typography>
                    </Box>
                    <Divider sx={{ height: 4, width: "100%" }} />

                    <Box>
                        <Typography sx={{ fontSize: "14px", color: "GrayText", textAlign: "center", columnGap: "2px" }}>
                            Didnt receive OTP?
                            <Typography
                                style={{
                                    marginLeft: "4px",
                                    marginRight: "4px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                                role="button"
                                onClick={handlePressSendOtp}
                                sx={{
                                    "&:hover": {
                                        color: "blue",
                                    },
                                }}
                            >
                                Resend OTP
                            </Typography>
                            After 40s
                        </Typography>
                    </Box>
                </Box>
            </div>
        </Suspense>
    );
};

export default VerifyAccount;
