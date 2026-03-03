import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminPath(req: NextRequest) {
    const path = req.nextUrl.pathname;
    return path.startsWith("/admin") || path.startsWith("/api/admin");
}

const hasValidClerkKey =
    !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("your_") &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith("pk_");

async function withClerk(req: NextRequest) {
    const { clerkMiddleware, createRouteMatcher } = await import("@clerk/nextjs/server");
    const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
    return clerkMiddleware(async (auth, r) => {
        if (isAdminRoute(r)) await auth.protect();
    })(req, {} as any);
}

export default async function middleware(req: NextRequest) {
    if (hasValidClerkKey) {
        return withClerk(req);
    }
    // No valid Clerk keys — passthrough for public routes, block admin routes
    if (isAdminPath(req)) {
        return NextResponse.json(
            { error: "Admin access requires Clerk auth keys in .env" },
            { status: 503 }
        );
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
