// app/api/analytics/route.js

import Visitor from "@/models/Visitor";
import connectDB from "@/lib/db";
import {NextResponse} from "next/server";
import {detect} from "detect-browser";

function parseOSFromUA(ua = "") {
    ua = ua.toLowerCase();
    if (ua.includes("windows nt")) return "Windows";
    if (ua.includes("mac os x")) return "macOS";
    if (ua.includes("android")) return "Android";
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) return "iOS";
    if (ua.includes("linux")) return "Linux";
    if (ua.includes("cros")) return "ChromeOS";
    return "Unknown";
}

function parseReferrer(referrer = "") {
    try {
        if (!referrer) return "Direct";
        const url = new URL(referrer);
        return url.hostname;
    } catch (err) {
        return "Direct";
    }
}

function normalizeBrowser(browser = "") {
    if (!browser) return "Unknown";
    return browser.charAt(0).toUpperCase() + browser.slice(1).toLowerCase();
}


export async function POST(req) {
    try {
        const body = await req.json();
        const {visitorId, userAgent} = body;
        const info = detect(userAgent);

        const os = parseOSFromUA(userAgent) || "";
        if (!os || os.toLowerCase() === "unknown") {
            return NextResponse.json({success: false, message: "Missing OS"}, {status: 400});
        }

        const rawBrowser = info?.name || "";
        const browser = normalizeBrowser(rawBrowser);
        const rawReferrer = body.referrer || "";
        const newReferrer = parseReferrer(rawReferrer);

        await connectDB();

        const exists = await Visitor.findOne({visitorId});
        if (exists) {
            return NextResponse.json({message: "Already exists"});
        }

        const visitor = new Visitor({
            visitorId,
            ip: body.ip,
            source: newReferrer,
            userAgent,
            os,
            browser,
            firstVisit: new Date()
        });

        await visitor.save();
        return NextResponse.json({success: true});
    } catch (error) {
        console.error("POST /api/analytics error:", error);
        return NextResponse.json(
            {success: false, error: error.message},
            {status: 500}
        );
    }

}