import PDFDocument from "pdfkit";

interface QuoteItem {
    label: string;
    qty: number;
    unitPrice: number;
    total: number;
}

interface LeadData {
    name: string;
    email: string;
    company?: string | null;
    publicToken: string;
    createdAt: Date;
    status: string;
}

interface QuoteData {
    itemsJson: unknown;
    subtotal: number;
    rushFee: number;
    discount: number;
    total: number;
    currency: string;
    approvedAt?: Date | null;
    approvedByName?: string | null;
}

function formatCurrency(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export function generateQuotePdf(lead: LeadData, quote: QuoteData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: "A4" });
        const chunks: Buffer[] = [];

        doc.on("data", (chunk: Buffer) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        const accent = "#4f46e5"; // indigo
        const lightGray = "#f9fafb";
        const darkGray = "#111827";
        const mutedGray = "#6b7280";

        // ─── Header ───────────────────────────────────────────────────────────
        doc.rect(0, 0, doc.page.width, 90).fill(accent);
        doc
            .fillColor("white")
            .fontSize(26)
            .font("Helvetica-Bold")
            .text("PROJECT QUOTE", 50, 28);
        doc
            .fontSize(10)
            .font("Helvetica")
            .text(`Quote #${lead.publicToken.slice(0, 8).toUpperCase()}`, 50, 60);
        doc
            .text(
                `Issued: ${new Date(lead.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
                300,
                60,
                { align: "right", width: doc.page.width - 350 }
            );

        // ─── Client Info ──────────────────────────────────────────────────────
        doc.moveDown(3);
        doc.fillColor(darkGray).fontSize(13).font("Helvetica-Bold").text("Client Information");
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e5e7eb");
        doc.moveDown(0.5);

        const infoY = doc.y;
        doc
            .fillColor(mutedGray)
            .fontSize(9)
            .font("Helvetica")
            .text("NAME", 50, infoY)
            .text("EMAIL", 200, infoY)
            .text("COMPANY", 380, infoY);
        doc
            .fillColor(darkGray)
            .fontSize(11)
            .font("Helvetica-Bold")
            .text(lead.name, 50, infoY + 14)
            .font("Helvetica")
            .text(lead.email, 200, infoY + 14)
            .text(lead.company ?? "—", 380, infoY + 14);

        // ─── Line Items Table ─────────────────────────────────────────────────
        doc.moveDown(3);
        doc.fillColor(darkGray).fontSize(13).font("Helvetica-Bold").text("Quote Details");
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e5e7eb");
        doc.moveDown(0.5);

        // Table header
        const tableTop = doc.y;
        doc.rect(50, tableTop, doc.page.width - 100, 22).fill(accent);
        doc
            .fillColor("white")
            .fontSize(9)
            .font("Helvetica-Bold")
            .text("DESCRIPTION", 58, tableTop + 7)
            .text("QTY", 340, tableTop + 7)
            .text("UNIT PRICE", 390, tableTop + 7)
            .text("TOTAL", 480, tableTop + 7);

        // Table rows
        const items = (quote.itemsJson as QuoteItem[]) ?? [];
        let rowY = tableTop + 24;
        items.forEach((item, i) => {
            if (i % 2 === 0) {
                doc.rect(50, rowY - 3, doc.page.width - 100, 20).fill(lightGray);
            }
            doc
                .fillColor(darkGray)
                .fontSize(10)
                .font("Helvetica")
                .text(item.label, 58, rowY)
                .text(String(item.qty), 340, rowY)
                .text(formatCurrency(item.unitPrice, quote.currency), 390, rowY)
                .text(formatCurrency(item.total, quote.currency), 480, rowY);
            rowY += 22;
        });

        // ─── Totals ───────────────────────────────────────────────────────────
        doc.moveDown(1);
        const totalsX = 360;
        const totalsWidth = doc.page.width - totalsX - 50;

        const addTotalRow = (label: string, amount: number, bold = false, color = darkGray) => {
            const y = doc.y;
            doc
                .fillColor(mutedGray)
                .fontSize(10)
                .font("Helvetica")
                .text(label, totalsX, y, { width: totalsWidth - 80 });
            doc
                .fillColor(color)
                .font(bold ? "Helvetica-Bold" : "Helvetica")
                .text(formatCurrency(amount, quote.currency), totalsX + totalsWidth - 80, y, {
                    width: 80,
                    align: "right",
                });
            doc.moveDown(0.4);
        };

        addTotalRow("Subtotal", quote.subtotal);
        if (quote.rushFee > 0) addTotalRow("Rush Fee (+20%)", quote.rushFee, false, "#ef4444");
        if (quote.discount > 0) addTotalRow("Volume Discount (−10%)", -quote.discount, false, "#10b981");

        doc.moveDown(0.2);
        doc
            .moveTo(totalsX, doc.y)
            .lineTo(doc.page.width - 50, doc.y)
            .stroke("#e5e7eb");
        doc.moveDown(0.4);
        addTotalRow("TOTAL", quote.total, true, accent);

        // ─── Approval Section ─────────────────────────────────────────────────
        doc.moveDown(2);
        doc.fillColor(darkGray).fontSize(13).font("Helvetica-Bold").text("Approval Status");
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke("#e5e7eb");
        doc.moveDown(0.5);

        if (quote.approvedAt && quote.approvedByName) {
            doc
                .rect(50, doc.y, doc.page.width - 100, 50)
                .fill("#ecfdf5");
            const approvalY = doc.y + 10;
            doc
                .fillColor("#065f46")
                .fontSize(11)
                .font("Helvetica-Bold")
                .text("✓ APPROVED", 58, approvalY);
            doc
                .fillColor("#064e3b")
                .fontSize(10)
                .font("Helvetica")
                .text(
                    `Approved by: ${quote.approvedByName}  •  ${new Date(quote.approvedAt).toLocaleString("en-US")}`,
                    58,
                    approvalY + 18
                );
            doc.moveDown(3.5);
        } else {
            doc
                .fillColor(mutedGray)
                .fontSize(10)
                .font("Helvetica")
                .text("Awaiting client approval. Visit the quote link to review and approve.", { align: "left" });
        }

        // ─── Footer ───────────────────────────────────────────────────────────
        doc.moveDown(3);
        doc
            .fillColor(mutedGray)
            .fontSize(8)
            .text("Thank you for your interest. This quote is valid for 30 days from the issue date.", {
                align: "center",
            });

        doc.end();
    });
}
