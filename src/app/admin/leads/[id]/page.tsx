import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LeadDetailClient from "./LeadDetailClient";

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const { id } = await params;
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: { quote: true },
    });

    if (!lead) notFound();

    return <LeadDetailClient lead={lead as any} />;
}
