import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
                    <Link
                        href="/quote"
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        + New Quote
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </header>
            <div className="flex-1">{children}</div>
        </div>
    );
}
