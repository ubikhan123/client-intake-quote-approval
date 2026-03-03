export type ProjectType = "landing" | "corporate" | "ecommerce" | "webapp-ui";
export type Complexity = "simple" | "standard" | "premium";
export type Timeline = "3days" | "1week" | "2to4weeks";
export type Feature =
    | "auth"
    | "adminPanel"
    | "payments"
    | "blogCMS"
    | "multilingual"
    | "animations";

export interface QuoteInput {
    projectType: ProjectType;
    pages: number;
    complexity: Complexity;
    timeline: Timeline;
    rush: boolean;
    features: Feature[];
    budgetRange?: string;
}

export interface QuoteItem {
    label: string;
    qty: number;
    unitPrice: number;
    total: number;
}

export interface QuoteResult {
    items: QuoteItem[];
    subtotal: number;
    rushFee: number;
    discount: number;
    total: number;
    deliveryEstimate: string;
}

const BASE_PER_PAGE: Record<Complexity, number> = {
    simple: 50,
    standard: 90,
    premium: 140,
};

const FEATURE_PRICES: Record<Feature, number> = {
    auth: 120,
    adminPanel: 200,
    payments: 250,
    blogCMS: 120,
    multilingual: 100,
    animations: 80,
};

const FEATURE_LABELS: Record<Feature, string> = {
    auth: "Authentication & User Management",
    adminPanel: "Admin Panel",
    payments: "Payment Integration",
    blogCMS: "Blog / CMS",
    multilingual: "Multilingual Support",
    animations: "Custom Animations",
};

function getDeliveryEstimate(
    pages: number,
    complexity: Complexity,
    timeline: Timeline,
    rush: boolean
): string {
    if (rush) {
        if (timeline === "3days") return "3 business days";
        return "5–7 business days (rush)";
    }
    if (pages <= 3 && complexity === "simple") return "3–5 business days";
    if (pages <= 5) {
        if (complexity === "simple") return "1 week";
        if (complexity === "standard") return "1–2 weeks";
        return "2 weeks";
    }
    if (pages <= 10) {
        if (complexity === "simple") return "2 weeks";
        if (complexity === "standard") return "2–3 weeks";
        return "3–4 weeks";
    }
    if (complexity === "premium") return "4–6 weeks";
    return "3–5 weeks";
}

export function calculateQuote(input: QuoteInput): QuoteResult {
    const { pages, complexity, timeline, rush, features } = input;

    const items: QuoteItem[] = [];

    // Base page cost
    const unitPrice = BASE_PER_PAGE[complexity];
    const pageTotal = unitPrice * pages;
    items.push({
        label: `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} Design (${pages} page${pages !== 1 ? "s" : ""})`,
        qty: pages,
        unitPrice,
        total: pageTotal,
    });

    // Feature add-ons
    for (const feature of features) {
        const price = FEATURE_PRICES[feature];
        items.push({
            label: FEATURE_LABELS[feature],
            qty: 1,
            unitPrice: price,
            total: price,
        });
    }

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);

    // Rush fee: +20% of subtotal
    const rushFee = rush ? Math.round(subtotal * 0.2) : 0;

    // Volume discount: -10% if pages >= 10
    const discount = pages >= 10 ? Math.round(subtotal * 0.1) : 0;

    const total = subtotal + rushFee - discount;

    const deliveryEstimate = getDeliveryEstimate(pages, complexity, timeline, rush);

    return {
        items,
        subtotal,
        rushFee,
        discount,
        total,
        deliveryEstimate,
    };
}
