import Chart from "@/app/admin/chart";
import {siteConfig} from "@/config/site";

export const generateMetadata = async () => {
    const {admin: metadata} = siteConfig;
    const {title, description, link, keywords, robots} = metadata;
    return {
        title: title || siteConfig.title,
        description: description || siteConfig.description,
        keywords: keywords || siteConfig.keywords,
        robots: robots || siteConfig.robots,
        alternates: {
            canonical: `${siteConfig.baseUrl}${link ? link : ""}`,
        },
        openGraph: {
            title: title || siteConfig.title,
            description: description || siteConfig.description,

            url: `${siteConfig.baseUrl}${link ? link : ""}`,
            type: "website",
            site_name: siteConfig.siteName,
            locale: "en_US",
            images: [
                {
                    url: siteConfig.socialCover,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            url: `${siteConfig.baseUrl}${link ? link : ""}`,
            title: title || siteConfig.title,
            description: description || siteConfig.description,
            images: [siteConfig.socialCover],
            site: `@${siteConfig.siteName}`,
            creator: `@${siteConfig.author}`,
        },
    };
};

export default async function Page() {
    let analytics = null;
    let error = null;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analytics`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-internal-analytics": "true",
            },
            cache: "no-store"
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        analytics = await res.json();
    } catch (err) {
        error = err.message;
    }

    return (
        <div className="grow">
            <div className="my-4 text-center text-3xl">Dashboard</div>
            {error && <div className="text-center text-red-500">{error}</div>}
            {!error && (
                <Chart data={analytics?.dailyVisits}/>
            )}
        </div>
    );
}
