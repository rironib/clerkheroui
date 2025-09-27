import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import {hind_siliguri} from "@/config/fonts";
import {siteConfig} from "@/config/site";

export const metadata = async () => {
    return {
        title: siteConfig.title,
        description: siteConfig.description,
        keywords: siteConfig.keywords,
        robots: siteConfig.robots,
        alternates: {
            canonical: siteConfig.baseUrl,
        },
    };
};

export default function RootLayout({children}) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
            <body className={`${hind_siliguri.className}`}>
            <div className="flex min-h-screen flex-col justify-between">
                <Header/>
                {children}
                <Footer/>
            </div>
            </body>
            </html>
        </ClerkProvider>
    )
}
