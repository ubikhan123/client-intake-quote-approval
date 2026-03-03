import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    try {
        const lead = await prisma.lead.findUnique({
            where: { publicToken: token },
            include: { quote: true },
        });

        if (!lead) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        return NextResponse.json({ lead });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
