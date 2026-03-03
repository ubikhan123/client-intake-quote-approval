import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { calculateQuote } from "../src/lib/quoteEngine";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clean existing data
    await prisma.quote.deleteMany();
    await prisma.lead.deleteMany();

    // Seed 1: Simple landing page, status: QUOTED
    const lead1Brief = {
        projectType: "landing",
        pages: 3,
        complexity: "simple",
        timeline: "1week",
        rush: false,
        features: ["animations"],
        budgetRange: "$500-$1000",
    };
    const quote1 = calculateQuote(lead1Brief as any);
    const lead1 = await prisma.lead.create({
        data: {
            id: uuidv4(),
            name: "Sarah Johnson",
            email: "sarah@bloomflorist.com",
            company: "Bloom Florist",
            briefJson: lead1Brief,
            status: "QUOTED",
            publicToken: uuidv4(),
            quote: {
                create: {
                    id: uuidv4(),
                    itemsJson: quote1.items,
                    subtotal: quote1.subtotal,
                    rushFee: quote1.rushFee,
                    discount: quote1.discount,
                    total: quote1.total,
                    currency: "USD",
                },
            },
        },
        include: { quote: true },
    });
    console.log(`✅ Lead 1: ${lead1.name} (${lead1.status}) - $${lead1.quote?.total}`);

    // Seed 2: Premium ecommerce + multiple features, status: APPROVED
    const lead2Brief = {
        projectType: "ecommerce",
        pages: 8,
        complexity: "premium",
        timeline: "2to4weeks",
        rush: false,
        features: ["auth", "payments", "adminPanel"],
        budgetRange: "$5000+",
    };
    const quote2 = calculateQuote(lead2Brief as any);
    const lead2Token = uuidv4();
    const lead2 = await prisma.lead.create({
        data: {
            id: uuidv4(),
            name: "Marcus Chen",
            email: "marcus@themodernshop.io",
            company: "The Modern Shop",
            briefJson: lead2Brief,
            status: "APPROVED",
            publicToken: lead2Token,
            quote: {
                create: {
                    id: uuidv4(),
                    itemsJson: quote2.items,
                    subtotal: quote2.subtotal,
                    rushFee: quote2.rushFee,
                    discount: quote2.discount,
                    total: quote2.total,
                    currency: "USD",
                    approvedAt: new Date(),
                    approvedByName: "Marcus Chen",
                },
            },
        },
        include: { quote: true },
    });
    console.log(`✅ Lead 2: ${lead2.name} (${lead2.status}) - $${lead2.quote?.total}`);

    // Seed 3: Webapp UI, rush, status: NEW
    const lead3Brief = {
        projectType: "webapp-ui",
        pages: 5,
        complexity: "standard",
        timeline: "3days",
        rush: true,
        features: ["auth", "animations"],
        budgetRange: "$1000-$2500",
    };
    const quote3 = calculateQuote(lead3Brief as any);
    const lead3 = await prisma.lead.create({
        data: {
            id: uuidv4(),
            name: "Priya Sharma",
            email: "priya@devspark.co",
            company: "DevSpark",
            briefJson: lead3Brief,
            status: "QUOTED",
            publicToken: uuidv4(),
            quote: {
                create: {
                    id: uuidv4(),
                    itemsJson: quote3.items,
                    subtotal: quote3.subtotal,
                    rushFee: quote3.rushFee,
                    discount: quote3.discount,
                    total: quote3.total,
                    currency: "USD",
                },
            },
        },
        include: { quote: true },
    });
    console.log(`✅ Lead 3: ${lead3.name} (${lead3.status}) - $${lead3.quote?.total}`);

    console.log("\n🎉 Seed complete! 3 leads created.");
    console.log(`\n📎 Share links:`);
    console.log(`   Lead 1: /quote/${lead1.publicToken}`);
    console.log(`   Lead 2: /quote/${lead2.publicToken}`);
    console.log(`   Lead 3: /quote/${lead3.publicToken}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
