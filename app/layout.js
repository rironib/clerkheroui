import "./globals.css";
import {siteConfig} from "@/config/site";
import {Providers} from "@/app/providers";
import {ClerkProvider} from "@clerk/nextjs";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import {hind_siliguri} from "@/config/fonts";
import Analytics from "@/components/Analytics";

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
            <head>
                <Analytics/>
            </head>
            <body className={`${hind_siliguri.className}`}>
            <Providers themeProps={{attribute: "class", defaultTheme: "dark"}}>
                <div className="flex min-h-screen flex-col justify-between">
                    <Header/>
                    {children}
                    <Footer/>
                </div>
            </Providers>
            </body>
            </html>
        </ClerkProvider>
    )
}
