// app/api/analytics/route.js

import Visitor from "@/models/Visitor";
import connectDB from "@/lib/db";
import {NextResponse} from "next/server";

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

    const dailyVisits = dailyVisitsAgg.map(d => ({
        date: d._id,
        visits: d.visits,
    }));

    // Top 5 sources
    const topSourcesAgg = await Visitor.aggregate([
        {
            $group: {
                _id: "$source",
                count: {$sum: 1},
            },
        },
        {$sort: {count: -1}},
        {$limit: 5},
    ]);

    const topSources = topSourcesAgg.map(r => ({
        referrer: r._id || "Direct",
        count: r.count,
    }));

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

    // Top 5 browsers
    const topBrowsersAgg = await Visitor.aggregate([
        {$group: {_id: "$browser", count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 5},
    ]);

    const topBrowsers = topBrowsersAgg.map(b => ({
        browser: b._id || "Unknown",
        count: b.count,
    }));


    return NextResponse.json({totalVisitors, totalVisits, dailyVisits, topSources, topOS, topBrowsers});
}
