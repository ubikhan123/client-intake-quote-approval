import { calculateQuote } from "@/lib/quoteEngine";

describe("calculateQuote - Quote Rules Engine", () => {
    // Test 1: Simple single page, no features, no rush
    it("simple 1-page landing, no features, no rush → base price only", () => {
        const result = calculateQuote({
            projectType: "landing",
            pages: 1,
            complexity: "simple",
            timeline: "2to4weeks",
            rush: false,
            features: [],
        });
        expect(result.subtotal).toBe(50);
        expect(result.rushFee).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.total).toBe(50);
        expect(result.items).toHaveLength(1);
    });

    // Test 2: Premium multi-page ecommerce + payments + auth
    it("premium 5-page ecommerce with auth + payments → adds feature prices", () => {
        const result = calculateQuote({
            projectType: "ecommerce",
            pages: 5,
            complexity: "premium",
            timeline: "2to4weeks",
            rush: false,
            features: ["auth", "payments"],
        });
        // 5 pages × 140 = 700, auth 120, payments 250 => subtotal 1070
        expect(result.subtotal).toBe(1070);
        expect(result.rushFee).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.total).toBe(1070);
        expect(result.items).toHaveLength(3);
    });

    // Test 3: Rush flag adds 20% of subtotal
    it("rush fee is 20% of subtotal when rush=true", () => {
        const result = calculateQuote({
            projectType: "corporate",
            pages: 4,
            complexity: "standard",
            timeline: "3days",
            rush: true,
            features: [],
        });
        // 4 × 90 = 360 subtotal → rushFee = 72
        expect(result.subtotal).toBe(360);
        expect(result.rushFee).toBe(72);
        expect(result.discount).toBe(0);
        expect(result.total).toBe(432);
    });

    // Test 4: Volume discount applies -10% when pages >= 10
    it("10-page discount applies -10% of subtotal", () => {
        const result = calculateQuote({
            projectType: "webapp-ui",
            pages: 10,
            complexity: "simple",
            timeline: "2to4weeks",
            rush: false,
            features: [],
        });
        // 10 × 50 = 500, discount = 50
        expect(result.subtotal).toBe(500);
        expect(result.discount).toBe(50);
        expect(result.rushFee).toBe(0);
        expect(result.total).toBe(450);
    });

    // Test 5: Rush + volume discount stacked
    it("rush + volume discount stacked: rushFee on subtotal, discount off subtotal", () => {
        const result = calculateQuote({
            projectType: "webapp-ui",
            pages: 10,
            complexity: "standard",
            timeline: "1week",
            rush: true,
            features: [],
        });
        // subtotal = 10 × 90 = 900, rushFee = 180, discount = 90, total = 900+180-90 = 990
        expect(result.subtotal).toBe(900);
        expect(result.rushFee).toBe(180);
        expect(result.discount).toBe(90);
        expect(result.total).toBe(990);
    });

    // Test 6: All 6 features combined → sum is correct
    it("all 6 features combined adds up correctly", () => {
        const result = calculateQuote({
            projectType: "ecommerce",
            pages: 3,
            complexity: "standard",
            timeline: "2to4weeks",
            rush: false,
            features: ["auth", "adminPanel", "payments", "blogCMS", "multilingual", "animations"],
        });
        // pages: 3 × 90 = 270
        // features: 120+200+250+120+100+80 = 870
        // subtotal = 1140
        expect(result.subtotal).toBe(1140);
        expect(result.items).toHaveLength(7); // 1 page item + 6 feature items
        expect(result.total).toBe(1140);
    });

    // Test 7: Delivery estimate is a non-empty string
    it("deliveryEstimate is a descriptive string", () => {
        const result = calculateQuote({
            projectType: "landing",
            pages: 2,
            complexity: "simple",
            timeline: "2to4weeks",
            rush: false,
            features: [],
        });
        expect(typeof result.deliveryEstimate).toBe("string");
        expect(result.deliveryEstimate.length).toBeGreaterThan(0);
    });

    // Test 8: Rush delivery estimate changes
    it("rush timeline produces 'rush' or 'business days' label", () => {
        const result = calculateQuote({
            projectType: "landing",
            pages: 1,
            complexity: "simple",
            timeline: "3days",
            rush: true,
            features: [],
        });
        expect(result.deliveryEstimate).toContain("business days");
    });
});
