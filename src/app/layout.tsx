// src/app/layout.tsx (hoặc tương tự)

import { Lexend } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import RootLayoutClient from "@/components/template/RootLayoutClient"; // Import client-side layout

const inter = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "The Yoga",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <title>The Yoga</title>
        </head>
        <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient> {/* Wrap children with client-side layout */}
        </body>
        </html>
    );
}
