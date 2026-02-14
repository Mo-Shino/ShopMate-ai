"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MessageSquare, ScanBarcode, Percent, Gamepad2, ListChecks, Menu } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/chat", icon: MessageSquare, label: "Chat" },
    { href: "/list", icon: ListChecks, label: "List" },
    { href: "/scan", icon: ScanBarcode, label: "Scan" },
    { href: "/offers", icon: Percent, label: "Offers" },
    { href: "/kids", icon: Gamepad2, label: "Kids" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed z-50 bg-primary-brown text-bg-cream shadow-2xl transition-all duration-300
            /* Mobile: Bottom Nav */
            bottom-0 left-0 w-full h-20 flex flex-row items-center justify-between px-6 py-2
            /* Desktop: Sidebar */
            md:top-0 md:left-0 md:h-full md:w-24 md:flex-col md:justify-start md:py-6 md:px-0
        ">
            {/* Menu Icon (Desktop Only) */}
            <div className="hidden md:block mb-10">
                <Menu className="w-8 h-8 opacity-80" />
            </div>

            <nav className="flex-1 flex w-full
                /* Mobile: Horizontal Row */
                flex-row justify-between items-center gap-1
                /* Desktop: Vertical Column */
                md:flex-col md:gap-6 md:px-3
            ">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center rounded-2xl transition-all duration-300 relative group",
                                /* Mobile Sizing */
                                "w-12 h-12",
                                /* Desktop Sizing */
                                "md:w-full md:aspect-square",
                                isActive
                                    ? "bg-bg-cream text-primary-brown shadow-lg scale-110 md:scale-105"
                                    : "hover:bg-white/10 text-bg-cream/60 hover:text-bg-cream"
                            )}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <>
                                    {/* Desktop: Right Bar */}
                                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-brand-orange rounded-l-full" />
                                    {/* Mobile: Top Dot/Bar (Optional, currently just using bg color to indicate active) */}
                                </>
                            )}

                            <item.icon className={clsx("mb-0 md:mb-1", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]", "w-6 h-6 md:w-7 md:h-7")} />
                            {/* Label: Hidden on Mobile, Visible on large Desktop if needed, but keeping icon-only for now to match style */}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
