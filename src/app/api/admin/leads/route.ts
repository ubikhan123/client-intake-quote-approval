import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = 20;

    const where = status ? { status: status as any } : {};

    const [leads, total] = await Promise.all([
        prisma.lead.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: { quote: { select: { total: true, approvedAt: true } } },
        }),
        prisma.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, limit });
}
