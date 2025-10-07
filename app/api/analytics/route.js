// app/api/analytics/route.js

import Visitor from "@/models/Visitor";
import connectDB from "@/lib/db";
import {NextResponse} from "next/server";
import useragent from "useragent";

export async function POST(req) {
    try {
        const body = await req.json();
        const {visitorId, userAgent} = body;
        const parsed = useragent.parse(userAgent);
        const os = parsed.os.family;

        // ❌ Skip if OS is missing or empty string
        if (!os || os.trim() === "") {
            return NextResponse.json(
                {success: false, message: "Missing or empty OS field"},
                {status: 400}
            );
        }

        await connectDB();

        const exists = await Visitor.findOne({visitorId});
        if (exists) {
            return Response.json({message: "Already exists"});
        }

        body.browser = parsed.family;
        const visitor = new Visitor(body);
        await visitor.save();

        return Response.json({success: true});
    } catch (error) {
        {
            console.error("POST /api/analytics error:", error);
            return NextResponse.json(
                {success: false, error: error.message},
                {status: 500}
            );
        }
    }
}

export async function GET() {
    await connectDB();

    // Total unique visitors
    const totalVisitors = await Visitor.countDocuments();

    // Total visits = assume each visitor visited once
    const totalVisits = totalVisitors;

    // Visits per day (last 7 days based on firstVisit)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const dailyVisitsAgg = await Visitor.aggregate([
        {$match: {firstVisit: {$gte: last7Days}}},
        {
            $group: {
                _id: {$dateToString: {format: "%Y-%m-%d", date: "$firstVisit"}},
                visits: {$sum: 1},
            },
        },
        {$sort: {_id: 1}},
    ]);

    // Top 5 referrers
    const topReferrersAgg = await Visitor.aggregate([
        {
            $group: {
                _id: "$referrer",
                count: {$sum: 1},
            },
        },
        {$sort: {count: -1}},
        {$limit: 5},
    ]);

    // Top 5 OS
    const topOSAgg = await Visitor.aggregate([
        {
            $group: {
                _id: "$os",
                count: {$sum: 1},
            },
        },
        {$sort: {count: -1}},
        {$limit: 5},
    ]);

    const topOS = topOSAgg.map(o => ({
        os: o._id || "Unknown",
        count: o.count,
    }));


    const dailyVisits = dailyVisitsAgg.map(d => ({
        date: d._id,
        visits: d.visits,
    }));

    const topReferrers = topReferrersAgg.map(r => ({
        referrer: r._id || "Direct",
        count: r.count,
    }));

    return NextResponse.json({
        totalVisitors,
        totalVisits,
        dailyVisits,
        topReferrers, topOS
    });
}
