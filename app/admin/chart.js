"use client";

import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";

export default function Chart({data}) {
    const chartData = data || res.dailyVisits;
    return (
        <div style={{width: "100%"}}>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart
                    width={500}
                    height={200}
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line
                        connectNulls
                        type="monotone"
                        dataKey="visits"
                        stroke="#8884d8"
                        fill="#8884d8"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
