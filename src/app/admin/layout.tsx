import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const hasValidClerkKey =
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
        !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("your_");

    if (hasValidClerkKey) {
        const { auth } = await import("@clerk/nextjs/server");
        const { redirect } = await import("next/navigation");
        const { UserButton } = await import("@clerk/nextjs");

        const { userId } = await auth();
        if (!userId) redirect("/sign-in");

        return (
            <div className="min-h-screen bg-gray-950 flex flex-col">
                <header className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl">⬡</span>
                            <span className="font-bold">ClientQuote</span>
                        </Link>
                        <span className="text-gray-700">|</span>
                        <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/quote" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                            + New Quote
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </header>
                <div className="flex-1">{children}</div>
            </div>
        );
    }

    // Demo mode without Clerk
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <header className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl">⬡</span>
                        <span className="font-bold">ClientQuote</span>
                    </Link>
                    <span className="text-gray-700">|</span>
                    <Link href="/admin" className="text-sm text-gray-400 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/quote" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        + New Quote
                    </Link>
                    <span className="text-xs text-amber-400/70 glass border border-amber-500/20 px-3 py-1 rounded-lg">
                        Demo Mode — Add Clerk keys for auth
                    </span>
                </div>
            </header>
            <div className="flex-1">{children}</div>
        </div>
    );
}
