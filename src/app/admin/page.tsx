import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { status } = await searchParams;
    const where = status && status !== "ALL" ? { status: status as any } : {};

    const leads = await prisma.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { quote: { select: { total: true, approvedAt: true } } },
    });

    return <AdminDashboardClient leads={leads as any} activeStatus={status ?? "ALL"} />;
}
