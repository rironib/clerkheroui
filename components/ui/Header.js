"use client";

import {ThemeSwitch} from "@/components/theme-switch";
import {atomic_age} from "@/config/fonts";
import {siteConfig} from "@/config/site";
import {
    Button,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuToggle,
} from "@heroui/react";
import React, {useState} from "react";
import {usePathname} from "next/navigation";
import {SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";

export const AcmeLogo = () => {
    return (
        <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
            <path
                clipRule="evenodd"
                d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                fill="currentColor"
                fillRule="evenodd"
            />
        </svg>
    );
};

export const navLinks = [
    {label: "Home", href: "/"},
    {label: "Admin", href: "/admin"},
    {label: "Dashboard", href: "/dashboard"},
    {label: "About", href: "/about"},
    {label: "Contact", href: "/contact"},
    {label: "Privacy", href: "/privacy"},
    {label: "Terms", href: "/terms"},
];

export default function Header() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            maxWidth="full"
            className="m-0 p-0"
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="m-0 p-0">
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <Link color="foreground" href="/">
                        <AcmeLogo/>
                        <p
                            className={`${atomic_age.className} hidden text-2xl font-bold sm:block`}
                        >
                            {siteConfig.siteName}
                        </p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {navLinks.map((item, i) => (
                    <NavbarItem key={i} isActive={pathname === item.href}>
                        <Link
                            href={item.href}
                            color={pathname === item.href ? "primary" : "foreground"}
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent className="flex items-center" justify="end">
                <ThemeSwitch/>
                <SignedOut>
                    <NavbarItem>
                        <SignInButton>
                            <Button
                                color="primary"
                                variant="flat"
                            >
                                Login
                            </Button>
                        </SignInButton>
                    </NavbarItem>
                    <NavbarItem>
                        <SignUpButton>
                            <Button
                                color="primary"
                                variant="solid"
                                className="hidden lg:block"
                            >
                                Sign up
                            </Button>
                        </SignUpButton>
                    </NavbarItem>
                </SignedOut>
                <SignedIn>
                    <UserButton/>
                </SignedIn>
            </NavbarContent>
            <NavbarMenu>
                {navLinks.map((item, i) => (
                    <NavbarItem key={i} isActive={pathname === item.href}>
                        <Link
                            href={item.href}
                            color={pathname === item.href ? "primary" : "foreground"}
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
