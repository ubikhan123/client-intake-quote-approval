import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const approveSchema = z.object({
    approvedByName: z.string().min(1),
    acceptedTerms: z.literal(true),
});

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;
    try {
        const body = await req.json();
        const { approvedByName } = approveSchema.parse(body);

        const lead = await prisma.lead.findUnique({
            where: { publicToken: token },
            include: { quote: true },
        });

        if (!lead) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        if (lead.quote?.approvedAt) {
            return NextResponse.json({ error: "Quote already approved" }, { status: 409 });
        }

        await prisma.$transaction([
            prisma.quote.update({
                where: { leadId: lead.id },
                data: { approvedAt: new Date(), approvedByName },
            }),
            prisma.lead.update({
                where: { id: lead.id },
                data: { status: "APPROVED" },
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 });
        }
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
