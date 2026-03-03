import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
    status: z.enum(["NEW", "QUOTED", "APPROVED", "ARCHIVED"]),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    try {
        const body = await req.json();
        const { status } = updateSchema.parse(body);

        const lead = await prisma.lead.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ lead });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const lead = await prisma.lead.findUnique({
        where: { id },
        include: { quote: true },
    });

    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
}
