import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { calculateQuote } from "@/lib/quoteEngine";

const intakeSchema = z.object({
    projectType: z.enum(["landing", "corporate", "ecommerce", "webapp-ui"]),
    pages: z.number().int().min(1).max(100),
    complexity: z.enum(["simple", "standard", "premium"]),
    timeline: z.enum(["3days", "1week", "2to4weeks"]),
    rush: z.boolean(),
    features: z.array(
        z.enum(["auth", "adminPanel", "payments", "blogCMS", "multilingual", "animations"])
    ),
    budgetRange: z.string().optional(),
    name: z.string().min(1),
    email: z.string().email(),
    company: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = intakeSchema.parse(body);

        const { name, email, company, budgetRange, ...quoteInputs } = data;

        const quoteResult = calculateQuote(quoteInputs);
        const publicToken = uuidv4();

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                company,
                briefJson: quoteInputs as any,
                status: "QUOTED",
                publicToken,
                quote: {
                    create: {
                        itemsJson: quoteResult.items as any,
                        subtotal: quoteResult.subtotal,
                        rushFee: quoteResult.rushFee,
                        discount: quoteResult.discount,
                        total: quoteResult.total,
                        currency: "USD",
                    },
                },
            },
        });

        return NextResponse.json({ publicToken: lead.publicToken }, { status: 201 });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: err.issues }, { status: 400 });
        }
        console.error(err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
