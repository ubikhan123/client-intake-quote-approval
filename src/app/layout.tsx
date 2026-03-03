import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "ClientQuote — Professional Project Quotes",
    description:
        "Get an instant professional quote for your web project. Fill out a short brief and receive a detailed, approvable quote in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en" className={inter.variable}>
                <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
            </html>
        </ClerkProvider>
    );
}
