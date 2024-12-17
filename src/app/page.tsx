'use client'
import HeroSection from "@/components/organisms/Hero";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { redirect } from "next/navigation";

import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import HomePage from "@/app/(main)/home/page";

let token: string | null = null;
if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
    token = localStorage.getItem("accessToken");
}
export default function Home() {
    const router = useRouter();

    useLayoutEffect(() => {
        // Kiểm tra nếu accessToken tồn tại trong localStorage

        if (token) {
            // Nếu tồn tại, redirect đến "/home"
            router.push("/home");
        } else {
            // Nếu không, redirect đến "/login"
            router.push("/login");
        }
    }, [router]);

    return (
        <HomePage />
    );
}