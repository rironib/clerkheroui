import {NextResponse} from "next/server";
import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";
import {generateVisitorId} from "@/lib/generateVisitorId";
import {axiosPublic} from "@/lib/useAxiosPublic";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const res = NextResponse.next();

    if (req.headers.get("x-internal-analytics") === "true") {
        return NextResponse.next();
    }

    // -----------------------------
    // 🔹 1. Clerk Authentication
    // -----------------------------

    if (isAdminRoute(req)) {
        const {sessionClaims} = await auth();
        if (!sessionClaims?.metadata?.isAdmin) {
            const url = new URL("/dashboard", req.url);
            return NextResponse.redirect(url);
        }
    }

    if (isProtectedRoute(req)) await auth.protect();

    // -----------------------------
    // 🔹 2. Analytics Visitor Tracking
    // -----------------------------
    const pathname = req.nextUrl.pathname;

    // Skip static files, _next assets, and favicon
    if (
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/static/") ||
        pathname === "/favicon.ico"
    ) {
        return res;
    }
    const cookieName = "visitorId";
    const visitorId = req.cookies.get(cookieName)?.value;

    if (!visitorId) {
        const newVisitorId = generateVisitorId();

        // Calculate seconds until today 23:59:59 for cookie expiry
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const maxAgeSeconds = Math.floor((endOfDay.getTime() - now.getTime()) / 1000);

        // Set visitorId cookie
        res.cookies.set(cookieName, newVisitorId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: maxAgeSeconds,
            path: "/",
        });

        axiosPublic.post("/api/analytics", {
            visitorId: newVisitorId,
            ip: req.headers.get("x-forwarded-for")?.split(",")[0] || "",
            os: req.headers.get("sec-ch-ua-platform")?.replace(/"/g, "") || "",
            userAgent: req.headers.get("user-agent") || "",
            referrer: req.headers.get("referer") || "",
        }, {
            headers: {
                "x-internal-analytics": "true",
            },
            timeout: 2000,
        })
    }
    return res;
});

export const config = {
    matcher: [
        "/((?!_next|static|favicon\\.ico).*)",
        "/api/:path*",
    ],
};