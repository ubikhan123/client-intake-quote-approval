import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

// If Clerk keys aren't configured, only block admin routes with a helpful message
const hasClerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("your_");

export default hasClerkKey
    ? clerkMiddleware(async (auth, req) => {
        if (isAdminRoute(req)) {
            await auth.protect();
        }
    })
    : function middleware(req: NextRequest) {
        if (isAdminRoute(req)) {
            return NextResponse.json(
                { error: "Admin access requires Clerk auth keys in .env" },
                { status: 503 }
            );
        }
        return NextResponse.next();
    };

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
