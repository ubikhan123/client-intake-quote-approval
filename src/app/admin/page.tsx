import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string }>;
}) {
    const { status } = await searchParams;
    const where = status && status !== "ALL" ? { status: status as any } : {};

    let leads: any[] = [];
    try {
        leads = await prisma.lead.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { quote: { select: { total: true, approvedAt: true } } },
        });
    } catch {
        // DB not configured yet — show empty state
    }

    return <AdminDashboardClient leads={leads} activeStatus={status ?? "ALL"} />;
}
