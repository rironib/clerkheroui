import React from 'react';
import Link from "next/link";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import {atomic_age} from "@/config/fonts";
import {siteConfig} from "@/config/site";

const Header = () => {
    return (
        <header
            className="sticky z-50 top-0 bg-black flex justify-between border-b border-slate-700 items-center p-4 gap-4 h-16">
            <div
                className={`${atomic_age.className} hidden text-2xl font-bold sm:block`}
            >
                {siteConfig.siteName}
            </div>
            <div className="flex gap-4 items-center">
                <Link href="/">Home</Link>
                <Link href="/admin">Admin</Link>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/page/about">About</Link>
                <Link href="/page/privacy">Privacy</Link>
                <Link href="/page/terms">Terms</Link>
            </div>
            <div className="flex gap-4 items-center">
                <SignedOut>
                    <SignInButton/>
                    <SignUpButton>
                        <button
                            className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </div>
        </header>
    );
};

export default Header;