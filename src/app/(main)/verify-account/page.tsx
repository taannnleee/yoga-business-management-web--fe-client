'use client'
import React, { Suspense, useEffect, useState } from 'react';
import Button from "@/components/atom/Button";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import OTPInput from "@/components/atom/OtpInput";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config/url";
import axios from "axios";

interface ILoginPageProps { }

const VerifyAccount: React.FC<ILoginPageProps> = (props) => {
    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = React.useState(false);
    const [isResendingOtp, setIsResendingOtp] = React.useState(false);
    const [email, setEmail] = useState<string | null>(null); // Để lưu email
    const toast = useToast();
    const router = useRouter();

    // Sử dụng useEffect để lấy tham số email từ URL sau khi client đã render
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search); // Lấy các tham số từ URL
        const emailParam = urlParams.get("email"); // Lấy email từ query string
        if (emailParam) {
            setEmail(emailParam); // Lưu email vào state
        }
    }, []); // Chạy một lần khi component mount

    const handlePressVerifyAccount = async (values: any) => {
        if (!email) return; // Kiểm tra xem email đã có chưa

        try {
            setLoading(true);
            const response = await fetch(
                `${API_URL}/api/auth/verifyOTP_register?OTP=${values.otp}&email=${email}`,
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
                router.replace(`/login`);
            } else {
                setLoading(false);
                toast.sendToast("Error", result?.message || "Verification failed", "error");
            }
        } catch (error) {
            setLoading(false);
            toast.sendToast("Error", "Verification failed", "error");
        }
    };

    const handleResendOTP = async () => {
        if (!email) return; // Kiểm tra email

        try {
            setIsResendingOtp(true); // Bắt đầu loading
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
            setIsResendingOtp(false); // Kết thúc loading
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="w-full h-screen flex justify-center items-center bg-white relative">
                {isResendingOtp && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <CircularProgress color="inherit" />
                    </div>
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
                            Verify your account
                        </Typography>

                    </Box>

                    <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

                    <form
                        onSubmit={handleSubmit(handlePressVerifyAccount)}
                        className="w-full flex gap-y-6 flex-col"
                    >
                        <OTPInput
                            control={control}
                            name="otp"
                            label="OTP"
                            placeholder="Enter your OTP code"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="mt-2"
                            isLoading={loading}
                        >
                            Verify your phone number
                        </Button>
                    </form>

                    <Box>
                        <Typography sx={{ fontSize: "14px", color: "GrayText" }}>

                        </Typography>
                    </Box>
                    <Divider sx={{ height: 4, width: "100%" }} />

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "14px",
                                color: "GrayText",
                                textAlign: "center",
                                columnGap: "2px",
                            }}
                        >
                            Did not receive one-time password?
                            <Typography
                                style={{
                                    marginLeft: "4px",
                                    marginRight: "4px",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                }}
                                onClick={handleResendOTP}
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
