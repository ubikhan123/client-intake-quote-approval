import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQuotePdf } from "@/lib/pdf";

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

        if (!lead || !lead.quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 });
        }

        const pdfBuffer = await generateQuotePdf(lead as any, lead.quote as any);
        const uint8Array = new Uint8Array(pdfBuffer);

        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="quote-${token.slice(0, 8)}.pdf"`,
                "Content-Length": pdfBuffer.byteLength.toString(),
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
