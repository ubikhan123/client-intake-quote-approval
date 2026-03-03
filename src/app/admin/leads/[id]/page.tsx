import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LeadDetailClient from "./LeadDetailClient";

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let lead: any = null;
    try {
        lead = await prisma.lead.findUnique({
            where: { id },
            include: { quote: true },
        });
    } catch {
        // DB not configured
    }

    if (!lead) notFound();

    return <LeadDetailClient lead={lead} />;
}
