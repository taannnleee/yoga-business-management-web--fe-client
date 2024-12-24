"use client";
import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Box, CircularProgress, Divider } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/useToast";
import axios from "axios";
import { API_URL } from "@/config/url"; // API URL
import { useRouter } from "next/navigation";
interface IForgotPasswordProps { }

const ForgotPassword: React.FC<IForgotPasswordProps> = () => {
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const router = useRouter();

    // Use react-hook-form for managing form state
    const { control, handleSubmit } = useForm();

    // Function to handle sending OTP
    const handleSendEmail = async (data: any) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/send-otp?email=${data.email}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle success
            toast.sendToast("Success", response.data.message);
            router.replace(`/verify-change-password?email=${data.email}`);
        } catch (error: any) {
            // Handle error
            toast.sendToast("Error", error.response?.data?.message || "Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-auto flex justify-center items-center bg-white">
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
                <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />
                <form
                    onSubmit={handleSubmit(handleSendEmail)}
                    className="w-full flex gap-y-6 flex-col"
                >
                    <Input
                        name="email"
                        control={control}
                        label="Email"
                        placeholder="Enter your email"
                        rules={{ required: "Email is required" }} // Validate email field
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="mt-2"
                        isLoading={loading} // Show loading state on button
                    >
                        Send Email
                    </Button>

                    {/* Show loading spinner while waiting for API response */}
                    {loading && <CircularProgress size={24} />}
                </form>
            </Box>
        </div>
    );
};

export default ForgotPassword;
