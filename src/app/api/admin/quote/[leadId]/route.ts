import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const itemSchema = z.object({
    label: z.string(),
    qty: z.number(),
    unitPrice: z.number(),
    total: z.number(),
});

const updateSchema = z.object({
    items: z.array(itemSchema),
});

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ leadId: string }> }
) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leadId } = await params;
    try {
        const body = await req.json();
        const { items } = updateSchema.parse(body);

        const subtotal = items.reduce((acc: number, i: any) => acc + i.total, 0);
        // preserve existing rushFee + discount from DB
        const existing = await prisma.quote.findUnique({ where: { leadId } });
        if (!existing) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

        const total = subtotal + existing.rushFee - existing.discount;

        const quote = await prisma.quote.update({
            where: { leadId },
            data: { itemsJson: items as any, subtotal, total },
        });

        return NextResponse.json({ quote });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
