import Link from "next/link";
import {siteConfig} from "@/config/site";
// import {Button} from "@heroui/react";

export const generateMetadata = async () => {
    const {error: metadata} = siteConfig;
    const {title, description, link, keywords, robots} = metadata;
    return {
        title: title || siteConfig.title,
        description: description || siteConfig.description,
        keywords: keywords || siteConfig.keywords,
        robots: robots || siteConfig.robots,
        alternates: {
            canonical: `${siteConfig.baseUrl}${link ? link : ""}`,
        },
    };
};

export default function Error() {
    return (
        <div className="flex min-h-[80dvh] px-4 flex-col items-center justify-center">
            <h1 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-red-500">
                Something went wrong!
            </h1>
            <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                An error occurred. Please refresh the page or try again later.
            </p>
            <Link href="/" className="mt-8 rounded bg-blue-500 px-4 py-2 text-white">
                Go to Homepage
            </Link>
        </div>
    );
}
