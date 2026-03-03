import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "ClientQuote — Professional Project Quotes",
    description:
        "Get an instant professional quote for your web project. Fill out a short brief and receive a detailed, approvable quote in seconds.",
};

// Clerk is only loaded when valid keys are configured
const hasValidClerkKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("your_");

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    if (hasValidClerkKey) {
        const { ClerkProvider } = await import("@clerk/nextjs");
        return (
            <ClerkProvider>
                <html lang="en" className={inter.variable}>
                    <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
                </html>
            </ClerkProvider>
        );
    }

    return (
        <html lang="en" className={inter.variable}>
            <body className="bg-gray-950 text-gray-100 antialiased">{children}</body>
        </html>
    );
}
