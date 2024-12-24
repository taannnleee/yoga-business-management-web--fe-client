"use client";

import Button from "@/components/atom/Button";
import Input from "@/components/atom/Input";
import { Typography, Box, Divider, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useForm } from "react-hook-form";
import React from "react";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/config/url";
var token = null;
if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
  token = localStorage.getItem("accessToken");
}

interface ILoginPageProps { }

const LoginPage: React.FC<ILoginPageProps> = (props) => {
  const { control, handleSubmit } = useForm();
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlePressLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      const result = await response.json();


      if (response.ok && result.status === 200) {
        setLoading(false);
        // Store tokens in local storage
        localStorage.setItem("accessToken", result.data.accesstoken);
        localStorage.setItem("refreshToken", result.data.refreshtoken);

        toast.sendToast("Success", "Login successfully");

        // Redirect to home page
        router.replace("/home");
      } else if (result.status === 1013) {
        // Tài khoản chưa được kích hoạt, gọi API để lấy email
        toast.sendToast("Error", "Tài khoản chưa được kích hoạt", "error");

        // Gọi API để lấy email
        const emailResponse = await fetch(
          `${API_URL}/api/user/get-email-by-username?userName=${values.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const emailResult = await emailResponse.json();

        if (emailResponse.ok && emailResult.status === 200) {
          const email = emailResult.data;

          // Gọi API để gửi OTP đến email
          const otpResponse = await fetch(
            `${API_URL}/api/auth/send-otp?email=${email}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const otpResult = await otpResponse.json();

          if (otpResponse.ok && otpResult.status === 200) {
            // Nếu gửi OTP thành công, chuyển tới trang verify-account với email
            router.replace(`/verify-account?email=${email}`);
          } else {
            toast.sendToast("Error", "Failed to send OTP", "error");
          }
        } else {
          toast.sendToast("Error", "Failed to retrieve email", "error");
        }

        setLoading(false);
      } else {
        setLoading(false);
        toast.sendToast("Error", "Login failed", "error");
      }
    } catch (error: any) {
      setLoading(false);
      toast.sendToast(
        "Error",
        error?.response?.data?.message || "Login error",
        "error"
      );
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
        <Box>
          <Typography sx={{ fontWeight: "600" }} variant="h4">
            Sign in
          </Typography>
          <Typography
            sx={{ marginTop: "16px", fontSize: "14px", color: "GrayText" }}
          >
            Welcome to Market Floor, a marketplace connecting retailers and
            customers. Here, you can find a wide variety of products from
            trusted sellers. Enjoy a seamless shopping experience with us.
          </Typography>
        </Box>

        <Button variant="secondary">
          <span>Sign in with Google </span>
          <Image
            alt="google-logo"
            src={require("../../../assets/icons/google.png")}
            width={20}
            height={20}
            style={{ marginLeft: "8px" }}
          />
        </Button>

        <Divider sx={{ height: 4, width: "100%", margin: "4px 0" }} />

        <form
          onSubmit={handleSubmit(handlePressLogin)}
          className="w-full flex gap-y-6 flex-col"
        >
          <Input
            name="username" // Changed from phoneNumber to username
            control={control}
            label="Username"
            placeholder="Enter your username"
            rules={{ required: "Username is required" }} // Updated error message
          />
          <Input
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            mode="password"
            rules={{ required: "Password is required" }}
          />
          <Button
            type="submit"
            variant="primary"
            className="mt-2"
            isLoading={loading}
          >
            Continue with username
          </Button>

          <CircularProgress size={24} />
        </form>

        <Box>
          <Typography sx={{ fontSize: "14px", color: "GrayText" }}>
            By signing in, you agree to Market Floors Terms of Service and Privacy
            Policy, as well as the Cookie Policy.
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
            Dont have an account?
            <Link
              style={{ marginLeft: "4px", textDecoration: "underline" }}
              href="/create-account"
            >
              Create one
            </Link>
          </Typography>
          <Typography
            sx={{
              fontSize: "14px",
              color: "GrayText",
              textAlign: "center",
              columnGap: "2px",
            }}
          >
            <Link
              style={{ marginLeft: "4px", textDecoration: "underline" }}
              href="/forgot-password"
            >
              Forgot password
            </Link>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default LoginPage;
